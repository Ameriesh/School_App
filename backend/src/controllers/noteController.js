const Note = require("../models/Note");

// ➕ Ajouter une note
exports.addNote = async (req, res) => {
  try {
    const { eleve, periode, competence, sousCompetence, note } = req.body;
    const enseignant = req.user.id; // récupéré depuis le token Firebase décodé

    // Vérifie si une note existe déjà pour cette combinaison
    const existingNote = await Note.findOne({
      eleve,
      periode,
      sousCompetence,
    });

    if (existingNote) {
      return res.status(409).json({
        success: false,
        message: "Une note existe déjà pour cet élève, cette sous-compétence et cette période.",
      });
    }

    const newNote = await Note.create({
      eleve,
      enseignant,
      periode,
      competence,
      sousCompetence,
      note,
    });

    return res.status(201).json({
      success: true,
      data: newNote,
    });
  } catch (err) {
    console.error("Erreur lors de l'ajout d'une note :", err);
    return res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};
