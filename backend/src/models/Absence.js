const mongoose = require("mongoose");

const absenceSchema = new mongoose.Schema({
  eleve: { type: mongoose.Schema.Types.ObjectId, ref: "Eleve", required: true },
  enseignant: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  date: { type: Date, required: true },
  statut: { type: String, enum: ["Justifiée", "Non justifiée"], required: true },
  motif: { type: String, required: true },
  heures: { type: Number, required: true, min: 1 }
}, { timestamps: true });

module.exports = mongoose.model("Absence", absenceSchema); 