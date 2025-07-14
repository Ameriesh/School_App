// backend/src/models/Parent.js
const mongoose = require("mongoose");

const parentSchema = new mongoose.Schema({
  // Informations principales du parent
  nom: {
    type: String,
    required: true,
    trim: true
  },
  prenom: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true
  },
  telephone: {
    type: String,
    trim: true
  },
  adresse: {
    type: String,
    trim: true
  },
  profession: {
    type: String,
    trim: true
  },
  
  // Authentification
  motDePasse: {
    type: String,
    required: true
  },
  compteActif: {
    type: Boolean,
    default: false
  },
  dateActivation: {
    type: Date
  },
  derniereConnexion: {
    type: Date
  },
  motDePasseChange: {
    type: Boolean,
    default: false
  },
  
  // Relations
  enfants: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Eleve" 
  }],
  demandeInscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DemandeInscription'
  },
  
  // Champs pour compatibilité avec l'ancien système (optionnels)
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
  
  role: {
    type: String,
    default: 'parent'
  }
}, { 
  timestamps: true 
});

// Index pour améliorer les performances
parentSchema.index({ email: 1 });
parentSchema.index({ compteActif: 1 });
parentSchema.index({ role: 1 });

module.exports = mongoose.model("Parent", parentSchema);
