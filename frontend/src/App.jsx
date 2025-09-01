import { useState, useEffect } from "react";
import { auth, firestore } from './services/firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier d'abord s'il y a un token parent
    const parentToken = localStorage.getItem('parentToken');
    const parentInfo = localStorage.getItem('parentInfo');
    
    if (parentToken && parentInfo) {
      try {
        const parentData = JSON.parse(parentInfo);
        setUser({
          uid: parentData._id,
          email: parentData.email,
          role: 'parent',
          displayName: `${parentData.prenom} ${parentData.nom}`,
          token: parentToken
        });
        setLoading(false);
        return;
      } catch (error) {
        console.error("Erreur parsing parent info:", error);
        // Nettoyer les données invalides
        localStorage.removeItem('parentToken');
        localStorage.removeItem('parentInfo');
      }
    }

    // Si pas de token parent, vérifier Firebase
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
            displayName: userData.displayName || "",
            token: token
          });
        } catch (error) {
          console.error("Erreur récupération profil:", error);
          setUser({ error: error.message });
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
      // Si c'est un parent, nettoyer les données parent
      if (user?.role === 'parent') {
        localStorage.removeItem('parentToken');
        localStorage.removeItem('parentInfo');
        setUser(null);
      } else {
        // Si c'est un utilisateur Firebase, déconnecter Firebase
        await signOut(auth);
        setUser(null);
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      // En cas d'erreur, forcer la déconnexion en nettoyant tout
      localStorage.removeItem('parentToken');
      localStorage.removeItem('parentInfo');
      setUser(null);
    }
  };

  // Affichage d'un message d'erreur explicite si le user n'a pas le rôle enseignant
  if (user && user.role !== 'enseignant' && window.location.pathname.startsWith('/enseignant')) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-600">Accès refusé : vous n'avez pas le rôle enseignant.</p>
        </div>
      </div>
    );
  }

  if (user && user.error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-600">Erreur : {user.error}</p>
        </div>
      </div>
    );
  }

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