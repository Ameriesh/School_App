const Eleve = require("../models/Eleve");
const path = require("path");
const fs = require("fs");

// Créer un élève
exports.createEleve = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.photo = req.file.filename;
    }

    const eleve = new Eleve(data);
    await eleve.save();
    res.status(201).json({ message: "Élève ajouté avec succès", eleve });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création de l’élève" });
  }
};

// Obtenir tous les élèves
exports.getEleves = async (req, res) => {
  try {
    const eleves = await Eleve.find()
      .populate("parentId", "nom1 prenom1 email1")
      .populate("classe", "nomclass niveau");
    res.status(200).json({ eleves });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des élèves" });
  }
};

// Obtenir un élève par ID
exports.getEleveById = async (req, res) => {
  try {
    const eleve = await Eleve.findById(req.params.id)
      .populate("parentId", "nom1 prenom1")
      .populate("classe", "nomclass niveau");
    if (!eleve) return res.status(404).json({ message: "Élève non trouvé" });
    res.status(200).json({ eleve });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Supprimer un élève
exports.deleteEleve = async (req, res) => {
  try {
    const eleve = await Eleve.findByIdAndDelete(req.params.id);
    if (!eleve) return res.status(404).json({ message: "Élève non trouvé" });

    // Supprimer la photo si elle existe
    if (eleve.photo) {
      const filePath = path.join(__dirname, "..", "uploads", eleve.photo);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    res.status(200).json({ message: "Élève supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
