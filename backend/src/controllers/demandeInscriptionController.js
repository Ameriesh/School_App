const DemandeInscription = require('../models/DemandeInscription');
const Parent = require('../models/Parents');
const bcrypt = require('bcryptjs');
const { sendParentCredentials } = require('../services/emailService');
const path = require('path');
const fs = require('fs');

// Créer une nouvelle demande d'inscription
exports.createDemande = async (req, res) => {
  try {
    const { parent } = req.body;
    let cniPath = null;

    // Gérer le téléversement du fichier CNI
    if (req.file) {
      cniPath = req.file.path;
      console.log('Fichier CNI téléversé:', cniPath);
    } else {
      return res.status(400).json({
        message: "Le fichier CNI est requis"
      });
    }

    // Vérifier si une demande existe déjà pour cet email
    const existingDemande = await DemandeInscription.findOne({
      'parent.email': parent.email
    });

    if (existingDemande) {
      // Supprimer le fichier téléversé si la demande existe déjà
      if (cniPath && fs.existsSync(cniPath)) {
        fs.unlinkSync(cniPath);
      }
      return res.status(400).json({
        message: "Une demande d'inscription existe déjà pour cet email"
      });
    }

    // Vérifier si un parent existe déjà avec cet email (dans les deux formats)
    const existingParent = await Parent.findOne({
      $or: [
        { email: parent.email },
        { email1: parent.email },
        { email2: parent.email }
      ]
    });
    
    if (existingParent) {
      // Supprimer le fichier téléversé si le parent existe déjà
      if (cniPath && fs.existsSync(cniPath)) {
        fs.unlinkSync(cniPath);
      }
      return res.status(400).json({
        message: "Un parent existe déjà avec cet email"
      });
    }

    // Créer la demande avec le chemin du fichier CNI
    const demandeData = {
      parent: {
        ...parent,
        cni: cniPath
      }
    };

    const demande = new DemandeInscription(demandeData);
    await demande.save();

    res.status(201).json({
      message: "Demande d'inscription envoyée avec succès",
      demande
    });
  } catch (error) {
    console.error('Erreur création demande:', error);
    
    // Supprimer le fichier téléversé en cas d'erreur
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      message: "Erreur lors de la création de la demande d'inscription",
      error: error.message
    });
  }
};

// Récupérer toutes les demandes d'inscription
exports.getAllDemandes = async (req, res) => {
  try {
    const { statut } = req.query;
    let filter = {};
    
    if (statut) {
      filter.statut = statut;
    }

    const demandes = await DemandeInscription.find(filter)
      .sort({ dateDemande: -1 });

    res.json({
      demandes,
      total: demandes.length
    });
  } catch (error) {
    console.error('Erreur récupération demandes:', error);
    res.status(500).json({
      message: "Erreur lors de la récupération des demandes",
      error: error.message
    });
  }
};

// Récupérer une demande spécifique
exports.getDemandeById = async (req, res) => {
  try {
    const demande = await DemandeInscription.findById(req.params.id);

    if (!demande) {
      return res.status(404).json({
        message: "Demande d'inscription non trouvée"
      });
    }

    res.json({ demande });
  } catch (error) {
    console.error('Erreur récupération demande:', error);
    res.status(500).json({
      message: "Erreur lors de la récupération de la demande",
      error: error.message
    });
  }
};

// Récupérer le fichier CNI d'une demande
exports.getCniFile = async (req, res) => {
  try {
    const demande = await DemandeInscription.findById(req.params.id);

    if (!demande) {
      return res.status(404).json({
        message: "Demande d'inscription non trouvée"
      });
    }

    if (!demande.parent.cni) {
      return res.status(404).json({
        message: "Fichier CNI non trouvé"
      });
    }

    const filePath = demande.parent.cni;
    
    // Vérifier si le fichier existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "Fichier CNI introuvable sur le serveur"
      });
    }

    // Déterminer le type MIME basé sur l'extension
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    } else if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.pdf') {
      contentType = 'application/pdf';
    }

    // Envoyer le fichier
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="cni-${demande.parent.nom}-${demande.parent.prenom}${ext}"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Erreur récupération fichier CNI:', error);
    res.status(500).json({
      message: "Erreur lors de la récupération du fichier CNI",
      error: error.message
    });
  }
};

