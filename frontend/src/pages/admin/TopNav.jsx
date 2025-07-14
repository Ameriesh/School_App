import { 
  Menu, 
  LogOut, 
  Shield, 
  User, 
  Settings, 
  Bell, 
  Search,
  ChevronDown,
  Sun,
  Moon,
  HelpCircle,
  FileText,
  Lock,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";

export default function TopNav({ onToggleSidebar, onLogout, role }) {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Nouvelle note ajoutée",
      message: "Une note a été ajoutée pour l'élève Jean Dupont",
      time: "Il y a 5 minutes",
      read: false,
      type: "note"
    },
    {
      id: 2,
      title: "Période d'évaluation",
      message: "La période UA3 se termine dans 2 jours",
      time: "Il y a 1 heure",
      read: false,
      type: "warning"
    },
    {
      id: 3,
      title: "Mise à jour système",
      message: "Le système a été mis à jour avec succès",
      time: "Il y a 3 heures",
      read: true,
      type: "info"
    }
  ]);

  const handleLogout = async () => {
    await onLogout();
    navigate("/");
    toast.success("Déconnexion réussie");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast.success(`Mode ${!darkMode ? 'sombre' : 'clair'} activé`);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-menu') && !event.target.closest('.notifications-menu')) {
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'note':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <Bell className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <HelpCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between shadow-sm sticky top-0 z-20 backdrop-blur-sm bg-white/95">
      <Toaster position="top-right" richColors />
      
      {/* Section gauche */}
      <div className="flex items-center space-x-4">
        {/* Bouton menu mobile */}
        <Button
          variant="ghost"
          onClick={onToggleSidebar}
          className="md:hidden p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-300 ease-in-out"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo et titre */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-lg text-gray-900">
              {role === "enseignant" ? "Espace Enseignant" : "Espace Administrateur"}
            </h1>
            <p className="text-xs text-gray-500">
              {role === "enseignant" ? "Gestion des classes" : "Administration"}
            </p>
          </div>
        </div>
      </div>

      {/* Section centrale - Recherche */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Section droite */}
      <div className="flex items-center space-x-2">
        {/* Bouton recherche mobile */}
        <Button
          variant="ghost"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="md:hidden p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-300"
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Mode sombre/clair */}
        <Button
          variant="ghost"
          onClick={toggleDarkMode}
          className="p-2 hover:bg-gray-100 hover:text-gray-700 rounded-lg transition duration-300"
          title={darkMode ? "Mode clair" : "Mode sombre"}
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* Notifications */}
        <div className="relative notifications-menu">
          <Button
            variant="ghost"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 hover:bg-gray-100 hover:text-gray-700 rounded-lg transition duration-300 relative"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>

          {/* Menu notifications */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <p className="text-sm text-gray-500">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => markNotificationAsRead(notification.id)}
                      className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900">{notification.title}</p>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Aucune notification
                  </div>
                )}
              </div>
              <div className="p-2 border-t border-gray-200">
                <Button variant="ghost" className="w-full text-sm text-blue-600 hover:text-blue-700">
                  Voir toutes les notifications
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Menu profil */}
        <div className="relative profile-menu">
          <Button
            variant="ghost"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 hover:text-gray-700 rounded-lg transition duration-300"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-900">
                {role === "enseignant" ? "Enseignant" : "Administrateur"}
              </p>
              <p className="text-xs text-gray-500">Utilisateur</p>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
          </Button>

          {/* Menu déroulant profil */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {role === "enseignant" ? "Enseignant" : "Administrateur"}
                    </p>
                    <p className="text-sm text-gray-500">utilisateur@schoolapp.com</p>
                  </div>
                </div>
              </div>
              
              <div className="p-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left p-3 hover:bg-gray-50 rounded-lg"
                  onClick={() => {
                    setIsProfileOpen(false);
                    toast.info("Profil utilisateur");
                  }}
                >
                  <User className="h-4 w-4 mr-3" />
                  Mon profil
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left p-3 hover:bg-gray-50 rounded-lg"
                  onClick={() => {
                    setIsProfileOpen(false);
                    toast.info("Paramètres du compte");
                  }}
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Paramètres
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left p-3 hover:bg-gray-50 rounded-lg"
                  onClick={() => {
                    setIsProfileOpen(false);
                    toast.info("Changer le mot de passe");
                  }}
                >
                  <Lock className="h-4 w-4 mr-3" />
                  Changer mot de passe
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left p-3 hover:bg-gray-50 rounded-lg"
                  onClick={() => {
                    setIsProfileOpen(false);
                    toast.info("Aide et support");
                  }}
                >
                  <HelpCircle className="h-4 w-4 mr-3" />
                  Aide
      </Button>
              </div>
              
              <div className="p-2 border-t border-gray-200">
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start text-left p-3 hover:bg-red-50 hover:text-red-600 rounded-lg text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Déconnexion
      </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recherche mobile */}
      {isSearchOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 p-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
}
