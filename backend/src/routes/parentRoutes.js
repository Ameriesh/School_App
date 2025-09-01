// backend/src/routes/parentsRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const Parent = require("../models/Parents");
const { addParent, loginParent, getParentProfile, getNotes, getAllParents } = require("../controllers/parentController");
const { verifyParent, verifyParentOrEnseignantRobust, verifyAdmin } = require("../middlewares/authMiddleware");

// Route publique pour la connexion des parents
router.post("/login", loginParent);

// Route protégée pour récupérer le profil du parent connecté
router.get("/profile", verifyParent, getParentProfile);

// Route pour ajouter un parent (admin)
router.post(
  "/",
  upload.fields([{ name: "photo1" }, { name: "photo2" }]),
  addParent
);

// GET /api/parents - Récupérer tous les parents (admin seulement)
router.get("/", verifyAdmin, getAllParents);

// Route pour récupérer les notes d'un enfant pour un parent
router.get("/notes", verifyParentOrEnseignantRobust, getNotes);

module.exports = router;
