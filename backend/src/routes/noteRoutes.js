const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");
const { verifyEnseignant, verifyParentOrEnseignantRobust, verifyParent } = require("../middlewares/authMiddleware");
const PDFDocument = require('pdfkit');
const mongoose = require('mongoose');
const Note = require('../models/Note');
const Eleve = require('../models/Eleve');
const Periode = require('../models/Periode');
const Competence = require('../models/Competence');
const Classe = require('../models/Classe');
const SousCompetence = require('../models/SousCompetence');
const Teacher = require('../models/Teacher');

// ✅ Bien vérifier que les fonctions appelées existent dans le contrôleur
// Il ne reste que la route d'ajout/modification des notes
router.post("/multiple", verifyEnseignant, noteController.addOrUpdateMultipleNotes);
router.get('/existantes', verifyEnseignant, noteController.checkExistingNotes);
router.get('/by-periode-competence', verifyParentOrEnseignantRobust, async (req, res) => {
  try {
    const { periode, competence } = req.query;
    if (!periode || !competence) {
      return res.status(400).json({ message: "Période et compétence requises" });
    }
    let filter = { periode, competence };
    if (req.authUser.role === 'enseignant') {
      filter.enseignant = req.authUser.mongoId;
    } else if (req.authUser.role === 'parent') {
      // Ne montrer que les notes des enfants du parent
      const parent = await require('../models/Parents').findById(req.authUser.parentId);
      if (!parent) return res.status(401).json({ message: 'Parent non trouvé' });
      filter.eleve = { $in: parent.enfants };
    }
    const Note = require('../models/Note');
    const notes = await Note.find(filter)
      .populate('eleve', 'nom prenom')
      .populate('sousCompetence', 'nom');
    res.json({ notes });
    } catch (error) {
    console.error('Erreur récupération notes:', error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});
router.get('/export-pdf', verifyEnseignant, async (req, res) => {
  try {
    const { periodeId, competenceId } = req.query;
    const enseignantId = req.authUser.mongoId;
    if (!periodeId || !competenceId) {
      return res.status(400).json({ message: "Période et compétence requises" });
    }

    const competence = await Competence.findById(competenceId); // Pour le nom
    const periode = await Periode.findById(periodeId); // Pour le nom
    const sousCompetences = await SousCompetence.find({ competence: competenceId });

    const notes = await Note.find({
      periode: periodeId,
      competence: competenceId,
      enseignant: enseignantId
    })
      .populate('eleve', 'nom prenom')
      .populate('sousCompetence', 'nom');

    const notesParEleve = {};
    notes.forEach(note => {
      const eleveId = note.eleve?._id?.toString();
      if (!eleveId) return;
      if (!notesParEleve[eleveId]) {
        notesParEleve[eleveId] = {
          eleve: note.eleve,
          notes: {},
          total: 0
        };
      }
      notesParEleve[eleveId].notes[note.sousCompetence?._id] = note.note;
      notesParEleve[eleveId].total += Number(note.note) || 0;
    });

    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const filename = `notes-${Date.now()}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    doc.pipe(res);

    // 🔵 Titre stylisé
    doc
      .fillColor('#2563eb') // Bleu foncé
      .fontSize(22)
      .font('Helvetica-Bold')
      .text(`📝 Notes - ${competence.nom}`, { align: 'center' });

    doc
      .moveDown(0.5)
      .fontSize(12)
      .fillColor('#444')
      .font('Helvetica')
      .text(`Période : ${periode.nom}`, { align: 'center' });

    doc.moveDown(1);

    // 🧾 En-tête du tableau (sécurisation totale)
    const tableHeaders = ['Élève', ...sousCompetences.map(sc => sc.nom), 'Total'];
    const colWidths = [140, ...sousCompetences.map(() => 60), 60].map(w => safeNumber(w, 60));
    const totalWidth = colWidths.reduce((a, b) => safeNumber(a, 60) + safeNumber(b, 60), 0);
    let y = safeNumber(doc.y);
    let x = safeNumber(doc.x);

    doc.save();
    doc.rect(x, y, totalWidth, 22).fill('#2563eb'); // En-tête bleu
    doc.fillColor('white').font('Helvetica-Bold');
    x = safeNumber(doc.x);
    tableHeaders.forEach((header, i) => {
      doc.text(header, x, y + 6, {
        width: colWidths[i],
        align: 'center',
        continued: i < tableHeaders.length - 1
      });
      x += colWidths[i];
    });
    doc.restore();
    y += 22;

    // 🔁 Lignes des élèves (sécurisation totale)
    const lignes = Object.values(notesParEleve);
    lignes.forEach((row, index) => {
      x = safeNumber(doc.x);
      const bgColor = index % 2 === 0 ? '#ffffff' : '#f9fafb';
      doc.rect(x, y, totalWidth, 20).fill(bgColor);
      doc.fillColor('#222').font('Helvetica');

      let xCol = safeNumber(x);
      doc.text(`${row.eleve.nom} ${row.eleve.prenom}`, xCol + 5, y + 5, {
        width: colWidths[0],
        align: 'left'
      });
      xCol += colWidths[0];

      sousCompetences.forEach((sc, i) => {
        let note = row.notes[sc._id] !== undefined ? row.notes[sc._id] : '-';
        // Si la note est NaN, afficher '-'
        if (note !== null && note !== undefined && isNaN(note)) note = '-';
        doc.text(safeText(note), xCol, y + 5, {
          width: colWidths[i + 1],
          align: 'center'
        });
        xCol += colWidths[i + 1];
      });

      // 🟡 Total en gras
      let totalAffiche = isNaN(row.total) ? '-' : row.total;
      doc.font('Helvetica-Bold').text(safeText(totalAffiche), xCol, y + 5, {
        width: colWidths[colWidths.length - 1],
        align: 'center'
      });

      y += 20;
    });

    // 📆 Pied de page
    doc.moveDown(2);
    doc
      .fontSize(10)
      .fillColor('#666')
      .text('Document généré automatiquement le ' + new Date().toLocaleDateString(), {
        align: 'right'
      });

    doc.end();
  } catch (error) {
    console.error('Erreur export PDF:', error);
    res.status(500).json({ message: "Erreur lors de la génération du PDF" });
  }
});


// Route parent : voir les notes d'un de ses enfants
router.get('/parent/notes', verifyParent, async (req, res) => {
  try {
    const { enfantId, periode, competence } = req.query;
    if (!enfantId || !periode || !competence) {
      return res.status(400).json({ message: "enfantId, période et compétence requis" });
    }
    // Vérifier que l'enfant appartient bien au parent connecté
    const parent = await require('../models/Parents').findById(req.parentId);
    if (!parent || !parent.enfants.map(e => e.toString()).includes(enfantId)) {
      return res.status(403).json({ message: "Accès interdit à cet enfant" });
    }
    const Note = require('../models/Note');
    const notes = await Note.find({
      eleve: enfantId,
      periode,
      competence
    })
      .populate('eleve', 'nom prenom')
      .populate('sousCompetence', 'nom');
    res.json({ notes });
  } catch (error) {
    console.error('Erreur récupération notes parent:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Route enseignant : voir les notes d'un de ses élèves
router.get('/enseignant/notes', verifyEnseignant, async (req, res) => {
  try {
    const { eleveId, periode, competence, sousCompetence } = req.query;
    if (!eleveId || !competence) {
      return res.status(400).json({ message: "eleveId et competence requis" });
    }
    // Vérifier que l'élève appartient bien à la classe de l'enseignant
    const Classe = require('../models/Classe');
    const Eleve = require('../models/Eleve');
    const classe = await Classe.findOne({ enseignant: req.authUser.mongoId });
    if (!classe) return res.status(403).json({ message: "Aucune classe assignée à cet enseignant" });
    const eleve = await Eleve.findById(eleveId);
    if (!eleve || eleve.classe.toString() !== classe._id.toString()) {
      return res.status(403).json({ message: "Accès interdit à cet élève" });
    }
    const Note = require('../models/Note');
    const filter = {
      eleve: eleveId,
      competence
    };
    if (periode) filter.periode = periode;
    if (sousCompetence) filter.sousCompetence = sousCompetence;
    const notes = await Note.find(filter)
      .populate('eleve', 'nom prenom')
      .populate('sousCompetence', 'nom');
    res.json({ notes });
  } catch (error) {
    console.error('Erreur récupération notes enseignant:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Supprimer la route inutile /parent/notes/stats

// Exporter le bulletin PDF d'un élève
router.get('/bulletin-pdf/:eleveId', verifyEnseignant, async (req, res) => {
  try {
    // 1. Récupération des données principales
    const { eleveId } = req.params;
    const eleve = await Eleve.findById(eleveId).populate('classe');
    if (!eleve) return res.status(404).json({ message: "Élève non trouvé" });
    const classe = eleve.classe;
    const enseignant = await Teacher.findById(classe.enseignant);
    // 2. Compétences et sous-compétences
    const competences = await Competence.find();
    const sousCompetences = await SousCompetence.find();
    // 3. Notes de l'élève
    const notes = await Note.find({ eleve: eleve._id })
      .populate('competence')
      .populate('sousCompetence');

    // 4. Préparation du PDF
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const filename = `bulletin-${eleve.nom}-${eleve.prenom}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    doc.pipe(res);

    // 5. Bandeau titre
    doc.rect(0, 0, 595, 50).fill('#2563eb');
    doc.fillColor('white').fontSize(22).font('Helvetica-Bold').text('Bulletin Scolaire', 40, 15, { align: 'left' });
    doc.moveDown(2);
    doc.fillColor('black').fontSize(12).font('Helvetica');
    doc.text(`Nom & prénom : ${eleve.nom} ${eleve.prenom}`);
    doc.text(`Matricule/ID : ${eleve._id}`);
    doc.text(`Classe : ${classe?.nomclass || '-'}`);
    doc.text(`Année scolaire : 2024 – 2025`);
    doc.text(`Trimestre/période : -`);
    doc.text(`Établissement : École Primaire Excellence`);
    doc.text(`Enseignant(e) : ${enseignant ? enseignant.prenom + ' ' + enseignant.nom : '-'}`);
    doc.text(`Date d’édition : ${new Date().toLocaleDateString('fr-FR')}`);
    doc.moveDown();

    // 6. Tableau des compétences/sous-compétences
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#2563eb').text('Résultats académiques', { underline: true });
    doc.moveDown(0.5);
    const colWidth = 60;
    const startX = 40;
    let y = doc.y;
    let x = startX;

    // 7. En-tête compétences
    doc.fontSize(11).font('Helvetica-Bold').fillColor('black');
    for (const comp of competences) {
      const sousComps = sousCompetences.filter(sc => sc.competence.toString() === comp._id.toString());
      if (sousComps.length === 0) continue;
      let width = sousComps.length * colWidth;
      checkAndBlockNaNPDF(doc, { x, y, width }, 'En-tête compétences');
      doc.rect(x, y, width, 22).fill('#e5e7eb');
      doc.fillColor('#222').text(comp.nom, x, y + 6, { width, align: 'center' });
      x += width;
    }
    checkAndBlockNaNPDF(doc, { x, y }, 'Colonne appréciation');
    doc.rect(x, y, 100, 44).fill('#f3f4f6');
    doc.fillColor('#222').text('Appréciation', x, y + 13, { width: 100, align: 'center' });
    doc.moveDown();

    // 8. Sous-compétences
    x = startX;
    y = doc.y;
    doc.font('Helvetica').fontSize(10);
    for (const comp of competences) {
      const sousComps = sousCompetences.filter(sc => sc.competence.toString() === comp._id.toString());
      if (sousComps.length === 0) continue;
      for (const sc of sousComps) {
        checkAndBlockNaNPDF(doc, { x, y }, 'Sous-compétence');
        doc.rect(x, y, colWidth, 22).fill('#f9fafb');
        doc.fillColor('#222').text(sc.nom, x, y + 6, { width: colWidth, align: 'center' });
        x += colWidth;
      }
    }
    doc.moveDown();

    // 9. Notes par sous-compétence
    x = startX;
    y = doc.y;
    for (const comp of competences) {
      const sousComps = sousCompetences.filter(sc => sc.competence.toString() === comp._id.toString());
      if (sousComps.length === 0) continue;
      for (const sc of sousComps) {
        const noteObj = notes.find(n => n.competence._id.toString() === comp._id.toString() && n.sousCompetence._id.toString() === sc._id.toString());
        let note = noteObj ? noteObj.note : '-';
        if (note === null || note === undefined || isNaN(note)) note = '-';
        checkAndBlockNaNPDF(doc, { x, y }, 'Note sous-compétence');
        doc.rect(x, y, colWidth, 22).fill('#fff');
        doc.fillColor('#222').text(note.toString(), x, y + 6, { width: colWidth, align: 'center' });
        x += colWidth;
      }
    }
    doc.moveDown();

    // 10. Bilan global
    doc.font('Helvetica-Bold').fontSize(12).fillColor('#2563eb');
    doc.text('Bilan global', { underline: true });
    // Calcul total et moyenne
    let totalNote = 0;
    let totalBareme = 0;
    for (const comp of competences) {
      const sousComps = sousCompetences.filter(sc => sc.competence.toString() === comp._id.toString());
      for (const sc of sousComps) {
        const noteObj = notes.find(n => n.competence._id.toString() === comp._id.toString() && n.sousCompetence._id.toString() === sc._id.toString());
        const note = noteObj ? noteObj.note : null;
        const bareme = (typeof sc.bareme === 'number' && !isNaN(sc.bareme)) ? sc.bareme : 20;
        if (note !== null && note !== undefined && !isNaN(note)) {
          totalNote += Number(note);
          totalBareme += bareme;
        }
      }
    }
    let moyenne = (totalBareme > 0) ? (totalNote / totalBareme * 20).toFixed(2) : '-';
    doc.font('Helvetica').fillColor('black');
    doc.text(`Total des points : ${totalNote} / ${totalBareme}`);
    doc.text(`Moyenne générale : ${moyenne}/20`);
    doc.text(`Mention : -`);
    doc.end();
  } catch (error) {
    console.error('Erreur export bulletin PDF:', error);
    res.status(500).json({ message: "Erreur lors de la génération du bulletin PDF" });
  }
});

// Route pour récupérer toutes les notes de la classe de l'enseignant
router.get('/all-eleves', verifyEnseignant, async (req, res) => {
  try {
    const Classe = require('../models/Classe');
    const Eleve = require('../models/Eleve');
    const Note = require('../models/Note');
    const classe = await Classe.findOne({ enseignant: req.authUser.mongoId });
    if (!classe) return res.status(403).json({ message: "Aucune classe assignée à cet enseignant" });
    const eleves = await Eleve.find({ classe: classe._id });
    const eleveIds = eleves.map(e => e._id);
    const notes = await Note.find({ eleve: { $in: eleveIds } })
      .populate('eleve', 'nom prenom')
      .populate('competence', 'nom')
      .populate('sousCompetence', 'nom bareme competence');
    res.json({ notes });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du chargement des notes", error: error.message });
  }
});

// Route parent : voir la moyenne et le rang de son enfant
router.get('/parent/notes/rang-moyenne', verifyParent, async (req, res) => {
  try {
    const { enfantId } = req.query;
    if (!enfantId) return res.status(400).json({ message: 'enfantId requis' });
    // Vérifier que l'enfant appartient bien au parent connecté
    const parent = await require('../models/Parents').findById(req.parentId);
    if (!parent || !parent.enfants.map(e => e.toString()).includes(enfantId)) {
      return res.status(403).json({ message: "Accès interdit à cet enfant" });
    }
    // Récupérer l'élève, la classe
    const eleve = await Eleve.findById(enfantId).populate('classe');
    if (!eleve) return res.status(404).json({ message: "Élève non trouvé" });
    const classe = eleve.classe;
    // Récupérer tous les élèves de la classe
    const allEleves = await Eleve.find({ classe: classe._id });
    // Récupérer toutes les compétences et sous-compétences
    const competences = await Competence.find();
    const sousCompetences = await SousCompetence.find();
    // Récupérer toutes les notes de la classe
    const allNotes = await Note.find({ eleve: { $in: allEleves.map(e => e._id) } })
      .populate('competence')
      .populate('sousCompetence');
    // Calcul des moyennes pour chaque élève
    const moyennes = [];
    for (const el of allEleves) {
      let totalNote = 0;
      let totalBareme = 0;
      for (const comp of competences) {
        const sousComps = sousCompetences.filter(sc => sc.competence.toString() === comp._id.toString());
        for (const sc of sousComps) {
          const noteObj = allNotes.find(n => n.eleve.toString() === el._id.toString() && n.competence._id.toString() === comp._id.toString() && n.sousCompetence._id.toString() === sc._id.toString());
          const note = noteObj ? noteObj.note : null;
          let bareme = (typeof sc.bareme === 'number' && !isNaN(sc.bareme)) ? sc.bareme : 20;
          if (note !== null && note !== undefined && !isNaN(note)) {
            totalNote += Number(note);
            totalBareme += bareme;
          }
        }
      }
      let moyenne = (totalBareme > 0 && isFinite(totalBareme) && isFinite(totalNote)) ? (totalNote / totalBareme * 20) : null;
      if (moyenne !== null && isNaN(moyenne)) moyenne = null;
      moyennes.push({ eleve: el, moyenne });
    }
    // Calcul du rang de l'élève
    const sorted = [...moyennes].filter(m => m.moyenne !== null).sort((a, b) => b.moyenne - a.moyenne);
    const rang = sorted.findIndex(m => m.eleve._id.toString() === eleve._id.toString()) + 1;
    const moyenneEleve = sorted.find(m => m.eleve._id.toString() === eleve._id.toString())?.moyenne;
    res.json({ moyenne: moyenneEleve, rang, effectif: sorted.length });
  } catch (error) {
    console.error('Erreur calcul rang/moyenne parent:', error);
    res.status(500).json({ message: "Erreur lors du calcul du rang et de la moyenne" });
  }
});

// Helpers robustes pour PDFKit
function safeNumber(val, fallback = 0) {
  return (typeof val === 'number' && isFinite(val) && !isNaN(val)) ? val : fallback;
}
function safeText(val) {
  return (val !== null && val !== undefined && !isNaN(val)) ? val.toString() : '-';
}

// Helper pour log et blocage NaN
function checkAndBlockNaNPDF(doc, vars, context) {
  const keys = Object.keys(vars);
  const hasNaN = keys.some(k => typeof vars[k] === 'number' && !Number.isFinite(vars[k]));
  if (hasNaN) {
    console.error('PDF DEBUG AVANT CRASH', { context, ...vars });
    doc.fontSize(14).fillColor('red').text('Erreur de données (NaN) dans le bulletin. Corrigez les notes ou barèmes.', 60, doc.y + 40);
    doc.end();
    throw new Error('NaN détecté dans PDFKit: ' + context);
  }
}

function checkAndBlockNaNPDFState(doc, vars, context) {
  const allVars = { ...vars, docX: doc.x, docY: doc.y };
  const hasNaN = Object.values(allVars).some(v => typeof v === 'number' && !Number.isFinite(v));
  if (hasNaN) {
    console.error('[PDF DEBUG ETAT CRASH]', { context, ...allVars });
    doc.fontSize(14).fillColor('red').text('Erreur de coordonnées (NaN) dans le PDF.', 60, doc.y + 40);
    doc.end();
    throw new Error('NaN détecté dans PDFKit: ' + context);
  }
}

module.exports = router;
