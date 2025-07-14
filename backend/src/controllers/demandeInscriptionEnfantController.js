const DemandeInscriptionEnfant = require('../models/DemandeInscriptionEnfant');
const Parent = require('../models/Parents');
const Eleve = require('../models/Eleve');
const Classe = require('../models/Classe');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Créer une nouvelle demande d'inscription d'enfant
exports.createDemandeEnfant = async (req, res) => {
  try {
    const { enfant, rendezVous } = req.body;
    const parentId = req.parentId; // Récupéré du middleware d'authentification
    
    let photoPath = null;
    let acteNaissancePath = null;
    let certificatDomicilePath = null;
    let ancienBulletinPath = null;

    // Gérer le téléversement des fichiers
    if (req.files) {
      if (req.files.photo) {
        photoPath = req.files.photo[0].path;
      }
      if (req.files.acteNaissance) {
        acteNaissancePath = req.files.acteNaissance[0].path;
      }
      if (req.files.certificatDomicile) {
        certificatDomicilePath = req.files.certificatDomicile[0].path;
      }
      if (req.files.ancienBulletin) {
        ancienBulletinPath = req.files.ancienBulletin[0].path;
      }
    }

    // Vérifier que les fichiers requis sont présents
    if (!photoPath) {
      return res.status(400).json({
        message: "La photo de l'enfant est requise"
      });
    }

    if (!acteNaissancePath) {
      return res.status(400).json({
        message: "Le fichier acte de naissance est requis"
      });
    }

    if (!certificatDomicilePath) {
      return res.status(400).json({
        message: "Le certificat de domicile est requis"
      });
    }

    // Vérifier si une demande existe déjà pour cet enfant
    const existingDemande = await DemandeInscriptionEnfant.findOne({
      parentId: parentId,
      'enfant.nom': enfant.nom,
      'enfant.prenom': enfant.prenom,
      'enfant.dateNaissance': enfant.dateNaissance
    });

    if (existingDemande) {
      // Supprimer les fichiers téléversés si la demande existe déjà
      [photoPath, acteNaissancePath, certificatDomicilePath, ancienBulletinPath].forEach(path => {
        if (path && fs.existsSync(path)) {
          fs.unlinkSync(path);
        }
      });
      return res.status(400).json({
        message: "Une demande d'inscription existe déjà pour cet enfant"
      });
    }

    // Créer la demande avec les chemins des fichiers
    const demandeData = {
      parentId: parentId,
      enfant: {
        ...enfant,
        photo: photoPath,
        acteNaissance: acteNaissancePath,
        certificatDomicile: certificatDomicilePath,
        ancienBulletin: ancienBulletinPath
      },
      rendezVous: {
        date: new Date(rendezVous.date),
        heure: rendezVous.heure
      }
    };

    const demande = new DemandeInscriptionEnfant(demandeData);
    await demande.save();

    res.status(201).json({
      message: "Demande d'inscription d'enfant envoyée avec succès. Un rendez-vous a été programmé.",
      demande
    });
  } catch (error) {
    console.error('Erreur création demande enfant:', error);
    
    // Supprimer les fichiers téléversés en cas d'erreur
    if (req.files) {
      Object.values(req.files).forEach(fileArray => {
        if (Array.isArray(fileArray)) {
          fileArray.forEach(file => {
            if (file.path && fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          });
        }
      });
    }
    
    res.status(500).json({
      message: "Erreur lors de la création de la demande d'inscription d'enfant",
      error: error.message
    });
  }
};

// Récupérer toutes les demandes d'inscription d'enfants (admin)
exports.getAllDemandesEnfants = async (req, res) => {
  try {
    const { statut } = req.query;
    let filter = {};
    
    if (statut) {
      filter.statut = statut;
    }

    const demandes = await DemandeInscriptionEnfant.find(filter)
      .populate('parentId', 'nom prenom email telephone')
      .populate('enfant.classeDemandee', 'nomclass niveau')
      .populate('enfantCree', 'nom prenom')
      .sort({ dateDemande: -1 });

    res.json({
      demandes,
      total: demandes.length
    });
  } catch (error) {
    console.error('Erreur récupération demandes enfants:', error);
    res.status(500).json({
      message: "Erreur lors de la récupération des demandes d'enfants",
      error: error.message
    });
  }
};

// Récupérer les demandes d'un parent spécifique
exports.getDemandesEnfantByParent = async (req, res) => {
  try {
    const parentId = req.parentId;

    const demandes = await DemandeInscriptionEnfant.find({ parentId: parentId })
      .populate('enfant.classeDemandee', 'nomclass niveau')
      .populate('enfantCree', 'nom prenom')
      .sort({ dateDemande: -1 });

    res.json({
      demandes,
      total: demandes.length
    });
  } catch (error) {
    console.error('Erreur récupération demandes enfant parent:', error);
    res.status(500).json({
      message: "Erreur lors de la récupération des demandes d'enfants",
      error: error.message
    });
  }
};

// Récupérer une demande spécifique
exports.getDemandeEnfantById = async (req, res) => {
  try {
    const demande = await DemandeInscriptionEnfant.findById(req.params.id)
      .populate('parentId', 'nom prenom email telephone')
      .populate('enfant.classeDemandee', 'nomclass niveau')
      .populate('enfantCree', 'nom prenom dateNaissance');

    if (!demande) {
      return res.status(404).json({
        message: "Demande d'inscription d'enfant non trouvée"
      });
    }

    res.json({ demande });
  } catch (error) {
    console.error('Erreur récupération demande enfant:', error);
    res.status(500).json({
      message: "Erreur lors de la récupération de la demande",
      error: error.message
    });
  }
};

// Traiter une demande d'inscription d'enfant (approuver ou rejeter)
exports.traiterDemandeEnfant = async (req, res) => {
  try {
    const { action, commentaire } = req.body;
    const { id } = req.params;
    let response = null;

    const demande = await DemandeInscriptionEnfant.findById(id)
      .populate('parentId', 'nom prenom email telephone');
      
    if (!demande) {
      return res.status(404).json({
        message: "Demande d'inscription d'enfant non trouvée"
      });
    }

    if (demande.statut !== 'en_attente') {
      return res.status(400).json({
        message: "Cette demande a déjà été traitée"
      });
    }

    if (action === 'approuver') {
      // Créer l'élève
      const eleve = new Eleve({
        nom: demande.enfant.nom,
        prenom: demande.enfant.prenom,
        dateNaissance: demande.enfant.dateNaissance,
        lieuNaissance: demande.enfant.lieuNaissance,
        sexe: demande.enfant.sexe,
        parentId: demande.parentId,
        classe: demande.enfant.classeDemandee,
        photo: demande.enfant.photo,
        acteNaissance: demande.enfant.acteNaissance,
        etablissementPrecedent: demande.enfant.etablissementPrecedent
      });

      await eleve.save();
      console.log('Élève créé:', eleve._id);

      // Ajouter l'enfant à la liste des enfants du parent
      await Parent.findByIdAndUpdate(
        demande.parentId,
        { $push: { enfants: eleve._id } }
      );

      demande.statut = 'approuvee';
      demande.enfantCree = eleve._id;
      
      response = {
        message: "Demande d'inscription d'enfant approuvée avec succès",
        demande,
        eleve: eleve
      };

    } else if (action === 'rejeter') {
      demande.statut = 'rejetee';
      response = {
        message: "Demande d'inscription d'enfant rejetée",
        demande
      };
    } else {
      return res.status(400).json({
        message: "Action invalide. Utilisez 'approuver' ou 'rejeter'"
      });
    }

    demande.dateTraitement = new Date();
    demande.traitePar = req.authUser.uid;
    demande.commentaire = commentaire || '';

    await demande.save();

    res.json(response);
  } catch (error) {
    console.error('Erreur traitement demande enfant:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Un élève existe déjà avec ces informations"
      });
    }
    
    res.status(500).json({
      message: "Erreur lors du traitement de la demande",
      error: error.message
    });
  }
};

