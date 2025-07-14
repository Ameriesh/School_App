import { Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ParentNavBar({ onToggleSidebar, onLogout }) {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await onLogout();
    navigate("/");
  };
  
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between shadow-sm sticky top-0 z-20">
      {/* Bouton menu mobile */}
      <Button 
        variant="ghost" 
        onClick={onToggleSidebar} 
        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Menu className="h-6 w-6 text-[#0a2540]" />
      </Button>

      {/* Titre */}
      <div className="font-extrabold text-lg md:text-xl text-[#38bdf8] mx-auto md:mx-0 flex items-center gap-2">
        <User className="w-5 h-5 md:w-6 md:h-6" />
        <span>Espace Parent</span>
      </div>

      {/* Bouton déconnexion */}
      <Button 
        onClick={handleLogout} 
        variant="destructive" 
        className="flex items-center gap-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-200 text-sm md:text-base px-3 md:px-4 py-2"
      >
        <LogOut className="h-4 w-4 md:h-5 md:w-5" /> 
        <span className="hidden sm:inline">Déconnexion</span>
      </Button>
    </header>
  );
}
