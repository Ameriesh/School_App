import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, School, BookOpen, Settings, TrendingUp, Calendar, Award, Activity, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard({ onLogout }) {
  const navigate = useNavigate();
  const [demandesStats, setDemandesStats] = useState({
    total: 0,
    enAttente: 0,
    approuvees: 0,
    rejetees: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDemandesStats();
  }, []);

  const fetchDemandesStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:5000/api/demandes-inscription/statistiques', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setDemandesStats(data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  // Données simulées pour les statistiques
  const stats = [
    {
      title: "Enseignants",
      value: "24",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+2 ce mois"
    },
    {
      title: "Élèves",
      value: "342",
      icon: School,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+15 ce mois"
    },
    {
      title: "Classes",
      value: "12",
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+1 ce mois"
    },
    {
      title: "Parents",
      value: "298",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "+8 ce mois"
    }
  ];

  const recentActivities = [
    {
      action: "Nouvel enseignant ajouté",
      user: "Marie Dubois",
      time: "Il y a 2 heures",
      type: "success"
    },
    {
      action: "Nouvelle classe créée",
      user: "6ème A",
      time: "Il y a 4 heures",
      type: "info"
    },
    {
      action: "Note mise à jour",
      user: "Mathématiques - 5ème B",
      time: "Il y a 6 heures",
      type: "warning"
    },
    {
      action: "Parent inscrit",
      user: "Jean Martin",
      time: "Il y a 1 jour",
      type: "success"
    }
  ];

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-2">
              Tableau de bord
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Gérez votre établissement scolaire en toute simplicité
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 overflow-hidden group">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs md:text-sm text-gray-500 font-medium mb-1">{stat.title}</p>
                    <p className="text-xl md:text-2xl font-bold text-[#0f172a]">{stat.value}</p>
                    <p className="text-xs text-green-600 font-medium mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 ${stat.bgColor} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Demandes d'inscription - Section spéciale */}
        {demandesStats.enAttente > 0 && (
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-yellow-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                Demandes d'inscription en attente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-700">{demandesStats.enAttente}</div>
                    <div className="text-sm text-yellow-600">Demandes en attente</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">{demandesStats.approuvees}</div>
                    <div className="text-sm text-green-600">Approuvées</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-700">{demandesStats.rejetees}</div>
                    <div className="text-sm text-red-600">Rejetées</div>
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/admin/demandes-inscription')}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Gérer les demandes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section principale */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Carte de bienvenue */}
          <Card className="bg-gradient-to-br from-[#38bdf8]/5 to-[#0a2540]/5 shadow-lg rounded-2xl border-0 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#0f172a] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#38bdf8]" />
                Bienvenue dans votre espace
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm md:text-base mb-4">
                Utilisez la barre latérale pour gérer les enseignants, élèves, parents et classes de votre établissement.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Gestion</span>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium">Paramètres</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activités récentes */}
          <Card className="bg-white shadow-lg rounded-2xl border-0 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#0f172a] flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#38bdf8]" />
                Activités récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'success' ? 'bg-green-500' :
                      activity.type === 'warning' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <Card className="bg-white shadow-lg rounded-2xl border-0 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#0f172a] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#38bdf8]" />
              Actions rapides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div 
                onClick={() => navigate('/admin/enseignants/add')}
                className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-medium text-gray-700">Ajouter un enseignant</p>
                    <p className="text-xs text-gray-500">Nouveau profil</p>
                  </div>
                </div>
              </div>
              <div 
                onClick={() => navigate('/admin/eleves/add')}
                className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <School className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-medium text-gray-700">Inscrire un élève</p>
                    <p className="text-xs text-gray-500">Nouvelle inscription</p>
                  </div>
                </div>
              </div>
              <div 
                onClick={() => navigate('/admin/classes/add')}
                className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-medium text-gray-700">Créer une classe</p>
                    <p className="text-xs text-gray-500">Nouvelle classe</p>
                  </div>
                </div>
              </div>
              <div 
                onClick={() => navigate('/admin/demandes-inscription')}
                className="p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-yellow-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-medium text-gray-700">Demandes parents</p>
                    <p className="text-xs text-gray-500">{demandesStats.enAttente} en attente</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
