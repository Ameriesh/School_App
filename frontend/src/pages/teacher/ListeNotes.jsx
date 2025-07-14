import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "sonner";
import { 
  Loader2, 
  FileText, 
  Download, 
  Search, 
  Filter, 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Award,
  Calendar,
  Users,
  RefreshCw,
  Eye,
  Printer,
  BookOpen,
  Target,
  Star
} from "lucide-react";
import AdminLayout from "../admin/AdminLayout";

export default function ListeNotes() {
  const [periodes, setPeriodes] = useState([]);
  const [selectedPeriode, setSelectedPeriode] = useState('');
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompetence, setSelectedCompetence] = useState('all');
  const [stats, setStats] = useState({
    totalNotes: 0,
    moyenneGenerale: 0,
    meilleurEleve: null,
    competences: [],
    moyennesParCompetence: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPeriodes = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch('http://localhost:5000/api/periodes', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        const data = await res.json();
        setPeriodes(data.periodes || []);
      } catch (error) {
        toast.error('Erreur lors du chargement des périodes');
      }
    };
    fetchPeriodes();
  }, []);

  const loadNotes = async () => {
    if (!selectedPeriode) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/notes/grouped?periodeId=${selectedPeriode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await res.json();
      const notesData = data.data || [];
      setNotes(notesData);
      setFilteredNotes(notesData);
      
      // Calculer les statistiques
      calculateStats(notesData);
    } catch (error) {
      toast.error('Erreur lors du chargement des notes');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (notesData) => {
    if (notesData.length === 0) {
      setStats({
        totalNotes: 0,
        moyenneGenerale: 0,
        meilleurEleve: null,
        competences: [],
        moyennesParCompetence: []
      });
      return;
    }

    // Calculer les statistiques
    const totalNotes = notesData.length;
    const toutesLesNotes = notesData.flatMap(group => 
      group.notes.map(note => note.note)
    );
    const moyenneGenerale = toutesLesNotes.length > 0 
      ? (toutesLesNotes.reduce((sum, note) => sum + note, 0) / toutesLesNotes.length).toFixed(2)
      : 0;

    // Trouver le meilleur élève
    const elevesScores = {};
    notesData.forEach(group => {
      const totalEleve = group.notes.reduce((sum, note) => sum + note.note, 0);
      const eleveKey = `${group.eleve.nom} ${group.eleve.prenom}`;
      if (!elevesScores[eleveKey] || totalEleve > elevesScores[eleveKey].score) {
        elevesScores[eleveKey] = {
          nom: eleveKey,
          score: totalEleve,
          maxScore: 30
        };
      }
    });

    const meilleurEleve = Object.values(elevesScores).reduce((best, current) => 
      current.score > best.score ? current : best
    );

    // Compétences uniques et moyennes par compétence
    const competences = [...new Set(notesData.map(group => group.competence.nom))];
    
    const moyennesParCompetence = competences.map(comp => {
      const notesComp = notesData.filter(group => group.competence.nom === comp);
      const totalComp = notesComp.reduce((sum, group) => {
        return sum + group.notes.reduce((sumNote, note) => sumNote + note.note, 0);
      }, 0);
      const moyenneComp = (totalComp / notesComp.length).toFixed(2);
      
      return {
        nom: comp,
        moyenne: parseFloat(moyenneComp),
        nombreEleves: notesComp.length
      };
    });

    setStats({
      totalNotes,
      moyenneGenerale: parseFloat(moyenneGenerale),
      meilleurEleve,
      competences,
      moyennesParCompetence
    });
  };

  // Filtrer les notes
  useEffect(() => {
    let filtered = notes;

    if (searchTerm) {
      filtered = filtered.filter(group =>
        group.eleve.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.eleve.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.competence.nom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCompetence !== 'all') {
      filtered = filtered.filter(group => 
        group.competence.nom === selectedCompetence
      );
    }

    setFilteredNotes(filtered);
  }, [notes, searchTerm, selectedCompetence]);

  const exportPDF = async () => {
    if (!selectedPeriode) {
      toast.warning('Veuillez sélectionner une période');
      return;
    }

    try {
      const token = localStorage.getItem("token");
      window.open(`http://localhost:5000/api/notes/export-pdf?periodeId=${selectedPeriode}`, '_blank');
      toast.success('Export PDF lancé');
    } catch (error) {
      toast.error('Erreur lors de l\'export PDF');
    }
  };

  const getPerformanceColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceIcon = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (percentage >= 60) return <BarChart3 className="h-4 w-4 text-yellow-600" />;
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const getCompetenceColor = (moyenne) => {
    if (moyenne >= 24) return 'text-green-600 bg-green-50';
    if (moyenne >= 18) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

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
                  Gestion des Notes
                </h1>
                <p className="mt-2 text-gray-600">
                  Consultez et exportez les notes de vos élèves par compétences
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => navigate("/teacher/add-notes")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Ajouter des Notes
                </Button>
                <Button
                  onClick={exportPDF}
                  variant="outline"
                  disabled={!selectedPeriode}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exporter PDF
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Sélecteur de période */}
          <Card className="shadow-lg mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="block mb-2 font-semibold text-gray-700">Période (UA)</label>
                  <select
                    value={selectedPeriode}
                    onChange={(e) => setSelectedPeriode(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading}
                  >
                    <option value="">-- Choisir une période --</option>
                    {periodes.map((periode) => (
                      <option key={periode._id} value={periode._id}>
                        UA{periode.ua} - {periode.mois} (Trimestre {periode.trimestre})
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  onClick={loadNotes}
                  disabled={isLoading || !selectedPeriode}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  <span className="ml-2">Charger</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques */}
          {notes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="transform hover:scale-105 transition-all duration-300 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Notes</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalNotes}</p>
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
                      <p className="text-sm font-medium text-gray-600">Moyenne Générale</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.moyenneGenerale}/30</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <BarChart3 className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="transform hover:scale-105 transition-all duration-300 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Meilleur Élève</p>
                      <p className="text-lg font-bold text-gray-900 truncate">
                        {stats.meilleurEleve?.nom || "N/A"}
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <Award className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                  {stats.meilleurEleve && (
                    <p className="text-sm text-gray-500 mt-1">
                      {stats.meilleurEleve.score}/{stats.meilleurEleve.maxScore}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="transform hover:scale-105 transition-all duration-300 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Compétences</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.competences.length}</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Target className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Moyennes par compétences */}
          {stats.moyennesParCompetence.length > 0 && (
            <Card className="shadow-lg mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Moyennes par Compétences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stats.moyennesParCompetence.map((comp, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${getCompetenceColor(comp.moyenne)}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-sm">{comp.nom}</h3>
                          <p className="text-lg font-bold">{comp.moyenne}/30</p>
                          <p className="text-xs opacity-75">{comp.nombreEleves} élève(s)</p>
                        </div>
                        <div className="text-2xl">
                          {comp.moyenne >= 24 ? <Star className="h-6 w-6 text-green-600" /> :
                           comp.moyenne >= 18 ? <BarChart3 className="h-6 w-6 text-yellow-600" /> :
                           <TrendingDown className="h-6 w-6 text-red-600" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filtres */}
          {notes.length > 0 && (
            <Card className="shadow-lg mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Rechercher un élève ou une compétence..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select
                      value={selectedCompetence}
                      onChange={(e) => setSelectedCompetence(e.target.value)}
                      className="border rounded-md px-3 py-2 bg-white"
                    >
                      <option value="all">Toutes les compétences</option>
                      {stats.competences.map(comp => (
                        <option key={comp} value={comp}>{comp}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tableau des notes */}
          {isLoading ? (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center">
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-lg font-semibold text-gray-700">Chargement des notes...</p>
              </CardContent>
            </Card>
          ) : notes.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {selectedPeriode ? 'Aucune note trouvée' : 'Sélectionnez une période'}
                </h3>
                <p className="text-gray-500">
                  {selectedPeriode 
                    ? 'Aucune note n\'a été saisie pour cette période' 
                    : 'Choisissez une période pour afficher les notes'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left p-4 font-semibold text-gray-700">Élève</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Compétence</th>
                        <th className="text-center p-4 font-semibold text-gray-700">Oral (/12)</th>
                        <th className="text-center p-4 font-semibold text-gray-700">Écrit (/15)</th>
                        <th className="text-center p-4 font-semibold text-gray-700">Savoir-être (/3)</th>
                        <th className="text-center p-4 font-semibold text-gray-700">Total (/30)</th>
                        <th className="text-center p-4 font-semibold text-gray-700">Performance</th>
                        <th className="text-center p-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredNotes.map((group) => {
                        const total = group.notes.reduce((sum, note) => sum + note.note, 0);
                        const maxTotal = 30;
                        return (
                          <tr key={`${group.eleve.id}-${group.competence.id}`} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                              <div className="font-semibold text-gray-900">
                                {group.eleve.nom} {group.eleve.prenom}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="text-gray-700">{group.competence.nom}</div>
                            </td>
                            {group.notes.map((note, idx) => (
                              <td key={idx} className="p-4 text-center">
                                <span className={`font-medium ${getPerformanceColor(note.note, note.max)}`}>
                                  {note.note}/{note.max}
                                </span>
                              </td>
                            ))}
                            <td className="p-4 text-center">
                              <span className={`font-bold text-lg ${getPerformanceColor(total, maxTotal)}`}>
                                {total}/30
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              {getPerformanceIcon(total, maxTotal)}
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex justify-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    toast.info(`Détails de ${group.eleve.nom} ${group.eleve.prenom}`);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    toast.info(`Impression des notes de ${group.eleve.nom} ${group.eleve.prenom}`);
                                  }}
                                >
                                  <Printer className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Résumé des filtres */}
                {filteredNotes.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>
                        Affichage de {filteredNotes.length} note{filteredNotes.length > 1 ? 's' : ''} 
                        {searchTerm && ` correspondant à "${searchTerm}"`}
                        {selectedCompetence !== "all" && ` pour la compétence "${selectedCompetence}"`}
                      </span>
                      <span>Total: {notes.length} notes</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}