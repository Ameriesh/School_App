const Eleve = require("../models/Eleve");
const Classe = require("../models/Classe");
const Parent = require("../models/Parents");
const path = require("path");
const fs = require("fs");

// ✅ Créer un élève
exports.createEleve = async (req, res) => {
  try {
    const data = req.body;

    if (req.file) {
      data.photo = req.file.filename;
    }

    const eleve = new Eleve(data);
    await eleve.save();

    // 🔁 Incrémenter l'effectif de la classe
    if (eleve.classe) {
      await Classe.findByIdAndUpdate(eleve.classe, {
        $inc: { effectif: 1 },
      });
    }

    // 🔁 Ajouter l'élève dans le tableau enfants du parent
    if (eleve.parentId) {
      await Parent.findByIdAndUpdate(eleve.parentId, {
        $push: { enfants: eleve._id },
      });
    }

    res.status(201).json({ message: "Élève ajouté avec succès", eleve });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création de l’élève", error: error.message });
  }
};

// ✅ Obtenir tous les élèves
exports.getEleves = async (req, res) => {
  try {
    const eleves = await Eleve.find()
      .populate("parentId", "nom1 prenom1 email1")
      .populate("classe", "nomclass niveau");
    res.status(200).json({ eleves });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des élèves", error: error.message });
  }
};

// ✅ Obtenir un élève par ID
exports.getEleveById = async (req, res) => {
  try {
    const eleve = await Eleve.findById(req.params.id)
      .populate("parentId", "nom1 prenom1")
      .populate("classe", "nomclass niveau");
    if (!eleve) return res.status(404).json({ message: "Élève non trouvé" });
    res.status(200).json({ eleve });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// ✅ Supprimer un élève
exports.deleteEleve = async (req, res) => {
  try {
    const eleve = await Eleve.findByIdAndDelete(req.params.id);
    if (!eleve) return res.status(404).json({ message: "Élève non trouvé" });

    // 🔁 Décrémenter l’effectif de la classe
    if (eleve.classe) {
      await Classe.findByIdAndUpdate(eleve.classe, {
        $inc: { effectif: -1 },
      });
    }

    // 🔁 Supprimer l'élève du tableau enfants du parent
    if (eleve.parentId) {
      await Parent.findByIdAndUpdate(eleve.parentId, {
        $pull: { enfants: eleve._id },
      });
    }

    // 🔁 Supprimer la photo
    if (eleve.photo) {
      const filePath = path.join(__dirname, "..", "uploads", eleve.photo);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(200).json({ message: "Élève supprimé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getElevesForEnseignant = async (req, res) => {
  try {
    const classe = await Classe.findOne({ enseignant: req.authUser.mongoId });
    if (!classe) {
      return res.status(404).json({ message: "Aucune classe assignée à cet enseignant." });
    }

    const eleves = await Eleve.find({ classe: classe._id })
      .populate("parentId", "nom1 prenom1")
      .populate("classe", "nomclass niveau");

    res.status(200).json({ eleves });
  } catch (err) {
    console.error("Erreur:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