// Récupérer le fichier photo
exports.getPhotoFile = async (req, res) => {
  try {
    const demande = await DemandeInscriptionEnfant.findById(req.params.id);

    if (!demande) {
      return res.status(404).json({
        message: "Demande d'inscription d'enfant non trouvée"
      });
    }

    if (!demande.enfant.photo) {
      return res.status(404).json({
        message: "Photo de l'enfant non trouvée"
      });
    }

    const filePath = demande.enfant.photo;
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "Photo introuvable sur le serveur"
      });
    }

    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'image/jpeg';
    
    if (ext === '.png') {
      contentType = 'image/png';
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="photo-${demande.enfant.nom}-${demande.enfant.prenom}${ext}"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Erreur récupération photo:', error);
    res.status(500).json({
      message: "Erreur lors de la récupération de la photo",
      error: error.message
    });
  }
};

// Récupérer le fichier acte de naissance
exports.getActeNaissanceFile = async (req, res) => {
  try {
    const demande = await DemandeInscriptionEnfant.findById(req.params.id);

    if (!demande) {
      return res.status(404).json({
        message: "Demande d'inscription d'enfant non trouvée"
      });
    }

    if (!demande.enfant.acteNaissance) {
      return res.status(404).json({
        message: "Fichier acte de naissance non trouvé"
      });
    }

    const filePath = demande.enfant.acteNaissance;
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "Fichier acte de naissance introuvable sur le serveur"
      });
    }

    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    } else if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.pdf') {
      contentType = 'application/pdf';
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="acte-naissance-${demande.enfant.nom}-${demande.enfant.prenom}${ext}"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Erreur récupération fichier acte de naissance:', error);
    res.status(500).json({
      message: "Erreur lors de la récupération du fichier acte de naissance",
      error: error.message
    });
  }
};

