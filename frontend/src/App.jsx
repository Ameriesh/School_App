import { useState, useEffect } from "react";
import { auth, firestore } from './services/firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken();
        const userDoc = await getDoc(doc(firestore, "users", currentUser.uid));
        
        if (!userDoc.exists()) {
          throw new Error("Profil utilisateur non trouvé");
        }

        const userData = userDoc.data();
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          role: userData.role || "inconnu",
          displayName: userData.displayName || ""
        });
      } catch (error) {
        console.error("Erreur récupération profil:", error);
        await handleLogout(); // Déconnecte si erreur
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  });

  return () => unsubscribe();
}, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-xl font-semibold">Chargement en cours...</p>
          {/* Vous pouvez ajouter une animation ou un spinner simple ici */}
          <div className="mt-4 w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return <AppRoutes user={user} onLogout={handleLogout} />;
}

export default App;