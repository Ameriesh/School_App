import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import ParentSidebar from './ParentSidebar';
import ParentNavBar from './ParentNavBar';

export default function ParentLayoutDash({ children, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fermer la sidebar sur mobile quand on clique sur l'overlay
  const handleOverlayClick = () => {
    setSidebarOpen(false);
  };

  // Fermer la sidebar sur mobile quand la fenêtre est redimensionnée
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Overlay pour mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={handleOverlayClick}
        />
      )}

      <ParentSidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <ParentNavBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} onLogout={onLogout} />
        <main className="flex-1 p-4 md:p-6 lg:p-10 bg-gray-50 overflow-y-auto min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}