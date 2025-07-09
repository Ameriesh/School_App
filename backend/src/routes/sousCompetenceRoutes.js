const express = require("express");
const router = express.Router();
const controller = require("../controllers/sousCompetenceController");

router.post("/", controller.createSousCompetence);
router.get("/", controller.getSousCompetences);

module.exports = router;
