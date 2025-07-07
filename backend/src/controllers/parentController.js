// backend/src/controllers/parentController.js
const Parent = require("../models/Parents");

exports.addParent = async (req, res) => {
  try {
    const {
      nom1, nom2, prenom1, prenom2,
      profession1, profession2,
      email1, email2,
      telephone1, telephone2,
      adresse1, adresse2,
      name_user, password
    } = req.body;

    const photo1 = req.files?.photo1?.[0]?.filename || null;
    const photo2 = req.files?.photo2?.[0]?.filename || null;

    const newParent = new Parent({
      nom1, nom2, prenom1, prenom2,
      profession1, profession2,
      email1, email2,
      telephone1, telephone2,
      adresse1, adresse2,
      name_user, password,
      photo1,
      photo2,
    });

    await newParent.save();
    res.status(201).json({ message: "Parent ajouté avec succès", parent: newParent });
  } catch (error) {
    console.error("Erreur ajout parent:", error);
    res.status(500).json({ message: "Erreur lors de l’ajout du parent", error: error.message });
  }
};
