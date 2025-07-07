// backend/src/routes/classeRoutes.js
const express = require("express");
const router = express.Router();
const { addClasse, getClasses } = require("../controllers/classeController");

router.post("/", addClasse);    
router.get("/", getClasses);     

module.exports = router;
