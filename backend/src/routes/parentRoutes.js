// backend/src/routes/parentsRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const Parent = require("../models/Parents");
const { addParent } = require("../controllers/parentController");

router.post(
  "/",
  upload.fields([{ name: "photo1" }, { name: "photo2" }]),
  addParent
);


// GET /api/parents - Récupérer tous les parents
router.get("/", async (req, res) => {
  try {
    const parents = await Parent.find(); // récupère tous les documents parents
    res.json(parents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des parents." });
  }
});

module.exports = router;
