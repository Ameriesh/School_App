import {
  Home,
  Users,
  School,
  BookOpen,
  Settings,
  LogOut,
  LayoutDashboard,
  NotebookPen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";

export default function Sidebar({ open, setOpen, onLogout, role }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await onLogout();
    navigate("/");
  };

  return (
    <aside
      className={`fixed md:static z-30 h-full w-64 bg-[#0a2540] text-white flex flex-col shadow-2xl transition-transform duration-300 ${
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      } rounded-r-2xl`}
    >
      {/* Header */}
      <div className="p-6 text-2xl font-extrabold tracking-tight border-b border-white/10 flex items-center gap-2 select-none">
        <LayoutDashboard className="w-7 h-7 text-[#38bdf8]" />
        <span className="ml-2 text-[#38bdf8]">
          {role === "enseignant" ? "Enseignant" : "Admin"}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">

        {/* Section : Tableau de bord */}
        <Link
          to={role === "enseignant" ? "/enseignant/dashboard" : "/admin"}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#38bdf8]/20 transition text-white font-semibold"
        >
          <Home className="w-5 h-5" /> Tableau de bord
        </Link>

        {/* Section : Administration */}
        {role === "administrateur" && (
          <>
            <div className="mt-4 mb-1 text-xs uppercase text-gray-400 px-3">Gestion</div>

            <Link to="/enseignants" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#38bdf8]/20 transition text-white font-semibold">
              <Users className="w-5 h-5" /> Enseignants
            </Link>
            <Link to="/eleves" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#38bdf8]/20 transition text-white font-semibold">
              <School className="w-5 h-5" /> Élèves
            </Link>
            <Link to="/parents" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#38bdf8]/20 transition text-white font-semibold">
              <Users className="w-5 h-5" /> Parents
            </Link>
            <Link to="/classes" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#38bdf8]/20 transition text-white font-semibold">
              <BookOpen className="w-5 h-5" /> Classes
            </Link>

            <div className="mt-4 mb-1 text-xs uppercase text-gray-400 px-3">Paramètres pédagogiques</div>

            <Link to="/periodes" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#38bdf8]/20 transition text-white font-semibold">
              <NotebookPen className="w-5 h-5" /> Périodes
            </Link>
            <Link to="/competences" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#38bdf8]/20 transition text-white font-semibold">
              <NotebookPen className="w-5 h-5" /> Compétences
            </Link>
            <Link to="/souscompetences" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#38bdf8]/20 transition text-white font-semibold">
              <NotebookPen className="w-5 h-5" /> Sous-compétences
            </Link>
          </>
        )}

        {/* Section : Enseignant */}
        {role === "enseignant" && (
          <>
            <div className="mt-4 mb-1 text-xs uppercase text-gray-400 px-3">Mon espace</div>
            <Link to="/enseignants/liste" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#38bdf8]/20 transition text-white font-semibold">
              <School className="w-5 h-5" /> Liste des élèves
            </Link>
            <Link to="/notes" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#38bdf8]/20 transition text-white font-semibold">
              <NotebookPen className="w-5 h-5" /> Les notes
            </Link>
            <Link to="/bulletins" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#38bdf8]/20 transition text-white font-semibold">
              <NotebookPen className="w-5 h-5" /> Bulletins
            </Link>
          </>
        )}
      </nav>

      {/* Déconnexion */}
      <div className="p-4 border-t border-white/10">
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full flex items-center gap-2 rounded-lg bg-red-600 hover:bg-red-700"
        >
          <LogOut className="w-5 h-5" /> Déconnexion
        </Button>
      </div>
    </aside>
  );
}
