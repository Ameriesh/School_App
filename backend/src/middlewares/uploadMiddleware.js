const multer = require("multer");
const path = require("path");

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // dossier local
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // nom unique
  }
});

const upload = multer({ storage });

module.exports = upload;
