import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import { auth, firestore } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function AdminLayout({ children, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
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
          setUserRole(data.role);
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

  // Fermer la sidebar sur mobile quand on clique sur l'overlay
  const handleOverlayClick = () => {
    setSidebarOpen(false);
  };

  // Fermer la sidebar sur mobile quand la fenêtre est redimensionnée >= md
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  // Verrouiller le scroll du body quand sidebar mobile est ouverte
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [sidebarOpen]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38bdf8] mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Overlay mobile quand sidebar ouverte */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        onLogout={onLogout}
        role={userRole}
      />

      {/* Contenu principal */}
      <div
        className={`flex-1 flex flex-col min-w-0 relative transition-all duration-300 ease-in-out ${
          sidebarOpen ? "md:ml-64" : ""
        }`}
      >
        <TopNav onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} onLogout={onLogout} />
        <main className="flex-1 p-4 md:p-6 lg:p-10 bg-gray-50 overflow-y-auto min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}
