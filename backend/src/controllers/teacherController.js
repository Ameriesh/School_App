const admin = require("firebase-admin");
const Teacher = require("../models/Teacher");

exports.addTeacher = async (req, res) => {
  const requiredFields = ['email', 'password', 'nom', 'prenom'];
  const missingFields = requiredFields.filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing required fields: ${missingFields.join(', ')}`
    });
  }

  let userRecord;
  try {
    // 1. Création du compte Firebase
    userRecord = await admin.auth().createUser({
      email: req.body.email,
      password: req.body.password,
      displayName: `${req.body.prenom} ${req.body.nom}`,
      emailVerified: false
    });

    // 2. Création du profil dans Firestore
    const userProfile = {
      email: req.body.email,
      role: "enseignant",
      nom: req.body.nom,
      prenom: req.body.prenom,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await admin.firestore()
      .collection("users")
      .doc(userRecord.uid)
      .set(userProfile);

    // 3. Sauvegarde dans MongoDB
    const teacherData = {
      firebaseUid: userRecord.uid,
      ...req.body,
      photo: req.file?.filename || null,
      dateNaissance: req.body.dateNaissance ? new Date(req.body.dateNaissance) : null,
      dateEntree: req.body.dateEntree ? new Date(req.body.dateEntree) : null
    };

    const newTeacher = await Teacher.create(teacherData);

    return res.status(201).json({
      success: true,
      data: {
        id: newTeacher._id,
        firebaseUid: userRecord.uid,
        email: req.body.email
      }
    });

  } catch (error) {
    console.error("Create teacher error:", error);
    
    // Nettoyage en cas d'erreur
    if (userRecord) {
      try {
        await admin.auth().deleteUser(userRecord.uid);
        await admin.firestore().collection("users").doc(userRecord.uid).delete();
      } catch (cleanupError) {
        console.error("Cleanup error:", cleanupError);
      }
    }

    const status = error.code === 'auth/email-already-in-use' ? 409 : 
                 error.code === 'auth/weak-password' ? 400 : 500;

    return res.status(status).json({
      success: false,
      code: error.code || "SERVER_ERROR",
      message: error.message
    });
  }
};

exports.getTeachers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { nom: searchRegex },
        { prenom: searchRegex },
        { email: searchRegex }
      ];
    }

    const [teachers, total] = await Promise.all([
      Teacher.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Teacher.countDocuments(query)
    ]);

    // ✅ Une seule réponse ici
    return res.status(200).json({
      success: true,
      data: teachers,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        limit
      }
    });

  } catch (error) {
    console.error("Get teachers error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
