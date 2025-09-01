import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { 
  Users, 
  BookOpen, 
  FileText, 
  Calendar,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../admin/AdminLayout";
import { getAuthToken } from "@/lib/utils";

export default function TeacherDashboard({ onLogout}) {
  const [stats, setStats] = useState({
    totalEleves: 0,
    totalNotes: 0,
    periodesActives: 0,
    competences: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      const token = getAuthToken();
      
      try {
        const [elevesRes, periodesRes, competencesRes] = await Promise.all([
          fetch("http://localhost:5000/api/eleves/enseignant", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/periodes", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/competences", {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        const elevesData = await elevesRes.json();
        const periodesData = await periodesRes.json();
        const competencesData = await competencesRes.json();

        setStats({
          totalEleves: elevesData.eleves?.length || 0,
          periodesActives: periodesData.periodes?.length || 0,
          competences: competencesData.competences?.length || 0
        });

        // Simuler des activités récentes
        setRecentActivities([
          {
            id: 1,
            type: "note",
            message: "Notes ajoutées pour la compétence Mathématiques",
            time: "Il y a 2 heures",
            icon: FileText,
            color: "text-green-600"
          },
          {
            id: 2,
            type: "periode",
            message: "Nouvelle période UA3 activée",
            time: "Il y a 1 jour",
            icon: Calendar,
            color: "text-blue-600"
          },
          {
            id: 3,
            type: "eleve",
            message: "Nouvel élève ajouté à votre classe",
            time: "Il y a 3 jours",
            icon: Users,
            color: "text-purple-600"
          }
        ]);

      } catch (error) {
        toast.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickActions = [
    {
      title: "Ajouter des Notes",
      description: "Saisir les notes des élèves",
      icon: FileText,
      color: "bg-gradient-to-r from-blue-500 to-cyan-500",
      action: () => navigate("/teacher/add-notes")
    },
    {
      title: "Voir les Élèves",
      description: "Consulter la liste des élèves",
      icon: Users,
      color: "bg-gradient-to-r from-green-500 to-emerald-500",
      action: () => navigate("/teacher/liste-eleve")
    },
    {
      title: "Consulter les Notes",
      description: "Voir toutes les notes",
      icon: BookOpen,
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      action: () => navigate("/teacher/liste-notes")
    },
    {
      title: "Périodes",
      description: "Gérer les périodes d'évaluation",
      icon: Calendar,
      color: "bg-gradient-to-r from-orange-500 to-red-500",
      action: () => navigate("/admin/periodes")
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg font-semibold text-gray-700">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout onLogout={onLogout}>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Toaster position="top-right" richColors />
      
      {/* En-tête */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Tableau de Bord Enseignant
              </h1>
              <p className="mt-2 text-gray-600">
                Bienvenue ! Gérez vos classes et vos évaluations en toute simplicité.
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>{new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Élèves</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalEleves}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+12% ce mois</span>
              </div>
            </CardContent>
          </Card>

          <Card className="transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Notes Saisies</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalNotes}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>À jour</span>
              </div>
            </CardContent>
          </Card>

          <Card className="transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Périodes Actives</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.periodesActives}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-blue-600">
                <Clock className="h-4 w-4 mr-1" />
                <span>En cours</span>
              </div>
            </CardContent>
          </Card>

          <Card className="transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Compétences</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.competences}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-orange-600">
                <BookOpen className="h-4 w-4 mr-1" />
                <span>Disponibles</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Actions Rapides */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full mr-3"></div>
                  Actions Rapides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <div
                      key={index}
                      onClick={action.action}
                      className={`${action.color} p-6 rounded-xl text-white cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <action.icon className="h-8 w-8" />
                        <div className="text-2xl font-bold opacity-20">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold mb-2">{action.title}</h3>
                      <p className="text-sm opacity-90">{action.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activités Récentes */}
          <div>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full mr-3"></div>
                  Activités Récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`p-2 rounded-full bg-gray-100`}>
                        <activity.icon className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" className="w-full" onClick={() => navigate("/teacher/liste-notes")}>
                    Voir toutes les activités
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section d'aide */}
        <div className="mt-8">
          <Card className="shadow-lg bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Besoin d'aide ?</h3>
                  <p className="text-gray-600">
                    Consultez notre guide d'utilisation ou contactez l'administrateur pour toute question.
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                    Guide d'utilisation
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Contacter l'admin
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
}
