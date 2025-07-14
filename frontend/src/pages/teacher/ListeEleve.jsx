import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "sonner";
import { 
  Search, 
  Users, 
  GraduationCap, 
  UserCheck, 
  Loader2,
  Eye,
  BookOpen,
  Calendar,
  Filter,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import AdminLayout from "../admin/AdminLayout";

export default function ListeEleve() {
  const [eleves, setEleves] = useState([]);
  const [filteredEleves, setFilteredEleves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClasse, setSelectedClasse] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    parClasse: {},
    parNiveau: {}
  });

  useEffect(() => {
    const fetchEleves = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/eleves/enseignant", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Erreur lors du chargement des élèves");
        }
        const data = await res.json();
        const elevesData = data.eleves || [];
        setEleves(elevesData);
        setFilteredEleves(elevesData);
        
        // Calculer les statistiques
        const statsData = {
          total: elevesData.length,
          parClasse: {},
          parNiveau: {}
        };
        
        elevesData.forEach(eleve => {
          const classe = eleve.classe?.nomclass || "Non assigné";
          const niveau = eleve.classe?.niveau || "Non défini";
          
          statsData.parClasse[classe] = (statsData.parClasse[classe] || 0) + 1;
          statsData.parNiveau[niveau] = (statsData.parNiveau[niveau] || 0) + 1;
        });
        
        setStats(statsData);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEleves();
  }, []);

  // Filtrer les élèves
  useEffect(() => {
    let filtered = eleves;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(eleve =>
        eleve.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eleve.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eleve.classe?.nomclass?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par classe
    if (selectedClasse !== "all") {
      filtered = filtered.filter(eleve => 
        eleve.classe?.nomclass === selectedClasse
      );
    }

    setFilteredEleves(filtered);
  }, [eleves, searchTerm, selectedClasse]);

  const handleRefresh = () => {
    window.location.reload();
  };

  const getInitials = (nom, prenom) => {
    return `${nom?.charAt(0) || ''}${prenom?.charAt(0) || ''}`.toUpperCase();
  };

  const getRandomColor = (nom) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-yellow-500', 'bg-red-500', 'bg-teal-500'
    ];
    const index = nom?.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const classes = [...new Set(eleves.map(e => e.classe?.nomclass).filter(Boolean))];

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-lg font-semibold text-gray-700">Chargement des élèves...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        {/* En-tête */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Mes Élèves
                </h1>
                <p className="mt-2 text-gray-600">
                  Gérez et consultez la liste de vos élèves
                </p>
              </div>
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Actualiser</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="transform hover:scale-105 transition-all duration-300 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Élèves</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="transform hover:scale-105 transition-all duration-300 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Classes</p>
                    <p className="text-3xl font-bold text-gray-900">{classes.length}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <GraduationCap className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="transform hover:scale-105 transition-all duration-300 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Niveaux</p>
                    <p className="text-3xl font-bold text-gray-900">{Object.keys(stats.parNiveau).length}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <UserCheck className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Barre de recherche et filtres */}
          <Card className="shadow-lg mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Rechercher un élève..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={selectedClasse}
                    onChange={(e) => setSelectedClasse(e.target.value)}
                    className="border rounded-md px-3 py-2 bg-white"
                  >
                    <option value="all">Toutes les classes</option>
                    {classes.map(classe => (
                      <option key={classe} value={classe}>{classe}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Affichage des erreurs */}
          {error && (
            <Card className="shadow-lg mb-6 border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Erreur : {error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Liste des élèves */}
          {filteredEleves.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || selectedClasse !== "all" ? "Aucun élève trouvé" : "Aucun élève"}
                </h3>
                <p className="text-gray-500">
                  {searchTerm || selectedClasse !== "all" 
                    ? "Essayez de modifier vos critères de recherche" 
                    : "Aucun élève n'a été assigné à votre classe pour le moment"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEleves.map((eleve) => (
                <Card key={eleve._id} className="transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${getRandomColor(eleve.nom)}`}>
                        {getInitials(eleve.nom, eleve.prenom)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {eleve.nom} {eleve.prenom}
                        </h3>
                        <p className="text-sm text-gray-500">
                          ID: {eleve._id?.slice(-6)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <GraduationCap className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-600">Classe:</span>
                        <span className="font-medium text-gray-900">
                          {eleve.classe?.nomclass || "Non assigné"}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-sm">
                        <BookOpen className="h-4 w-4 text-green-500" />
                        <span className="text-gray-600">Niveau:</span>
                        <span className="font-medium text-gray-900">
                          {eleve.classe?.niveau || "Non défini"}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <span className="text-gray-600">Ajouté:</span>
                        <span className="font-medium text-gray-900">
                          {new Date(eleve.createdAt || Date.now()).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-center space-x-2"
                        onClick={() => {
                          // Action pour voir les détails de l'élève
                          toast.info(`Détails de ${eleve.nom} ${eleve.prenom}`);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        <span>Voir les détails</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Résumé des filtres */}
          {filteredEleves.length > 0 && (
            <div className="mt-8">
              <Card className="shadow-lg bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Résumé</h3>
                      <p className="text-gray-600">
                        Affichage de {filteredEleves.length} élève{filteredEleves.length > 1 ? 's' : ''} 
                        {searchTerm && ` correspondant à "${searchTerm}"`}
                        {selectedClasse !== "all" && ` de la classe "${selectedClasse}"`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total global</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