// Récupérer le fichier certificat de domicile
exports.getCertificatDomicileFile = async (req, res) => {
  try {
    const demande = await DemandeInscriptionEnfant.findById(req.params.id);

    if (!demande) {
      return res.status(404).json({
        message: "Demande d'inscription d'enfant non trouvée"
      });
    }

    if (!demande.enfant.certificatDomicile) {
      return res.status(404).json({
        message: "Fichier certificat de domicile non trouvé"
      });
    }

    const filePath = demande.enfant.certificatDomicile;
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "Fichier certificat de domicile introuvable sur le serveur"
      });
    }

    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    } else if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.pdf') {
      contentType = 'application/pdf';
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="certificat-domicile-${demande.enfant.nom}-${demande.enfant.prenom}${ext}"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Erreur récupération fichier certificat de domicile:', error);
    res.status(500).json({
      message: "Erreur lors de la récupération du fichier certificat de domicile",
      error: error.message
    });
  }
};

// Récupérer le fichier ancien bulletin
exports.getAncienBulletinFile = async (req, res) => {
  try {
    const demande = await DemandeInscriptionEnfant.findById(req.params.id);

    if (!demande) {
      return res.status(404).json({
        message: "Demande d'inscription d'enfant non trouvée"
      });
    }

    if (!demande.enfant.ancienBulletin) {
      return res.status(404).json({
        message: "Fichier ancien bulletin non trouvé"
      });
    }

    const filePath = demande.enfant.ancienBulletin;
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "Fichier ancien bulletin introuvable sur le serveur"
      });
    }

    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    } else if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.pdf') {
      contentType = 'application/pdf';
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="ancien-bulletin-${demande.enfant.nom}-${demande.enfant.prenom}${ext}"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Erreur récupération fichier ancien bulletin:', error);
    res.status(500).json({
      message: "Erreur lors de la récupération du fichier ancien bulletin",
      error: error.message
    });
  }
};

// Supprimer une demande d'inscription d'enfant
exports.deleteDemandeEnfant = async (req, res) => {
  try {
    const demande = await DemandeInscriptionEnfant.findById(req.params.id);
    
    if (!demande) {
      return res.status(404).json({
        message: "Demande d'inscription d'enfant non trouvée"
      });
    }

    if (demande.statut === 'approuvee') {
      return res.status(400).json({
        message: "Impossible de supprimer une demande approuvée"
      });
    }

    // Supprimer les fichiers
    const filesToDelete = [
      demande.enfant.photo,
      demande.enfant.acteNaissance,
      demande.enfant.certificatDomicile,
      demande.enfant.ancienBulletin
    ];

    filesToDelete.forEach(filePath => {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await DemandeInscriptionEnfant.findByIdAndDelete(req.params.id);

    res.json({
      message: "Demande d'inscription d'enfant supprimée avec succès"
    });
  } catch (error) {
    console.error('Erreur suppression demande enfant:', error);
    res.status(500).json({
      message: "Erreur lors de la suppression de la demande",
      error: error.message
    });
  }
};

// Statistiques des demandes d'enfants
exports.getStatistiquesEnfants = async (req, res) => {
  try {
    const stats = await DemandeInscriptionEnfant.aggregate([
      {
        $group: {
          _id: '$statut',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalDemandes = await DemandeInscriptionEnfant.countDocuments();
    const demandesEnAttente = await DemandeInscriptionEnfant.countDocuments({ statut: 'en_attente' });
    const demandesApprouvees = await DemandeInscriptionEnfant.countDocuments({ statut: 'approuvee' });
    const demandesRejetees = await DemandeInscriptionEnfant.countDocuments({ statut: 'rejetee' });

    res.json({
      total: totalDemandes,
      enAttente: demandesEnAttente,
      approuvees: demandesApprouvees,
      rejetees: demandesRejetees,
      repartition: stats
    });
  } catch (error) {
    console.error('Erreur statistiques enfants:', error);
    res.status(500).json({
      message: "Erreur lors de la récupération des statistiques",
      error: error.message
    });
  }
};

// Récupérer toutes les classes pour le formulaire
exports.getClasses = async (req, res) => {
  try {
    const classes = await Classe.find().sort({ nomclass: 1 });
    res.json(classes);
  } catch (error) {
    console.error('Erreur récupération classes:', error);
    res.status(500).json({
      message: "Erreur lors de la récupération des classes",
      error: error.message
    });
  }
}; 