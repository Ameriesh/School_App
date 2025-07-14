// backend/src/controllers/parentController.js
const Parent = require("../models/Parents");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Connexion parent
exports.loginParent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier que l'email et le mot de passe sont fournis
    if (!email || !password) {
      return res.status(400).json({
        message: "Email et mot de passe requis"
      });
    }

    // Rechercher le parent par email
    const parent = await Parent.findOne({
      $or: [
        { email: email },
        { email1: email },
        { email2: email }
      ]
    });

    if (!parent) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect"
      });
    }

    // Vérifier si le compte est actif
    if (!parent.compteActif) {
      return res.status(401).json({
        message: "Votre compte n'est pas encore activé. Contactez l'administration."
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, parent.motDePasse);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect"
      });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { 
        parentId: parent._id,
        email: parent.email,
        role: 'parent'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Retourner les informations du parent (sans le mot de passe)
    const parentInfo = {
      _id: parent._id,
      nom: parent.nom,
      prenom: parent.prenom,
      email: parent.email,
      telephone: parent.telephone,
      adresse: parent.adresse,
      profession: parent.profession,
      compteActif: parent.compteActif,
      dateActivation: parent.dateActivation,
      enfants: parent.enfants || []
    };

    res.json({
      message: "Connexion réussie",
      token,
      parent: parentInfo
    });

  } catch (error) {
    console.error('Erreur connexion parent:', error);
    res.status(500).json({
      message: "Erreur lors de la connexion",
      error: error.message
    });
  }
};

// Récupérer les informations du parent connecté
exports.getParentProfile = async (req, res) => {
  try {
    const parent = await Parent.findById(req.parentId).select('-motDePasse');
    
    if (!parent) {
      return res.status(404).json({
        message: "Parent non trouvé"
      });
    }

    res.json({ parent });
  } catch (error) {
    console.error('Erreur récupération profil parent:', error);
    res.status(500).json({
      message: "Erreur lors de la récupération du profil",
      error: error.message
    });
  }
};

exports.addParent = async (req, res) => {
  try {
    const {
      nom, prenom, profession, email, telephone, adresse,
      name_user, password
    } = req.body;

    const photo = req.files?.photo?.[0]?.filename || null;

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    const newParent = new Parent({
      nom,
      prenom,
      profession,
      email,
      telephone,
      adresse,
      motDePasse: hashedPassword,
      compteActif: true,
      dateActivation: new Date(),
      photo: photo,
      role: 'parent'
    });

    await newParent.save();
    res.status(201).json({ message: "Parent ajouté avec succès", parent: newParent });
  } catch (error) {
    console.error("Erreur ajout parent:", error);
    res.status(500).json({ message: "Erreur lors de l'ajout du parent", error: error.message });
  }
};
