import { useState, useEffect } from "react";
import { auth } from './services/firebase'; // Assurez-vous que le chemin est correct
import { onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({ email: currentUser.email, role: "administrateur" });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (email, role) => {
    setUser({ email, role });
  };

 const handleLogout = async () => {
  try {
    await signOut(auth);           // Déconnexion Firebase
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
  }
};

  if (loading) {
    return <p>Chargement...</p>;
  }

  return <AppRoutes user={user} onLogin={handleLogin} onLogout={handleLogout}/>;
}


export default App;
