const Competence = require("../models/Competence");

exports.createCompetence = async (req, res) => {
  try {
    const competence = new Competence(req.body);
    await competence.save();
    res.status(201).json({ message: "Compétence créée", competence });
  } catch (error) {
    res.status(500).json({ message: "Erreur", error: error.message });
  }
};

exports.getAllCompetences = async (req, res) => {
  try {
    const competences = await Competence.find();
    res.status(200).json({ competences });
  } catch (error) {
    res.status(500).json({ message: "Erreur", error: error.message });
  }
};
