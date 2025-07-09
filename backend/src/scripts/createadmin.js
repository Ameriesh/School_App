const { createFirstAdmin } = require("../config/firebase-admin-init");

// Exécution sécurisée avec gestion des erreurs
createFirstAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Échec de la création admin:", error);
    process.exit(1);
  });