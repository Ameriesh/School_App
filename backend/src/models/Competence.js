const mongoose = require("mongoose");

const competenceSchema = new mongoose.Schema({
  code: { type: String, required: true },        // ex: "1A"
  nom: { type: String, required: true },         // ex: "Français"
  groupe: { type: String },                      // ex: "Compétence 1"
});

module.exports = mongoose.model("Competence", competenceSchema);
