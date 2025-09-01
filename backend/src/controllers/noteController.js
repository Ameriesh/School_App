// ✅ controllers/noteController.js
const Note = require("../models/Note");

// ➕ Ajouter ou modifier plusieurs notes
exports.addOrUpdateMultipleNotes = async (req, res) => {
  try {
    const { periode, competence, notes } = req.body;
    const enseignantId = req.authUser.mongoId; // depuis middleware verifyEnseignant

    if (!periode || !competence || !Array.isArray(notes)) {
      return res.status(400).json({ message: "Données incomplètes." });
    }

    const operations = notes.map((note) => {
      // Ne pas insérer les notes supprimées ou vides
      if (note.note === null || note.note === "") return null;

      return {
        updateOne: {
          filter: {
            eleve: note.eleve,
            sousCompetence: note.sousCompetence,
            periode,
            competence,
            enseignant: enseignantId,
          },
          update: {
            $set: {
              note: note.note,
            },
          },
          upsert: true,
        },
      };
    }).filter(Boolean);

    if (operations.length === 0) {
      return res.status(400).json({ message: "Aucune note valide à enregistrer." });
    }

    await Note.bulkWrite(operations);

    res.status(200).json({ message: "Notes enregistrées ou mises à jour avec succès." });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement des notes:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Mettre à jour une note spécifique
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const enseignantId = req.authUser.mongoId;

    // Valider la note selon les règles métier
    const sousCompetence = await SousCompetence.findById(req.body.sousCompetence);
    let maxNote = 20;
    if (sousCompetence.nom.includes("Oral")) maxNote = 12;
    else if (sousCompetence.nom.includes("Écrit")) maxNote = 15;
    else if (sousCompetence.nom.includes("Savoir-être")) maxNote = 3;

    if (note < 0 || note > maxNote) {
      return res.status(400).json({ 
        message: `La note doit être entre 0 et ${maxNote} pour cette sous-compétence`
      });
    }

    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, enseignant: enseignantId },
      { note },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note non trouvée" });
    }

    res.json({ 
      success: true,
      note: updatedNote 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Erreur serveur",
      error: error.message 
    });
  }
};

// Supprimer une note spécifique
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const enseignantId = req.authUser.mongoId;

    const deletedNote = await Note.findOneAndDelete({ 
      _id: id, 
      enseignant: enseignantId 
    });

    if (!deletedNote) {
      return res.status(404).json({ message: "Note non trouvée" });
    }

    res.json({ 
      success: true,
      message: "Note supprimée avec succès" 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Erreur serveur",
      error: error.message 
    });
  }
};

// Vérifier les notes existantes pour une période et une compétence
exports.checkExistingNotes = async (req, res) => {
  try {
    const { periode, competence } = req.query;
    const enseignantId = req.authUser.mongoId;
    
    if (!periode || !competence) {
      return res.status(400).json({ message: "Période et compétence requises" });
    }

    const notesExistantes = await Note.find({
      periode,
      competence,
      enseignant: enseignantId
    }).populate('eleve', 'nom prenom');

    res.json({ notesExistantes });
  } catch (error) {
    console.error("Erreur vérification notes existantes:", error);
    res.status(500).json({ 
      message: "Erreur serveur",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Récupérer toutes les notes pour une période et une compétence
exports.getNotesByPeriodeAndCompetence = async (req, res) => {
  try {
    const { periode, competence } = req.query;
    const enseignantId = req.authUser.mongoId;
    if (!periode || !competence) {
      return res.status(400).json({ message: "Période et compétence requises" });
    }
    const notes = await Note.find({
      periode,
      competence,
      enseignant: enseignantId
    })
      .populate('eleve', 'nom prenom')
      .populate('sousCompetence', 'nom');
    res.json({ notes });
  } catch (error) {
    console.error("Erreur récupération notes:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getNotesForEnseignant = async (req, res) => {
  try {
    const enseignantId = req.authUser.mongoId;
    console.log('getNotesForEnseignant - enseignantId:', enseignantId);
    const classe = await require('../models/Classe').findOne({ enseignant: enseignantId });
    if (!classe) {
      console.log('Aucune classe trouvée pour enseignant:', enseignantId);
      return res.status(404).json({ message: "Aucune classe assignée à cet enseignant." });
    }
    const eleves = await require('../models/Eleve').find({ classe: classe._id });
    const eleveIds = eleves.map(e => e._id);
    const notes = await require('../models/Note').find({ eleve: { $in: eleveIds } })
      .populate('eleve', 'nom prenom')
      .populate('competence', 'nom')
      .populate('periode', 'nom');
    console.log('Notes trouvées:', notes.length);
    res.status(200).json({ notes });
  } catch (err) {
    console.error('Erreur dans getNotesForEnseignant:', err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
