const mongoose = require('mongoose');

const DemandeInscriptionEnfantSchema = new mongoose.Schema({
  // Référence au parent connecté
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent',
    required: true
  },
  
  // Informations de l'enfant
  enfant: {
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
    dateNaissance: {
      type: Date,
      required: true
    },
    lieuNaissance: {
      type: String,
      required: true,
      trim: true
    },
    sexe: {
      type: String,
      enum: ['M', 'F'],
      required: true
    },
    photo: {
      type: String,
      required: true,
      description: "Chemin de la photo de l'enfant téléversée"
    },
    acteNaissance: {
      type: String,
      required: true,
      description: "Chemin du fichier acte de naissance téléversé"
    },
    classeDemandee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Classe',
      required: true
    },
    etaitDansAutreEcole: {
      type: Boolean,
      default: false
    },
    etablissementPrecedent: {
      type: String,
      trim: true
    },
    certificatDomicile: {
      type: String,
      required: true,
      description: "Chemin du certificat de domicile téléversé"
    },
    ancienBulletin: {
      type: String,
      description: "Chemin de l'ancien bulletin téléversé (si applicable)"
    }
  },
  
  // Rendez-vous
  rendezVous: {
    date: {
      type: Date,
      required: true
    },
    heure: {
      type: String,
      required: true
    },
    statut: {
      type: String,
      enum: ['programme', 'confirme', 'annule'],
      default: 'programme'
    }
  },
  
  // Statut et traitement
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
    type: String, // UID Firebase de l'admin
    trim: true
  },
  commentaire: {
    type: String,
    trim: true
  },
  
  // Référence créée après traitement
  enfantCree: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Eleve'
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
DemandeInscriptionEnfantSchema.index({ statut: 1, dateDemande: -1 });
DemandeInscriptionEnfantSchema.index({ parentId: 1 });
DemandeInscriptionEnfantSchema.index({ 'enfant.nom': 1, 'enfant.prenom': 1 });

module.exports = mongoose.model('DemandeInscriptionEnfant', DemandeInscriptionEnfantSchema); 