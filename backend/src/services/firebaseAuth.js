const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // mets le bon chemin

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

async function createFirebaseUser(email, password) {
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    return userRecord;
  } catch (error) {
    throw new Error("Erreur création utilisateur Firebase Admin : " + error.message);
  }
}

module.exports = {
  createFirebaseUser,
};
