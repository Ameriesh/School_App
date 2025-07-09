exports.handleFirebaseError = (error) => {
  switch (error.code) {
    case 'auth/email-already-exists':
      return { status: 409, message: 'Cet email est déjà utilisé' };
    case 'auth/invalid-email':
      return { status: 400, message: 'Email invalide' };
    case 'auth/weak-password':
      return { status: 400, message: 'Le mot de passe doit contenir au moins 6 caractères' };
    default:
      return { status: 500, message: 'Erreur serveur' };
  }
};