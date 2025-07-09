const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");
const { protect } = require("../middlewares/authMiddleware"); // middleware qui vérifie le token Firebase

// ✅ Route : Ajouter une note
router.post("/", protect, noteController.addNote);

module.exports = router;
