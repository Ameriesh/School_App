const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const Teacher = require("../models/Teacher");
const { createFirebaseUser } = require("../services/firebaseAuth");

router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const { nom, prenom, designation, dateNaissance, sexe, email, adresse, telephone, dateEntree, password } = req.body;

    const firebaseUser = await createFirebaseUser(email, password)

    const newTeacher = new Teacher({
      nom,
      prenom,
      designation,
      dateNaissance,
      sexe,
      email,
      adresse,
      telephone,
      dateEntree,
      photo: req.file ? req.file.filename : "", // nom du fichier
      role: "enseignant"
    });

    await newTeacher.save();

    res.status(201).json({ message: "Enseignant ajouté avec succès", teacher: newTeacher });
  } catch (error) {
    console.error("Erreur ajout enseignant:", error);
    res.status(500).json({ message: "Erreur lors de l’ajout de l’enseignant", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find(); // récupère tous les enseignants
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des enseignants", error });
  }
});

module.exports = router;