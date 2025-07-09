const Classe = require("../models/Classe");
const Teacher = require("../models/Teacher");

exports.addClasse = async (req, res) => {
  try {
    const { nomclass, capacite, niveau, enseignant } = req.body;

    // Vérifier si l’enseignant existe
    const teacher = await Teacher.findById(enseignant);
    if (!teacher) {
      return res.status(404).json({ message: "Enseignant introuvable" });
    }

    // Vérifier si la classe existe déjà
    const existing = await Classe.findOne({ nomclass });
    if (existing) {
      return res.status(400).json({ message: "Cette classe existe déjà" });
    }

    const newClasse = new Classe({
      nomclass,
      capacite,
      niveau,
      enseignant,
      effectif: 0, // Initialisation de l'effectif à 0
    });

    await newClasse.save();

    res.status(201).json({ message: "Classe ajoutée avec succès", classe: newClasse });
  } catch (error) {
    console.error("Erreur ajout classe:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getClasses = async (req, res) => {
  try {
    const classes = await Classe.find().populate("enseignant", "nom prenom email");
    res.status(200).json({ classes });
  } catch (error) {
    res.status(500).json({ message: "Erreur récupération classes", error: error.message });
  }
};
