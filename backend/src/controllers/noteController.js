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

// 🔎 (Optionnel) Lister toutes les notes pour une UA et une compétence
exports.getNotesByPeriodeAndCompetence = async (req, res) => {
  try {
    const { periodeId, competenceId } = req.params;
    const enseignantId = req.authUser.mongoId;

    const notes = await Note.find({
      periode: periodeId,
      competence: competenceId,
      enseignant: enseignantId,
    })
      .populate("eleve", "nom prenom")
      .populate("sousCompetence", "nom");

    res.status(200).json({ notes });
  } catch (error) {
    console.error("Erreur chargement notes:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
// Dans noteController.js
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
