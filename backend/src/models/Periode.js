const mongoose = require("mongoose");

const periodeSchema = new mongoose.Schema({
  mois: { type: String, required: true },            // ex: "Septembre"
  ua: { type: String, required: true },              // ex: "UA1"
  trimestre: { type: String, required: true },       // "1er Trimestre"
  annee: { type: String, required: true },           // ex: "2024-2025"
});

module.exports = mongoose.model("Periode", periodeSchema);
