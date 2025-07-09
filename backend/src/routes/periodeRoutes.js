const express = require("express");
const router = express.Router();
const controller = require("../controllers/periodeController");

router.post("/", controller.createPeriode);
router.get("/", controller.getPeriodes);

module.exports = router;
