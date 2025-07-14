import { Home, Users, CalendarDays, MessageCircle, LogOut, LayoutDashboard, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from 'react-router-dom';

export default function ParentSidebar({ open, setOpen, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await onLogout();
    navigate("/");
  };

  const handleLinkClick = () => {
    // Fermer la sidebar sur mobile après un clic sur un lien
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  };

  return (
    <>
      {/* Sidebar pour desktop */}
      <aside
        className={`hidden md:flex fixed md:static z-30 h-full w-64 bg-[#0a2540] text-white flex-col shadow-2xl transition-all duration-300 ease-in-out rounded-r-2xl`}
      >
        {/* Header */}
        <div className="p-6 text-2xl font-extrabold tracking-tight border-b border-white/10 flex items-center gap-2 select-none">
          <LayoutDashboard className="w-7 h-7 text-[#38bdf8]" />
          <span className="ml-2 text-[#38bdf8]">Parent</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <div className="mt-4 mb-1 text-xs uppercase text-gray-400 px-3">Mon espace</div>

          <Link
            to="/parent/dashboard"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#38bdf8]/20 transition-all duration-200 text-white font-semibold group"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
            <span>Tableau de bord</span>
          </Link>

          <Link
            to="/parent/enfants"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#38bdf8]/20 transition-all duration-200 text-white font-semibold group"
          >
            <Users className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
            <span>Mes Enfants</span>
          </Link>

          <Link
            to="/parent/absences"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#38bdf8]/20 transition-all duration-200 text-white font-semibold group"
          >
            <CalendarDays className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
            <span>Absences</span>
          </Link>

          <Link
            to="/parent/commentaires"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#38bdf8]/20 transition-all duration-200 text-white font-semibold group"
          >
            <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
            <span>Commentaires</span>
          </Link>
        </nav>

        {/* Déconnexion */}
        <div className="p-4 border-t border-white/10">
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full flex items-center gap-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" /> Déconnexion
          </Button>
        </div>
      </aside>

      {/* Sidebar pour mobile */}
      <aside
        className={`md:hidden fixed z-30 h-full w-80 bg-[#0a2540] text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header mobile avec bouton fermer */}
        <div className="p-6 text-2xl font-extrabold tracking-tight border-b border-white/10 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-7 h-7 text-[#38bdf8]" />
            <span className="text-[#38bdf8]">Parent</span>
          </div>
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="text-white hover:bg-white/10 p-2"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Navigation mobile */}
        <nav className="flex-1 p-4 space-y-2">
          <div className="mt-4 mb-1 text-xs uppercase text-gray-400 px-3">Mon espace</div>

          <Link
            to="/parent/dashboard"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-3 py-4 rounded-lg hover:bg-[#38bdf8]/20 transition-all duration-200 text-white font-semibold group"
          >
            <Home className="w-6 h-6 group-hover:scale-110 transition-transform" /> 
            <span className="text-lg">Tableau de bord</span>
          </Link>

          <Link
            to="/parent/enfants"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-3 py-4 rounded-lg hover:bg-[#38bdf8]/20 transition-all duration-200 text-white font-semibold group"
          >
            <Users className="w-6 h-6 group-hover:scale-110 transition-transform" /> 
            <span className="text-lg">Mes Enfants</span>
          </Link>

          <Link
            to="/parent/absences"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-3 py-4 rounded-lg hover:bg-[#38bdf8]/20 transition-all duration-200 text-white font-semibold group"
          >
            <CalendarDays className="w-6 h-6 group-hover:scale-110 transition-transform" /> 
            <span className="text-lg">Absences</span>
          </Link>

          <Link
            to="/parent/commentaires"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-3 py-4 rounded-lg hover:bg-[#38bdf8]/20 transition-all duration-200 text-white font-semibold group"
          >
            <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" /> 
            <span className="text-lg">Commentaires</span>
          </Link>
        </nav>

        {/* Déconnexion mobile */}
        <div className="p-4 border-t border-white/10">
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full flex items-center gap-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-200 py-3"
          >
            <LogOut className="w-5 h-5" /> Déconnexion
          </Button>
        </div>
      </aside>
    </>
  );
}
