const express = require("express");
const router = express.Router();
const controller = require("../controllers/sousCompetenceController");

router.post("/", controller.createSousCompetence);
router.get("/", controller.getSousCompetences);
router.get("/byCompetence/:id", controller.getByCompetence); // ✅ Corrigé ici

module.exports = router;
