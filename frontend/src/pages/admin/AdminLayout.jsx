import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import { auth, firestore } from "@/services/firebase"; // 🧠 Assure-toi que tu as bien exporté `firestore` de firebase.js
import { doc, getDoc } from "firebase/firestore";

export default function AdminLayout({ children, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState(null); // ⬅️ le rôle actuel
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserRole(data.role); // ex: "administrateur" ou "enseignant"
        } else {
          console.warn("Aucun profil utilisateur trouvé");
          setUserRole("inconnu");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération du rôle :", err);
        setUserRole("inconnu");
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        Chargement du profil...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        onLogout={onLogout}
        role={userRole}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopNav onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} onLogout={onLogout} />
        <main className="flex-1 p-6 md:p-10 bg-gray-50 overflow-y-auto min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}
