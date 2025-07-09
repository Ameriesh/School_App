const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  eleve: { type: mongoose.Schema.Types.ObjectId, ref: "Eleve", required: true },
  enseignant: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  periode: { type: mongoose.Schema.Types.ObjectId, ref: "Periode", required: true },
  competence: { type: mongoose.Schema.Types.ObjectId, ref: "Competence", required: true },
  sousCompetence: { type: mongoose.Schema.Types.ObjectId, ref: "SousCompetence", required: true },
  note: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Note", noteSchema);
