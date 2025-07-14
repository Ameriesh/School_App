import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function ParentRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si le parent est connecté
    const parentToken = localStorage.getItem('parentToken');
    const parentInfo = localStorage.getItem('parentInfo');
    
    if (parentToken && parentInfo) {
      // Rediriger vers le dashboard parent
      navigate('/parent/dashboard', { replace: true });
    } else {
      // Rediriger vers la page de connexion
      navigate('/parent/login', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600">Redirection en cours...</p>
      </div>
    </div>
  );
} 