const express = require("express");
const router = express.Router();
const eleveController = require("../controllers/eleveController");
const multer = require("multer");
const { verifyEnseignant } = require("../middlewares/authMiddleware");
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
router.get("/enseignant", verifyEnseignant, eleveController.getElevesForEnseignant); // ⬅ d'abord les routes spécifiques
router.get("/", eleveController.getEleves);
router.get("/:id", eleveController.getEleveById); // ensuite les dynamiques
router.delete("/:id", eleveController.deleteEleve);


module.exports = router;
