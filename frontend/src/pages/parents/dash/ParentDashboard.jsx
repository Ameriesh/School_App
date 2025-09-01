import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { 
  User, 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  Plus,
  Loader2,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Briefcase
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "@/lib/utils";

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [parentInfo, setParentInfo] = useState(null);
  const [demandesEnfants, setDemandesEnfants] = useState([]);
  const [stats, setStats] = useState({
    totalDemandes: 0,
    enAttente: 0,
    approuvees: 0,
    rejetees: 0
  });

  useEffect(() => {
    fetchParentInfo();
    fetchDemandesEnfants();
  }, []);

  const fetchParentInfo = async () => {
    try {
      const token = getAuthToken('parent');
      if (!token) {
        navigate('/parent/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/parent/profile', {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });

      if (response.ok) {
        const data = await response.json();
        setParentInfo(data.parent);
      } else {
        throw new Error('Erreur lors de la récupération du profil');
      }
    } catch (error) {
      console.error('Erreur récupération profil:', error);
      toast.error("Erreur lors de la récupération du profil");
    } finally {
      setLoading(false);
    }
  };

  const fetchDemandesEnfants = async () => {
    try {
      const token = getAuthToken('parent');
      const response = await fetch('http://localhost:5000/api/demandes-inscription-enfants/mes-demandes', {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDemandesEnfants(data.demandes || []);
        
        // Calculer les statistiques
        const stats = {
          totalDemandes: data.demandes.length,
          enAttente: data.demandes.filter(d => d.statut === 'en_attente').length,
          approuvees: data.demandes.filter(d => d.statut === 'approuvee').length,
          rejetees: data.demandes.filter(d => d.statut === 'rejetee').length
        };
        setStats(stats);
      }
    } catch (error) {
      console.error('Erreur récupération demandes enfants:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('parentToken');
    localStorage.removeItem('parentInfo');
    navigate('/parent/login');
    toast.success("Déconnexion réussie");
  };

  const getStatutBadge = (statut) => {
    switch (statut) {
      case 'en_attente':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">En attente</span>;
      case 'approuvee':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Approuvée</span>;
      case 'rejetee':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejetée</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{statut}</span>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Toaster position="top-right" richColors />
      
      {/* En-tête */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Espace Parent
                </h1>
                <p className="text-gray-600">
                  Bienvenue, {parentInfo?.prenom} {parentInfo?.nom}
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-red-600 hover:text-red-700"
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Informations du parent */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Mes Informations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{parentInfo?.prenom} {parentInfo?.nom}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{parentInfo?.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{parentInfo?.telephone}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{parentInfo?.adresse}</span>
                </div>
                {parentInfo?.profession && (
                  <div className="flex items-center space-x-3">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span>{parentInfo.profession}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Compte activé le {formatDate(parentInfo?.dateActivation)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques des demandes d'enfants */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="transform hover:scale-105 transition-all duration-300 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total demandes</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalDemandes}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transform hover:scale-105 transition-all duration-300 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En attente</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.enAttente}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transform hover:scale-105 transition-all duration-300 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approuvées</p>
                  <p className="text-3xl font-bold text-green-600">{stats.approuvees}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transform hover:scale-105 transition-all duration-300 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejetées</p>
                  <p className="text-3xl font-bold text-red-600">{stats.rejetees}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Actions rapides</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => navigate('/parent/inscrire-enfant')}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Inscrire un enfant
              </Button>
              <Button
                onClick={() => navigate('/parent/mes-enfants')}
                variant="outline"
              >
                <Users className="h-4 w-4 mr-2" />
                Voir mes enfants
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demandes d'inscription d'enfants */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Mes demandes d'inscription d'enfants</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {demandesEnfants.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune demande d'inscription
                </h3>
                <p className="text-gray-500 mb-4">
                  Vous n'avez pas encore soumis de demande d'inscription pour vos enfants.
                </p>
                <Button
                  onClick={() => navigate('/parent/inscrire-enfant')}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Inscrire un enfant
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {demandesEnfants.map((demande) => (
                  <div
                    key={demande._id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {demande.enfant.prenom} {demande.enfant.nom}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {demande.enfant.niveauScolaire} • {formatDate(demande.enfant.dateNaissance)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatutBadge(demande.statut)}
                        <span className="text-sm text-gray-500">
                          {formatDate(demande.dateDemande)}
                        </span>
                      </div>
                    </div>
                    
                    {demande.commentaire && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                        <span className="font-medium">Commentaire :</span> {demande.commentaire}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
