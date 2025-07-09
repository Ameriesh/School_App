// backend/src/models/Classe.js
const mongoose = require("mongoose");

const classeSchema = new mongoose.Schema({
  nomclass: String,
  capacite: Number,
  niveau: String,
  enseignant: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  effectif: { type: Number, default: 0 } // Ce champ est incrémenté
});

module.exports = mongoose.model("Classe", classeSchema);
