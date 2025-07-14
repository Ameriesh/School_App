import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2, Target, Search, Filter, Loader2, BookOpen, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { toast } from "sonner";

function Competences() {
  const navigate = useNavigate();
  const [competences, setCompetences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchCompetences = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/competences");
        if (!response.ok) throw new Error("Erreur lors du chargement");
        const data = await response.json();
        setCompetences(data.competences || []);
      } catch (err) {
        console.error("Erreur récupération des compétences:", err);
        toast.error("Erreur lors du chargement des compétences");
        setCompetences([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetences();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette compétence ?")) return;
    
    try {
      setDeletingId(id);
      const response = await fetch(`http://localhost:5000/api/competences/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Échec de la suppression");

      setCompetences(prev => prev.filter(comp => comp._id !== id));
      toast.success("Compétence supprimée avec succès");
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCompetences = competences.filter(competence =>
    competence.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    competence.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    competence.groupe?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCompetences = competences.length;
  const uniqueGroupes = [...new Set(competences.map(c => c.groupe))].length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#38bdf8] mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Chargement des compétences...</p>
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
              Gestion des compétences
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Gérez les compétences pédagogiques
            </p>
          </div>
          <Button
            onClick={() => navigate("/admin/competences/add")}
            className="flex items-center gap-2 bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Ajouter une compétence</span>
            <span className="sm:hidden">Ajouter</span>
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-2xl border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total compétences</p>
                  <p className="text-2xl font-bold text-blue-800">{totalCompetences}</p>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-50 to-green-100 shadow-lg rounded-2xl border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Groupes</p>
                  <p className="text-2xl font-bold text-green-800">{uniqueGroupes}</p>
                </div>
                <Layers className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 shadow-lg rounded-2xl border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Nouveaux ce mois</p>
                  <p className="text-2xl font-bold text-purple-800">+2</p>
                </div>
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
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
                  placeholder="Rechercher une compétence..."
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
                    <TableHead className="min-w-[200px] font-semibold text-[#0a2540]">Nom de la compétence</TableHead>
                    <TableHead className="min-w-[100px] font-semibold text-[#0a2540]">Code</TableHead>
                    <TableHead className="min-w-[150px] font-semibold text-[#0a2540]">Groupe</TableHead>
                    <TableHead className="w-[120px] text-right font-semibold text-[#0a2540]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompetences.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12">
                        <div className="text-center">
                          <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 font-medium">
                            {searchTerm ? "Aucune compétence trouvée" : "Aucune compétence enregistrée"}
                          </p>
                          {!searchTerm && (
                            <p className="text-gray-400 text-sm mt-1">
                              Commencez par ajouter votre première compétence
                            </p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCompetences.map((competence, idx) => (
                      <TableRow 
                        key={competence._id} 
                        className={`hover:bg-[#e0f2fe]/30 transition-all duration-200 group ${
                          idx % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"
                        }`}
                      >
                        <TableCell className="font-medium">
                          <div>
                            <p className="text-[#0a2540] font-semibold">
                              {competence.nom}
                            </p>
                            <p className="text-sm text-gray-500 md:hidden">
                              Code: {competence.code}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-[#38bdf8]/10 text-[#0a2540] rounded-full text-sm font-medium">
                            {competence.code}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            {competence.groupe}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-[#0a2540] hover:bg-[#e0f2fe] border-[#38bdf8] hover:border-[#0ea5e9] transition-all duration-200"
                              onClick={() => navigate(`/admin/competences/edit/${competence._id}`)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={deletingId === competence._id}
                              onClick={() => handleDelete(competence._id)}
                              className="hover:bg-red-700 transition-all duration-200"
                            >
                              {deletingId === competence._id ? (
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

export default Competences;
