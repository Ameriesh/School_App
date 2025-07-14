const SousCompetence = require("../models/SousCompetence");

exports.createSousCompetence = async (req, res) => {
  try {
    const sous = new SousCompetence(req.body);
    await sous.save();
    res.status(201).json({ message: "Sous-compétence créée", sous });
  } catch (error) {
    res.status(500).json({ message: "Erreur", error: error.message });
  }
};

exports.getSousCompetences = async (req, res) => {
  try {
    const data = await SousCompetence.find().populate("competence", "nom code");
    res.status(200).json({ sousCompetences: data });
  } catch (error) {
    res.status(500).json({ message: "Erreur", error: error.message });
  }
};

exports.getByCompetence = async (req, res) => {
  try {
    const sousCompetences = await SousCompetence.find({ competence: req.params.id });
    res.json({ sousCompetences });
  } catch (error) {
    console.error("Erreur getByCompetence:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

