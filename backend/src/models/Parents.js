// backend/src/models/Parent.js
const mongoose = require("mongoose");

const parentSchema = new mongoose.Schema({
  nom1: String,
  nom2: String,
  prenom1: String,
  prenom2: String,
  profession1: String,
  profession2: String,
  email1: String,
  email2: String,
  telephone1: String,
  telephone2: String,
  adresse1: String,
  adresse2: String,
  photo1: String,
  photo2: String,
  name_user: String,
  password: String,
  enfants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Eleve" }],
}, { timestamps: true });

module.exports = mongoose.model("Parent", parentSchema);
