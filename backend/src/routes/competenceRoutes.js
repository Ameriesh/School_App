const express = require("express");
const router = express.Router();
const controller = require("../controllers/competenceController");

router.post("/", controller.createCompetence);
router.get("/", controller.getAllCompetences);

module.exports = router;
