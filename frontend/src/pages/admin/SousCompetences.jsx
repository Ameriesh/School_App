import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Target, Search, Filter, Loader2, Layers, Star, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { toast } from "sonner";

export default function SousCompetences() {
  const navigate = useNavigate();
  const [groupedData, setGroupedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [sousCompetences, setSousCompetences] = useState([]);

  useEffect(() => {
    const fetchSousCompetences = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/souscompetences");
        if (!response.ok) throw new Error("Erreur lors du chargement");
        const data = await response.json();
        const sousCompetences = data.sousCompetences || [];
        setSousCompetences(sousCompetences);

        // Groupement par compétence
        const group = {};
        sousCompetences.forEach((sc) => {
          const comp = sc.competence?.nom || "Inconnue";
          if (!group[comp]) {
            group[comp] = [];
          }
          group[comp].push({ 
            id: sc._id,
            nom: sc.nom, 
            bareme: sc.bareme,
            competence: sc.competence
          });
        });

        const result = Object.entries(group).map(([competenceNom, sousCompetences]) => ({
          competenceNom,
          sousCompetences,
        }));

        setGroupedData(result);
      } catch (err) {
        console.error("Erreur récupération sous-compétences:", err);
        toast.error("Erreur lors du chargement des sous-compétences");
        setGroupedData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSousCompetences();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette sous-compétence ?")) return;
    
    try {
      setDeletingId(id);
      const response = await fetch(`http://localhost:5000/api/souscompetences/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Échec de la suppression");

      setSousCompetences(prev => prev.filter(sc => sc._id !== id));
      toast.success("Sous-compétence supprimée avec succès");
      
      // Recharger les données groupées
      window.location.reload();
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredGroupedData = groupedData.filter(group =>
    group.competenceNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.sousCompetences.some(sc => 
      sc.nom.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalSousCompetences = sousCompetences.length;
  const totalCompetences = groupedData.length;
  const averageBareme = sousCompetences.length > 0 ? 
    Math.round(sousCompetences.reduce((sum, sc) => sum + (sc.bareme || 0), 0) / sousCompetences.length) : 0;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#38bdf8] mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Chargement des sous-compétences...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-2 flex items-center gap-2">
              <Target className="w-6 h-6 text-[#38bdf8]" />
              Gestion des sous-compétences
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Gérez les sous-compétences par compétence
            </p>
          </div>
          <Button
            onClick={() => navigate("/admin/sous-competences/add")}
            className="flex items-center gap-2 bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Ajouter une sous-compétence</span>
            <span className="sm:hidden">Ajouter</span>
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-2xl border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total sous-compétences</p>
                  <p className="text-2xl font-bold text-blue-800">{totalSousCompetences}</p>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-50 to-green-100 shadow-lg rounded-2xl border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Compétences</p>
                  <p className="text-2xl font-bold text-green-800">{totalCompetences}</p>
                </div>
                <Layers className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 shadow-lg rounded-2xl border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Barème moyen</p>
                  <p className="text-2xl font-bold text-purple-800">{averageBareme}/20</p>
                </div>
                <Star className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barre de recherche */}
        <Card className="bg-white shadow-lg rounded-2xl border-0">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher une sous-compétence..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filtrer</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tableau */}
        <Card className="bg-white shadow-lg rounded-2xl border-0 overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-[#38bdf8]/10">
                    <TableHead className="min-w-[200px] font-semibold text-[#0a2540]">Compétence</TableHead>
                    <TableHead className="min-w-[300px] font-semibold text-[#0a2540]">Sous-compétences</TableHead>
                    <TableHead className="min-w-[150px] font-semibold text-[#0a2540]">Barèmes</TableHead>
                    <TableHead className="w-[120px] text-right font-semibold text-[#0a2540]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGroupedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12">
                        <div className="text-center">
                          <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 font-medium">
                            {searchTerm ? "Aucune sous-compétence trouvée" : "Aucune sous-compétence enregistrée"}
                          </p>
                          {!searchTerm && (
                            <p className="text-gray-400 text-sm mt-1">
                              Commencez par ajouter votre première sous-compétence
                            </p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredGroupedData.map((row, idx) => (
                      <TableRow 
                        key={idx} 
                        className={`hover:bg-[#e0f2fe]/30 transition-all duration-200 group ${
                          idx % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"
                        }`}
                      >
                        <TableCell className="font-medium">
                          <div>
                            <p className="text-[#0a2540] font-semibold">
                              {row.competenceNom}
                            </p>
                            <p className="text-sm text-gray-500 md:hidden">
                              {row.sousCompetences.length} sous-compétence(s)
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            {row.sousCompetences.map((sc, scIdx) => (
                              <div key={scIdx} className="flex items-center justify-between">
                                <span className="text-[#0a2540] text-sm">{sc.nom}</span>
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-1 bg-[#38bdf8]/10 text-[#0a2540] rounded-full text-xs font-medium">
                                    {sc.bareme}/20
                                  </span>
                                  <div className="hidden lg:flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-6 w-6 p-0 text-[#0a2540] hover:bg-[#e0f2fe] border-[#38bdf8] hover:border-[#0ea5e9] transition-all duration-200"
                                      onClick={() => navigate(`/admin/sous-competences/edit/${sc.id}`)}
                                    >
                                      <Edit size={12} />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      disabled={deletingId === sc.id}
                                      onClick={() => handleDelete(sc.id)}
                                      className="h-6 w-6 p-0 hover:bg-red-700 transition-all duration-200"
                                    >
                                      {deletingId === sc.id ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                      ) : (
                                        <Trash2 size={12} />
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="space-y-1">
                            {row.sousCompetences.map((sc, scIdx) => (
                              <span key={scIdx} className="px-2 py-1 bg-[#38bdf8]/10 text-[#0a2540] rounded-full text-sm font-medium block">
                                {sc.bareme}/20
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2 lg:hidden">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-[#0a2540] hover:bg-[#e0f2fe] border-[#38bdf8] hover:border-[#0ea5e9] transition-all duration-200"
                              onClick={() => navigate(`/admin/sous-competences/edit/${row.sousCompetences[0]?.id}`)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={deletingId === row.sousCompetences[0]?.id}
                              onClick={() => handleDelete(row.sousCompetences[0]?.id)}
                              className="hover:bg-red-700 transition-all duration-200"
                            >
                              {deletingId === row.sousCompetences[0]?.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
