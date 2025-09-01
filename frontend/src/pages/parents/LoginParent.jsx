import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "sonner";
import { 
  User, 
  Mail, 
  Lock, 
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginParent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Le mot de passe est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/parent/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Stocker le token et les informations du parent
        localStorage.setItem('parentToken', data.token);
        localStorage.setItem('parentInfo', JSON.stringify(data.parent));
        
        toast.success("Connexion réussie ! Bienvenue dans votre espace parent.");
        
        // Rediriger vers la page de redirection
        setTimeout(() => {
          window.location.href = '/parent/redirect';
        }, 1500);
      } else {
        throw new Error(data.message || 'Erreur lors de la connexion');
      }
    } catch (error) {
      toast.error(error.message || "Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <Toaster position="top-right" richColors />
      
      {/* Logo/En-tête */}
      <div className="absolute top-8 left-8">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">SchoolApp</h1>
            <p className="text-xs text-gray-500">Espace Parent</p>
          </div>
        </div>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Connexion - Espace Parent
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Connectez-vous avec vos identifiants reçus par email
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="votre@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Informations importantes */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Informations importantes
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Utilisez les identifiants reçus par email</li>
                <li>• Changez votre mot de passe après la première connexion</li>
                <li>• Vous pourrez ajouter vos enfants après connexion</li>
                <li>• Contactez l'administration si vous avez des problèmes</li>
              </ul>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Connexion en cours...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Se connecter</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}