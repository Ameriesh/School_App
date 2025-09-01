import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  Users, 
  Home,
  BookOpen,
  UserPlus,
  LogOut,
  Bell,
  User
} from 'lucide-react';
import { toast } from 'sonner';

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('parentToken');
    localStorage.removeItem('parentInfo');
    toast.success('Déconnexion réussie');
    window.location.href = '/parent/login';
  };

  const menuItems = [
    { path: '/parent/dashboard', label: 'Accueil', icon: Home },
    { path: '/parent/mes-enfants', label: 'Mes Enfants', icon: Users },
    { path: '/parent/inscrire-enfant', label: 'Inscrire un enfant', icon: UserPlus },
    { path: '/parent/notes', label: 'Notes', icon: BookOpen },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SchoolApp</h1>
              <p className="text-xs text-gray-500">Espace Parent</p>
            </div>
          </div>

          {/* Menu desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Actions desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Parent</span>
            </div>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 border-red-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>

          {/* Bouton menu mobile */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-6 space-y-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
            
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-700">Espace Parent</span>
                </div>
                
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 border-red-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
