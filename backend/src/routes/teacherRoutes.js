const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const teacherController = require("../controllers/teacherController");
const { verifyAdmin } = require("../middlewares/authMiddleware");

// Appliquer la vérification admin UNIQUEMENT sur les routes qui le nécessitent

// 🟢 Ajouter un enseignant (admin uniquement)
router.post("/", verifyAdmin, upload.single("photo"), teacherController.addTeacher);

// 🔵 Récupérer les enseignants (admin uniquement)
router.get("/", verifyAdmin, teacherController.getTeachers);

module.exports = router;
