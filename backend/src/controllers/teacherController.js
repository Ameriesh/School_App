const Teacher = require("../models/Teacher");
const admin = require("../firebase/firebaseConfig");

exports.addTeacher = async (req, res) => {
  const { nom, prenom, designation, dateNaissance, sexe, email, adresse, telephone, dateEntree, photo, password } = req.body;

  try {
    // Créer l'utilisateur dans Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${prenom} ${nom}`
    });

    // Sauvegarder dans MongoDB
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
      photo,
      role: "enseignant"
    });

    await newTeacher.save();

    res.status(201).json({ message: "Enseignant ajouté avec succès", teacher: newTeacher });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
