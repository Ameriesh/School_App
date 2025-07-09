const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  designation: String,
  dateNaissance: Date,
  sexe: String,
  email: { type: String, unique: true },
  adresse: String,
  telephone: String,
  dateEntree: Date,
  photo: String,
  firebaseUid: { type: String, unique: true }, // Ajout pour lier à Firebase
  role: { type: String, default: "enseignant" }
}, { timestamps: true });

module.exports = mongoose.model("Teacher", teacherSchema);