// Traiter une demande (approuver ou rejeter) - Version alternative
exports.traiterDemande = async (req, res) => {
  try {
    console.log('=== DÉBUT traiterDemande ===');
    const { action, commentaire } = req.body;
    const { id } = req.params;
    
    console.log('Action:', action, 'ID:', id);

    const demande = await DemandeInscription.findById(id);
    if (!demande) {
      return res.status(404).json({
        message: "Demande d'inscription non trouvée"
      });
    }

    if (demande.statut !== 'en_attente') {
      return res.status(400).json({
        message: "Cette demande a déjà été traitée"
      });
    }

    // Traitement selon l'action
    if (action === 'approuver') {
      console.log('=== TRAITEMENT APPROBATION ===');
      
      // Vérifier à nouveau si un parent existe déjà avec cet email
      const existingParent = await Parent.findOne({
        $or: [
          { email: demande.parent.email },
          { email1: demande.parent.email },
          { email2: demande.parent.email }
        ]
      });
      
      if (existingParent) {
        return res.status(400).json({
          message: "Un parent existe déjà avec cet email"
        });
      }

      // Générer un mot de passe aléatoire
      const motDePasse = generatePassword();
      
      // Créer le compte parent (sans enfants pour l'instant)
      const parent = new Parent({
        nom: demande.parent.nom,
        prenom: demande.parent.prenom,
        email: demande.parent.email,
        telephone: demande.parent.telephone,
        adresse: demande.parent.adresse,
        motDePasse: await bcrypt.hash(motDePasse, 10),
        compteActif: true,
        dateActivation: new Date(),
        demandeInscription: demande._id,
        enfants: [] // Les enfants seront ajoutés plus tard via le dashboard
      });

      await parent.save();

      // Envoyer email avec identifiants
      let emailSent = false;
      try {
        await sendParentCredentials(
          demande.parent.email,
          demande.parent.nom,
          demande.parent.prenom,
          motDePasse
        );
        console.log('Email envoyé avec succès à:', demande.parent.email);
        emailSent = true;
      } catch (emailError) {
        console.error('Erreur envoi email:', emailError);
        // Continuer même si l'email échoue
      }

      demande.statut = 'approuvee';
      
      // Mettre à jour la demande
      demande.dateTraitement = new Date();
      demande.traitePar = req.authUser.uid;
      demande.commentaire = commentaire || '';
      await demande.save();

      // Préparer la réponse
      const responseData = {
        message: `Demande approuvée avec succès${emailSent ? '' : ' (email non envoyé)'}`,
        demande,
        parentCreated: true
      };
      
      // Si l'email n'a pas été envoyé, inclure le mot de passe pour envoi manuel
      if (!emailSent) {
        responseData.motDePasse = motDePasse;
        responseData.emailNonEnvoye = true;
        responseData.message += ' - Mot de passe à envoyer manuellement au parent';
      }

      console.log('=== FIN APPROBATION ===');
      return res.json(responseData);

    } else if (action === 'rejeter') {
      console.log('=== TRAITEMENT REJET ===');
      
      demande.statut = 'rejetee';
      demande.dateTraitement = new Date();
      demande.traitePar = req.authUser.uid;
      demande.commentaire = commentaire || '';
      await demande.save();

      console.log('=== FIN REJET ===');
      return res.json({
        message: `Demande rejetée avec succès`,
        demande
      });

    } else {
      return res.status(400).json({
        message: "Action invalide. Utilisez 'approuver' ou 'rejeter'"
      });
    }

  } catch (error) {
    console.error('Erreur traitement demande:', error);
    console.error('Stack trace:', error.stack);
    
    // Gérer spécifiquement l'erreur de doublon
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Un parent existe déjà avec cet email"
      });
    }
    
    res.status(500).json({
      message: "Erreur lors du traitement de la demande",
      error: error.message
    });
  }
};

// Supprimer une demande
exports.deleteDemande = async (req, res) => {
  try {
    const demande = await DemandeInscription.findById(req.params.id);
    
    if (!demande) {
      return res.status(404).json({
        message: "Demande d'inscription non trouvée"
      });
    }

    if (demande.statut === 'approuvee') {
      return res.status(400).json({
        message: "Impossible de supprimer une demande approuvée"
      });
    }

    await DemandeInscription.findByIdAndDelete(req.params.id);

    res.json({
      message: "Demande d'inscription supprimée avec succès"
    });
  } catch (error) {
    console.error('Erreur suppression demande:', error);
    res.status(500).json({
      message: "Erreur lors de la suppression de la demande",
      error: error.message
    });
  }
};

// Statistiques des demandes
exports.getStatistiques = async (req, res) => {
  try {
    const stats = await DemandeInscription.aggregate([
      {
        $group: {
          _id: '$statut',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalDemandes = await DemandeInscription.countDocuments();
    const demandesEnAttente = await DemandeInscription.countDocuments({ statut: 'en_attente' });
    const demandesApprouvees = await DemandeInscription.countDocuments({ statut: 'approuvee' });
    const demandesRejetees = await DemandeInscription.countDocuments({ statut: 'rejetee' });

    res.json({
      total: totalDemandes,
      enAttente: demandesEnAttente,
      approuvees: demandesApprouvees,
      rejetees: demandesRejetees,
      repartition: stats
    });
  } catch (error) {
    console.error('Erreur statistiques:', error);
    res.status(500).json({
      message: "Erreur lors de la récupération des statistiques",
      error: error.message
    });
  }
};

// Fonction utilitaire pour générer un mot de passe aléatoire
function generatePassword(length = 8) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
} 