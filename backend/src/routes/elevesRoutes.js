const express = require("express");
const router = express.Router();
const eleveController = require("../controllers/eleveController");
const multer = require("multer");

// 📸 Config multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});
const upload = multer({ storage });

// Routes
router.post("/", upload.single("photo"), eleveController.createEleve);
router.get("/", eleveController.getEleves);
router.get("/:id", eleveController.getEleveById);
router.delete("/:id", eleveController.deleteEleve);

module.exports = router;
