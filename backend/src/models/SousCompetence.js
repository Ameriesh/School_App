const mongoose = require("mongoose");

const sousCompetenceSchema = new mongoose.Schema({
  nom: { type: String, required: true },               // ex: "Orale"
  bareme: { type: Number, required: true },            // ex: 12
  competence: { type: mongoose.Schema.Types.ObjectId, ref: "Competence", required: true }
});

module.exports = mongoose.model("SousCompetence", sousCompetenceSchema);
