const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");
const { verifyEnseignant } = require("../middlewares/authMiddleware");

// ✅ Bien vérifier que les fonctions appelées existent dans le contrôleur
router.post("/multiple", verifyEnseignant, noteController.addOrUpdateMultipleNotes);
router.get("/by-periode/:periodeId/competence/:competenceId", verifyEnseignant, noteController.getNotesByPeriodeAndCompetence);
// GET /api/notes/existantes
// routes/notes.js
router.get('/existantes', verifyEnseignant, noteController.checkExistingNotes);
router.put("/:id", verifyEnseignant, noteController.updateNote);
router.delete("/:id", verifyEnseignant, noteController.deleteNote);
router.get('/grouped', verifyEnseignant, async (req, res) => {
    try {
        const { periodeId } = req.query;

        if (!periodeId) {
            return res.status(400).json({ message: "L'ID de période est requis" });
        }

        const notes = await Note.aggregate([
            {
                $match: { 
                    periode: new mongoose.Types.ObjectId(periodeId),
                    enseignant: new mongoose.Types.ObjectId(req.user.id)
                }
            },
            {
                $lookup: {
                    from: 'eleves',
                    localField: 'eleve',
                    foreignField: '_id',
                    as: 'eleve'
                }
            },
            {
                $unwind: '$eleve'
            },
            {
                $lookup: {
                    from: 'competences',
                    localField: 'competence',
                    foreignField: '_id',
                    as: 'competence'
                }
            },
            {
                $unwind: '$competence'
            },
            {
                $lookup: {
                    from: 'souscompetences',
                    localField: 'sousCompetence',
                    foreignField: '_id',
                    as: 'sousCompetence'
                }
            },
            {
                $unwind: '$sousCompetence'
            },
            {
                $group: {
                    _id: {
                        eleveId: '$eleve._id',
                        eleveNom: '$eleve.nom',
                        elevePrenom: '$eleve.prenom',
                        competenceId: '$competence._id',
                        competenceNom: '$competence.nom'
                    },
                    notes: {
                        $push: {
                            type: '$sousCompetence.nom',
                            note: '$note',
                            max: '$sousCompetence.noteMax'
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    eleve: {
                        id: '$_id.eleveId',
                        nom: '$_id.eleveNom',
                        prenom: '$_id.elevePrenom'
                    },
                    competence: {
                        id: '$_id.competenceId',
                        nom: '$_id.competenceNom'
                    },
                    notes: 1
                }
            }
        ]);

        res.json({ data: notes });
    } catch (error) {
        console.error("Erreur:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Générer le PDF
router.get('/export-pdf', verifyEnseignant, async (req, res) => {
    try {
        const { periodeId } = req.query;
        
        // Récupérer les données (similaire à la route grouped)
        const notes = await getGroupedNotes(periodeId, req.user.id); 

        // Créer le PDF
        const doc = new PDFDocument();
        const filename = `notes-${Date.now()}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        doc.pipe(res);

        // En-tête
        doc.fontSize(20).text('Bulletin de Notes', { align: 'center' });
        doc.moveDown();

        // Parcourir les élèves
        notes.forEach(eleve => {
            doc.fontSize(16).text(`${eleve.nom} ${eleve.prenom}`);
            doc.moveDown(0.5);

            // Tableau des notes
            const table = {
                headers: ['Compétence', 'Oral (/12)', 'Écrit (/15)', 'Savoir-être (/3)', 'Total (/30)'],
                rows: []
            };

            eleve.competences.forEach(comp => {
                const oral = comp.notes.find(n => n.type.includes('Oral'));
                const ecrit = comp.notes.find(n => n.type.includes('Écrit'));
                const savoirEtre = comp.notes.find(n => n.type.includes('Savoir-être'));

                const total = (oral?.note || 0) + (ecrit?.note || 0) + (savoirEtre?.note || 0);

                table.rows.push([
                    comp.nom,
                    oral ? `${oral.note}/${oral.max}` : '-',
                    ecrit ? `${ecrit.note}/${ecrit.max}` : '-',
                    savoirEtre ? `${savoirEtre.note}/${savoirEtre.max}` : '-',
                    `${total}/30`
                ]);
            });

            // Dessiner le tableau (implémentation simplifiée)
            drawTable(doc, table);
            doc.moveDown();
        });

        doc.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la génération du PDF" });
    }
});

// Helper function
async function getGroupedNotes(periodeId, enseignantId) {
    // Implémentation similaire à la route grouped
    // Retourne les données formatées pour le PDF
}

function drawTable(doc, table) {
    // Implémentation de la génération du tableau PDF
    // (à compléter selon vos besoins)
}

module.exports = router;
module.exports = router;
