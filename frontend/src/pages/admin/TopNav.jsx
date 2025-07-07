import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function TopNav({ onToggleSidebar, onLogout}) {

    const navigate = useNavigate(); // Hook pour naviguer
    const handleLogout = async () => {
    await onLogout();        // Déconnexion Firebase
    navigate("/");           // Rediriger vers login
  };
  return (
    <div className="h-16 bg-white border-b px-4 flex items-center justify-between shadow-sm">
      <Button variant="ghost" onClick={onToggleSidebar}>
        <Menu className="h-6 w-6" />
      </Button>
      <div className="font-semibold text-lg text-[#007ACC]">Espace Administrateur</div>
      <button
          onClick={handleLogout}
          className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition"
        ><LogOut className="mr-2 h-5 w-5" />
          Déconnexion
        </button>
    </div>
  );
}
