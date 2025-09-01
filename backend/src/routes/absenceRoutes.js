// backend/src/routes/absenceRoutes.js
const express = require("express");
const router = express.Router();
const absenceController = require("../controllers/absenceController");
const { verifyEnseignant, verifyParent } = require("../middlewares/authMiddleware");

// Ajouter une absence
router.post("/", verifyEnseignant, absenceController.addAbsence);

// Lister les absences (avec filtres)
router.get("/", verifyEnseignant, absenceController.listAbsences);

// Lister toutes les absences (admin ou debug)
router.get("/all", absenceController.listAllAbsences);

// Permettre au parent de voir les absences de son enfant
router.get("/parent/:enfantId", verifyParent, absenceController.getAbsencesForParent);

// Modifier une absence
router.put("/:id", verifyEnseignant, absenceController.updateAbsence);

// Supprimer une absence
router.delete("/:id", verifyEnseignant, absenceController.deleteAbsence);

module.exports = router; 