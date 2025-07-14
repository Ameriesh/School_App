const mongoose = require('mongoose');

const DemandeInscriptionSchema = new mongoose.Schema({
  parent: {
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
      lowercase: true
    },
    telephone: {
      type: String,
      required: true,
      trim: true
    },
    adresse: {
      type: String,
      required: true,
      trim: true
    },
    cni: {
      type: String,
      required: true,
      trim: true,
      description: "Chemin du fichier CNI téléversé"
    },
    profession: {
      type: String,
      trim: true
    }
  },
  statut: {
    type: String,
    enum: ['en_attente', 'approuvee', 'rejetee'],
    default: 'en_attente'
  },
  dateDemande: {
    type: Date,
    default: Date.now
  },
  dateTraitement: {
    type: Date
  },
  traitePar: {
    type: String, // UID Firebase au lieu d'ObjectId
    trim: true
  },
  commentaire: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
DemandeInscriptionSchema.index({ statut: 1, dateDemande: -1 });
DemandeInscriptionSchema.index({ 'parent.email': 1 });

module.exports = mongoose.model('DemandeInscription', DemandeInscriptionSchema); 