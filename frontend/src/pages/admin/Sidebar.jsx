import { Home, UserPlus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";

export default function Sidebar({ open, setOpen, onLogout }) {

   const navigate = useNavigate(); // Hook pour naviguer
    const handleLogout = async () => {
      await onLogout();
      navigate("/");
    };


  return (
    <div className={`w-64 bg-[#1e1e2f] text-white flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-4 text-xl font-semibold border-b border-white/10">Admin</div>
      <nav className="flex-1 p-4 space-y-3">
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-[#007acc]/20">
          <Home className="mr-2 h-5 w-5" /> Dashboard
        </Button>
       <Link
          to="/enseignants" variant="ghost"
          className="flex items-center text-white hover:bg-[#007acc]/20 transition"
        >
          <Users className="mr-2 h-5 w-5" />
          Enseignants
        </Link>
        <Link
          to="/eleves" variant="ghost"
          className="flex items-center text-white hover:bg-[#007acc]/20 transition"
        >
          <Users className="mr-2 h-5 w-5" />
          Eleves
        </Link>
        <Link
          to="/parents" variant="ghost"
          className="flex items-center text-white hover:bg-[#007acc]/20 transition"
        >
          <Users className="mr-2 h-5 w-5" />
          Parents
        </Link>
        <Link
          to="/classes" variant="ghost"
          className="flex items-center text-white hover:bg-[#007acc]/20 transition"
        >
          <Users className="mr-2 h-5 w-5" />
          Classes
        </Link>
      </nav>
      <div className="p-4">
        <Button onClick={handleLogout} variant="destructive" className="w-full">
          <LogOut className="mr-2 h-5 w-5" /> Déconnexion
        </Button>
      </div>
    </div>
  );
}
