// backend/src/routes/parentsRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const Parent = require("../models/Parents");
const { addParent, loginParent, getParentProfile } = require("../controllers/parentController");
const { verifyParent } = require("../middlewares/authMiddleware");

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

// GET /api/parents - Récupérer tous les parents
// GET /api/parents
router.get("/", async (req, res) => {
  try {
    const parents = await Parent.find().populate("enfants", "nom prenom classe"); // populate noms d'enfants
    res.json(parents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des parents." });
  }
});

module.exports = router;
