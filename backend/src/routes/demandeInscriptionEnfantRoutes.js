const express = require('express');
const router = express.Router();
const demandeInscriptionEnfantController = require('../controllers/demandeInscriptionEnfantController');
const { verifyAdmin, verifyParent } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Route pour récupérer les classes (publique) - DOIT ÊTRE EN PREMIER
router.get('/classes', demandeInscriptionEnfantController.getClasses);

// Route pour créer une demande d'inscription d'enfant (parent connecté)
router.post('/', verifyParent, upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'acteNaissance', maxCount: 1 },
  { name: 'certificatDomicile', maxCount: 1 },
  { name: 'ancienBulletin', maxCount: 1 }
]), demandeInscriptionEnfantController.createDemandeEnfant);

// Route pour récupérer les demandes d'un parent (parent connecté)
router.get('/mes-demandes', verifyParent, demandeInscriptionEnfantController.getDemandesEnfantByParent);

// Routes protégées (nécessitent une authentification admin)
router.get('/', verifyAdmin, demandeInscriptionEnfantController.getAllDemandesEnfants);
router.get('/statistiques', verifyAdmin, demandeInscriptionEnfantController.getStatistiquesEnfants);

// Routes pour récupérer les fichiers (admin)
router.get('/:id/photo', verifyAdmin, demandeInscriptionEnfantController.getPhotoFile);
router.get('/:id/acte-naissance', verifyAdmin, demandeInscriptionEnfantController.getActeNaissanceFile);
router.get('/:id/certificat-domicile', verifyAdmin, demandeInscriptionEnfantController.getCertificatDomicileFile);
router.get('/:id/ancien-bulletin', verifyAdmin, demandeInscriptionEnfantController.getAncienBulletinFile);

// Routes avec paramètres (doivent être en dernier)
router.get('/:id', verifyAdmin, demandeInscriptionEnfantController.getDemandeEnfantById);
router.put('/:id/traiter', verifyAdmin, demandeInscriptionEnfantController.traiterDemandeEnfant);
router.delete('/:id', verifyAdmin, demandeInscriptionEnfantController.deleteDemandeEnfant);

module.exports = router; 