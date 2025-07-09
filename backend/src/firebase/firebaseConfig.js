const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
async function createAdmin() {
  const email = "admin@ecole.com"; // Remplacez par l'email admin
  const password = "Mot2Passe$écurisé"; // Mot de passe complexe

  try {
    // 1. Créer le compte dans Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      emailVerified: true,
    });

    // 2. Ajouter le rôle "administrateur" dans Firestore
    await admin.firestore().collection("users").doc(userRecord.uid).set({
      email,
      role: "administrateur",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("✅ Admin créé avec succès !");
    console.log("UID:", userRecord.uid);
    console.log("Email:", email);
  } catch (error) {
    console.error("❌ Erreur:", error.message);
  } finally {
    process.exit();
  }
}

createAdmin();

module.exports = admin;
