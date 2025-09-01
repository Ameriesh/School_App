const express = require("express");
const router = express.Router();
const eleveController = require("../controllers/eleveController");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { verifyEnseignant, verifyAdmin } = require("../middlewares/authMiddleware");

// Créer le dossier uploads s'il n'existe pas
const uploadsDir = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Dossier uploads créé:", uploadsDir);
}

// 📸 Config multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});
const upload = multer({ storage });

// Middleware de gestion d'erreur pour multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("Erreur Multer:", err);
    return res.status(400).json({ message: "Erreur lors du téléchargement du fichier" });
  }
  next(err);
};

// Routes
router.post("/", verifyAdmin, upload.single("photo"), handleMulterError, eleveController.createEleve);
router.get("/enseignant", verifyEnseignant, eleveController.getElevesForEnseignant); // ⬅ d'abord les routes spécifiques
router.get("/", eleveController.getEleves);
router.get("/:id", eleveController.getEleveById); // ensuite les dynamiques
router.delete("/:id", verifyAdmin, eleveController.deleteEleve);

module.exports = router;
