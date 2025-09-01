const { admin } = require("../config/firebase-admin-init");
const Teacher = require("../models/Teacher");
const jwt = require('jsonwebtoken');
const Parent = require('../models/Parents');

exports.verifyAdmin = async (req, res, next) => {
  try {
    // Vérification plus robuste de l'initialisation
    if (!admin.apps.length) {
      throw new Error("Firebase Admin not initialized");
    }

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ 
        success: false,
        code: "MISSING_AUTH_TOKEN",
        message: "Authorization token required"
      });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    const userDoc = await admin.firestore()
      .collection("users")
      .doc(decodedToken.uid)
      .get();

    if (!userDoc.exists) {
      return res.status(403).json({
        success: false,
        code: "USER_NOT_FOUND",
        message: "User profile not found"
      });
    }

    const userData = userDoc.data();
    if (userData.role !== "administrateur") {
      return res.status(403).json({
        success: false,
        code: "FORBIDDEN",
        message: "Admin privileges required"
      });
    }

    // Ajout des infos minimales nécessaires
    req.authUser = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: userData.role
    };

    // Mise à jour asynchrone sans attendre
    userDoc.ref.update({
      lastLogin: admin.firestore.FieldValue.serverTimestamp()
    }).catch(console.error);

    next();
  } catch (error) {
    console.error("Auth error:", error);
    
    const status = error.code === "auth/id-token-expired" ? 401 : 
                 error.code === "auth/argument-error" ? 400 : 500;
    
    res.status(status).json({
      success: false,
      code: error.code || "AUTH_ERROR",
      message: error.message
    });
  }
};

// Middleware pour l'authentification des parents
exports.verifyParent = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ 
        success: false,
        code: "MISSING_AUTH_TOKEN",
        message: "Authorization token required"
      });
    }

    const token = authHeader.split(" ")[1];
    
    // Vérifier le token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    if (decoded.role !== 'parent') {
      return res.status(403).json({
        success: false,
        code: "FORBIDDEN",
        message: "Parent privileges required"
      });
    }

    // Ajouter les informations du parent à la requête
    req.parentId = decoded.parentId;
    req.parentEmail = decoded.email;
    req.parentRole = decoded.role;

    next();
  } catch (error) {
    console.error("Parent auth error:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        code: "INVALID_TOKEN",
        message: "Token invalide"
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        code: "TOKEN_EXPIRED",
        message: "Token expiré"
      });
    }
    
    res.status(500).json({
      success: false,
      code: "AUTH_ERROR",
      message: "Erreur d'authentification"
    });
  }
};

// Middleware mixte robuste : parent (JWT) ou enseignant (Firebase)
exports.verifyParentOrEnseignantRobust = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token manquant' });
    }
    const token = authHeader.split(' ')[1];
    // Essayer JWT (parent)
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      if (decoded.role === 'parent') {
        req.authUser = { role: 'parent', parentId: decoded.parentId, email: decoded.email };
        req.parentId = decoded.parentId;
        return next();
      }
    } catch (jwtErr) {
      // Pas un JWT valide, on tente Firebase
    }
    // Essayer Firebase (enseignant)
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const userDoc = await admin.firestore().collection("users").doc(decodedToken.uid).get();
      if (!userDoc.exists || userDoc.data().role !== "enseignant") {
        return res.status(403).json({ message: "Accès réservé aux enseignants" });
      }
      const teacher = await Teacher.findOne({ firebaseUid: decodedToken.uid });
      if (!teacher) {
        return res.status(404).json({ message: "Enseignant non trouvé" });
      }
      req.authUser = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        role: "enseignant",
        mongoId: teacher._id,
      };
      return next();
    } catch (firebaseErr) {
      return res.status(401).json({ message: 'Token invalide ou expiré' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

exports.verifyEnseignant = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userDoc = await admin.firestore().collection("users").doc(decodedToken.uid).get();

    if (!userDoc.exists || userDoc.data().role !== "enseignant") {
      return res.status(403).json({ message: "Accès réservé aux enseignants" });
    }

    const teacher = await Teacher.findOne({ firebaseUid: decodedToken.uid });
    if (!teacher) {
      return res.status(404).json({ message: "Enseignant non trouvé" });
    }

    req.authUser = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: "enseignant",
      mongoId: teacher._id,
    };

    next();
  } catch (err) {
    console.error("verifyEnseignant error:", err);
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};