// backend/src/models/Eleve.js
const mongoose = require("mongoose");

const eleveSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Parent" },
  dateNaissance: Date,
  sexe: { type: String, enum: ["M", "F"] },
  groupeSanguin: String,
  email: String,
  telephone: String,
  lieuNaissance: String,
  adresse: String,
  ville: String,
  pays: String,
  classe: { type: mongoose.Schema.Types.ObjectId, ref: "Classe" },
  matricule: String,
  nationalite: String,
  langue: String,
  photo: String,
  acteNaissance: String,
  etablissementPrecedent: String,
}, { timestamps: true });

module.exports = mongoose.model("Eleve", eleveSchema);
