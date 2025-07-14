const express = require('express');
const router = express.Router();
const demandeInscriptionController = require('../controllers/demandeInscriptionController');
const { verifyAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Route publique pour créer une demande d'inscription (avec téléversement de fichier)
router.post('/', upload.single('cni'), demandeInscriptionController.createDemande);

// Routes protégées (nécessitent une authentification admin)
router.get('/', verifyAdmin, demandeInscriptionController.getAllDemandes);
router.get('/statistiques', verifyAdmin, demandeInscriptionController.getStatistiques);

// Route pour récupérer le fichier CNI (doit être avant /:id pour éviter les conflits)
router.get('/:id/cni', verifyAdmin, demandeInscriptionController.getCniFile);

// Routes avec paramètres (doivent être après les routes spécifiques)
router.get('/:id', verifyAdmin, demandeInscriptionController.getDemandeById);
router.put('/:id/traiter', verifyAdmin, demandeInscriptionController.traiterDemande);
router.delete('/:id', verifyAdmin, demandeInscriptionController.deleteDemande);

module.exports = router; 