import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function TopNav({ onToggleSidebar, onLogout }) {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await onLogout();
    navigate("/");
  };
  return (
    <header className="h-16 bg-white border-b px-4 flex items-center justify-between shadow-md sticky top-0 z-20 rounded-b-2xl">
      <Button variant="ghost" onClick={onToggleSidebar} className="md:hidden">
        <Menu className="h-6 w-6 text-[#0a2540]" />
      </Button>
      <div className="font-extrabold text-xl text-[#38bdf8] mx-auto md:mx-0">Espace Administrateur</div>
      <Button onClick={handleLogout} variant="destructive" className="flex items-center gap-2 rounded-lg bg-red-600 hover:bg-red-700">
        <LogOut className="h-5 w-5" /> Déconnexion
      </Button>
    </header>
  );
}
