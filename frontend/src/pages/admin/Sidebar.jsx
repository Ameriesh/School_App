import {
  Home,
  Users,
  School,
  BookOpen,
  Settings,
  LogOut,
  LayoutDashboard,
  NotebookPen,
  X,
  GraduationCap,
  UserCheck,
  Calendar,
  Award,
  FileText,
  BarChart3,
  ChevronRight,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Sidebar({ open, setOpen, onLogout, role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({
    gestion: true,
    pedagogique: true,
    enseignant: true
  });

  const handleLogout = async () => {
    await onLogout();
    navigate("/");
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const getIconForPath = (path) => {
    switch (path) {
      case '/admin':
      case '/teacher/dashboard':
        return <Home className="w-5 h-5" />;
      case '/enseignants':
        return <GraduationCap className="w-5 h-5" />;
      case '/eleves':
        return <School className="w-5 h-5" />;
      case '/parents':
        return <UserCheck className="w-5 h-5" />;
      case '/classes':
        return <BookOpen className="w-5 h-5" />;
      case '/periodes':
        return <Calendar className="w-5 h-5" />;
      case '/competences':
        return <Award className="w-5 h-5" />;
      case '/souscompetences':
        return <FileText className="w-5 h-5" />;
      case '/admin/demandes-inscription':
        return <Clock className="w-5 h-5" />;
      case '/teacher/liste-eleve':
        return <School className="w-5 h-5" />;
      case '/teacher/add-notes':
        return <NotebookPen className="w-5 h-5" />;
      case '/teacher/liste-notes':
        return <BarChart3 className="w-5 h-5" />;
      default:
        return <Home className="w-5 h-5" />;
    }
  };

  const SidebarContent = ({ isMobile = false }) => (
    <>
      {/* Header */}
      <div className="p-6 text-2xl font-extrabold tracking-tight border-b border-white/10 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-[#38bdf8] font-bold">
              {role === "enseignant" ? "Espace Enseignant" : "Espace Admin"}
        </span>
            <div className="text-xs text-gray-400 font-normal">
              {role === "enseignant" ? "Gestion des classes" : "Administration"}
            </div>
          </div>
        </div>
        {isMobile && (
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="text-white hover:bg-white/10 p-2 rounded-lg"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {/* Tableau de bord */}
        <Link
          to={role === "enseignant" ? "/teacher/dashboard" : "/admin"}
          onClick={handleLinkClick}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group ${
            isActiveLink(role === "enseignant" ? "/teacher/dashboard" : "/admin")
              ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
              : "text-gray-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Home className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
          <span>Tableau de bord</span>
        </Link>

        {/* Section Administration */}
        {role === "administrateur" && (
          <>
            {/* Section Gestion */}
            <div className="mt-6">
              <button
                onClick={() => toggleSection('gestion')}
                className="flex items-center justify-between w-full px-4 py-2 text-xs uppercase text-gray-400 font-semibold hover:text-gray-300 transition-colors"
              >
                <span>Gestion</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${expandedSections.gestion ? 'rotate-90' : ''}`} />
              </button>
              
              {expandedSections.gestion && (
                <div className="ml-4 space-y-1 mt-2">
                  <Link 
                    to="/enseignants" 
                    onClick={handleLinkClick} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group ${
                      isActiveLink("/enseignants")
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <GraduationCap className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                    <span>Enseignants</span>
                  </Link>
                  
                  <Link 
                    to="/eleves" 
                    onClick={handleLinkClick} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group ${
                      isActiveLink("/eleves")
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <School className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                    <span>Élèves</span>
                  </Link>
                  
                  <Link 
                    to="/parents" 
                    onClick={handleLinkClick} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group ${
                      isActiveLink("/parents")
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <UserCheck className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                    <span>Parents</span>
                  </Link>
                  
                  <Link 
                    to="/classes" 
                    onClick={handleLinkClick} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group ${
                      isActiveLink("/classes")
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                    <span>Classes</span>
                  </Link>

                  <Link 
                    to="/admin/demandes-inscription" 
                    onClick={handleLinkClick} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group ${
                      isActiveLink("/admin/demandes-inscription")
                        ? "bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Clock className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                    <span>Demandes d'inscription</span>
                  </Link>

                  <Link 
                    to="/admin/demandes-inscription-enfants" 
                    onClick={handleLinkClick} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group ${
                      isActiveLink("/admin/demandes-inscription-enfants")
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Users className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                    <span>Demandes Enfants</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Section Paramètres pédagogiques */}
            <div className="mt-6">
              <button
                onClick={() => toggleSection('pedagogique')}
                className="flex items-center justify-between w-full px-4 py-2 text-xs uppercase text-gray-400 font-semibold hover:text-gray-300 transition-colors"
              >
                <span>Paramètres pédagogiques</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${expandedSections.pedagogique ? 'rotate-90' : ''}`} />
              </button>
              
              {expandedSections.pedagogique && (
                <div className="ml-4 space-y-1 mt-2">
                  <Link 
                    to="/periodes" 
                    onClick={handleLinkClick} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group ${
                      isActiveLink("/periodes")
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                    <span>Périodes</span>
            </Link>
                  
                  <Link 
                    to="/competences" 
                    onClick={handleLinkClick} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group ${
                      isActiveLink("/competences")
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Award className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                    <span>Compétences</span>
            </Link>
                  
                  <Link 
                    to="/souscompetences" 
                    onClick={handleLinkClick} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group ${
                      isActiveLink("/souscompetences")
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                    <span>Sous-compétences</span>
            </Link>
                </div>
              )}
            </div>
          </>
        )}

        {/* Section Enseignant */}
        {role === "enseignant" && (
          <>
            <div className="mt-6">
              <button
                onClick={() => toggleSection('enseignant')}
                className="flex items-center justify-between w-full px-4 py-2 text-xs uppercase text-gray-400 font-semibold hover:text-gray-300 transition-colors"
              >
                <span>Mon espace</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${expandedSections.enseignant ? 'rotate-90' : ''}`} />
              </button>
              
              {expandedSections.enseignant && (
                <div className="ml-4 space-y-1 mt-2">
                  <Link 
                    to="/enseignant/eleves" 
                    onClick={handleLinkClick} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group ${
                      isActiveLink("/enseignant/eleves")
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <School className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                    <span>Liste des élèves</span>
            </Link>
                  
                  <Link 
                    to="/enseignant/notes/add" 
                    onClick={handleLinkClick} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group ${
                      isActiveLink("/enseignant/notes/add")
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <NotebookPen className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                    <span>Ajouter des notes</span>
                  </Link>
                  
                  <Link 
                    to="/enseignant/notes" 
                    onClick={handleLinkClick} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group ${
                      isActiveLink("/enseignant/notes")
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <BarChart3 className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                    <span>Liste des notes</span>
                  </Link>
                  <Link 
                    to="/enseignant/absences" 
                    onClick={handleLinkClick} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group ${
                      isActiveLink("/enseignant/notes/add")
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <NotebookPen className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                    <span>Gerer les absences</span>
                  </Link>
                  <Link 
                    to="/enseignant/bulletin" 
                    onClick={handleLinkClick} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group ${
                      isActiveLink("/enseignant/notes/add")
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <NotebookPen className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                    <span>Gerer les bulletins</span>
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </nav>

      {/* Déconnexion */}
      
    </>
  );

  return (
    <>
      {/* Sidebar pour desktop */}
      <aside className="hidden lg:flex fixed lg:static z-30 h-full w-72 bg-gradient-to-b from-[#0a2540] to-[#1e3a8a] text-white flex-col shadow-2xl transition-all duration-300 ease-in-out rounded-r-2xl border-r border-white/10">
        <SidebarContent />
      </aside>

      {/* Sidebar pour tablette */}
      <aside className="hidden md:flex lg:hidden fixed z-30 h-full w-20 bg-gradient-to-b from-[#0a2540] to-[#1e3a8a] text-white flex-col shadow-2xl transition-all duration-300 ease-in-out border-r border-white/10">
        {/* Header compact */}
        <div className="p-4 text-center border-b border-white/10">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mx-auto">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Navigation compacte */}
        <nav className="flex-1 p-2 space-y-2">
          <Link
            to={role === "enseignant" ? "/teacher/dashboard" : "/admin"}
            onClick={handleLinkClick}
            className={`flex items-center justify-center p-3 rounded-xl transition-all duration-200 group ${
              isActiveLink(role === "enseignant" ? "/teacher/dashboard" : "/admin")
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-white/10 hover:text-white"
            }`}
            title="Tableau de bord"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </Link>

          {/* Icônes pour les autres sections selon le rôle */}
          {role === "administrateur" && (
            <>
              <Link to="/enseignants" onClick={handleLinkClick} className="flex items-center justify-center p-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200 group" title="Enseignants">
                <GraduationCap className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
              <Link to="/eleves" onClick={handleLinkClick} className="flex items-center justify-center p-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200 group" title="Élèves">
                <School className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
              <Link to="/parents" onClick={handleLinkClick} className="flex items-center justify-center p-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200 group" title="Parents">
                <UserCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
              <Link to="/classes" onClick={handleLinkClick} className="flex items-center justify-center p-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200 group" title="Classes">
                <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
              <Link to="/admin/demandes-inscription" onClick={handleLinkClick} className="flex items-center justify-center p-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200 group" title="Demandes d'inscription">
                <Clock className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
            </>
          )}

          {role === "enseignant" && (
            <>
              <Link to="/teacher/liste-eleve" onClick={handleLinkClick} className="flex items-center justify-center p-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200 group" title="Liste des élèves">
                <School className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
              <Link to="/teacher/add-notes" onClick={handleLinkClick} className="flex items-center justify-center p-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200 group" title="Ajouter des notes">
                <NotebookPen className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
              <Link to="/teacher/liste-notes" onClick={handleLinkClick} className="flex items-center justify-center p-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200 group" title="Liste des notes">
                <BarChart3 className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
            </>
          )}
        </nav>

        {/* Déconnexion compacte */}
        <div className="p-2 border-t border-white/10">
          <Button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all duration-200 transform hover:scale-105 shadow-lg"
            title="Déconnexion"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </aside>

      {/* Sidebar pour mobile */}
      <aside
        className={`md:hidden fixed z-50 h-full w-80 bg-gradient-to-b from-[#0a2540] to-[#1e3a8a] text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent isMobile={true} />
    </aside>

      {/* Overlay pour mobile */}
      {open && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
