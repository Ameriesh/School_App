const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Initialisation sécurisée avec vérification de l'instance existante
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://console.firebase.google.com/project/schoolapp-ef28f" // Ajoutez votre URL Firebase
  });
}

// Fonction pour créer un admin (à exécuter une seule fois)
async function createFirstAdmin() {
  try {
    const email = "shella@gmail.com";
    const password = "Mot2Passe$écurisé";

    const userRecord = await admin.auth().createUser({
      email,
      password,
      emailVerified: true,
    });

    await admin.firestore().collection("users").doc(userRecord.uid).set({
      email,
      role: "administrateur",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLogin: null
    });

    console.log("✅ Admin créé avec succès:");
    console.log("UID:", userRecord.uid);
    console.log("Email:", email);
    
    return userRecord;
  } catch (error) {
    console.error("❌ Erreur création admin:", error);
    throw error;
  }
}

module.exports = {
  admin,
  createFirstAdmin
};