const Eleve = require("../models/Eleve");
const Classe = require("../models/Classe");
const Parent = require("../models/Parents");
const path = require("path");
const fs = require("fs");

// ✅ Créer un élève
exports.createEleve = async (req, res) => {
  try {
    console.log("=== DÉBUT CRÉATION ÉLÈVE ===");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    console.log("File:", req.file);
    
    const data = { ...req.body };
    console.log("Data après copie:", data);

    // Gestion de la photo
    if (req.file) {
      data.photo = req.file.filename;
      console.log("Photo ajoutée:", data.photo);
    }

    // Validation des champs requis
    console.log("Validation des champs:");
    console.log("- nom:", data.nom);
    console.log("- prenom:", data.prenom);
    console.log("- parentId:", data.parentId);
    console.log("- classe:", data.classe);
    
    if (!data.nom || !data.prenom || !data.parentId || !data.classe) {
      console.log("❌ Champs manquants détectés");
      return res.status(400).json({ 
        message: "Les champs nom, prénom, parent et classe sont requis" 
      });
    }

    console.log("✅ Validation OK, création de l'élève...");
    const eleve = new Eleve(data);
    console.log("Élève créé:", eleve);
    
    await eleve.save();
    console.log("✅ Élève sauvegardé en base");

    // 🔁 Incrémenter l'effectif de la classe
    if (eleve.classe) {
      console.log("Mise à jour effectif classe:", eleve.classe);
      await Classe.findByIdAndUpdate(eleve.classe, {
        $inc: { effectif: 1 },
      });
    }

    // 🔁 Ajouter l'élève dans le tableau enfants du parent
    if (eleve.parentId) {
      console.log("Mise à jour parent:", eleve.parentId);
      await Parent.findByIdAndUpdate(eleve.parentId, {
        $push: { enfants: eleve._id },
      });
    }

    console.log("✅ Élève ajouté avec succès");
    res.status(201).json({ message: "Élève ajouté avec succès", eleve });
  } catch (error) {
    console.error("❌ ERREUR CRÉATION ÉLÈVE:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ message: "Erreur lors de la création de l'élève", error: error.message });
  }
};

// ✅ Obtenir tous les élèves
exports.getEleves = async (req, res) => {
  try {
    const eleves = await Eleve.find()
      .populate("parentId", "nom prenom email")
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
      .populate("parentId", "nom prenom")
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
    console.log('getElevesForEnseignant - authUser:', req.authUser);
    const classe = await Classe.findOne({ enseignant: req.authUser.mongoId });
    if (!classe) {
      console.log('Aucune classe trouvée pour enseignant:', req.authUser.mongoId);
      return res.status(404).json({ message: "Aucune classe assignée à cet enseignant." });
    }
    const eleves = await Eleve.find({ classe: classe._id })
      .populate("parentId", "nom prenom")
      .populate("classe", "nomclass niveau");
    console.log('Élèves trouvés:', eleves.length);
    res.status(200).json({ eleves });
  } catch (err) {
    console.error("Erreur dans getElevesForEnseignant:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
