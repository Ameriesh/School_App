const express = require("express");
const router = express.Router();
const { verifyTeacher } = require("../middlewares/authMiddleware");
const noteController = require("../controllers/noteController");

// L’enseignant envoie plusieurs notes à la fois
router.post("/", verifyTeacher, noteController.createMultipleNotes);

// Récupérer les notes d’un élève dans une période
router.get("/eleve/:eleveId", verifyTeacher, noteController.getNotesByEleve);

module.exports = router;
