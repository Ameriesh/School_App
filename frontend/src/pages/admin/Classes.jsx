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
import { Plus, Edit, Trash2, BookOpen, Search, Filter, Loader2, Users, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { toast } from "sonner";

function Classes() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/classes");
        if (!response.ok) throw new Error("Erreur lors du chargement");
        const data = await response.json();
        setClasses(data.classes || []);
      } catch (err) {
        console.error("Erreur récupération classes:", err);
        toast.error("Erreur lors du chargement des classes");
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette classe ?")) return;
    
    try {
      setDeletingId(id);
      const response = await fetch(`http://localhost:5000/api/classes/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Échec de la suppression");

      setClasses(prev => prev.filter(classe => classe._id !== id));
      toast.success("Classe supprimée avec succès");
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredClasses = classes.filter(classe =>
    classe.nomclass?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classe.niveau?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classe.enseignant?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classe.enseignant?.prenom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudents = classes.reduce((sum, classe) => sum + (classe.effectif || 0), 0);
  const averageCapacity = classes.length > 0 ? Math.round(classes.reduce((sum, classe) => sum + (classe.capacite || 0), 0) / classes.length) : 0;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#38bdf8] mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Chargement des classes...</p>
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
              <BookOpen className="w-6 h-6 text-[#38bdf8]" />
              Gestion des classes
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Gérez les classes et leurs effectifs
            </p>
          </div>
          <Button
            onClick={() => navigate("/admin/classes/add")}
            className="flex items-center gap-2 bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Ajouter une classe</span>
            <span className="sm:hidden">Ajouter</span>
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-2xl border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total classes</p>
                  <p className="text-2xl font-bold text-blue-800">{classes.length}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-50 to-green-100 shadow-lg rounded-2xl border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Total élèves</p>
                  <p className="text-2xl font-bold text-green-800">{totalStudents}</p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 shadow-lg rounded-2xl border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Capacité moyenne</p>
                  <p className="text-2xl font-bold text-purple-800">{averageCapacity}</p>
                </div>
                <GraduationCap className="w-8 h-8 text-purple-600" />
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
                  placeholder="Rechercher une classe..."
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
                    <TableHead className="min-w-[150px] font-semibold text-[#0a2540]">Nom de la classe</TableHead>
                    <TableHead className="min-w-[100px] font-semibold text-[#0a2540] hidden md:table-cell">Capacité</TableHead>
                    <TableHead className="min-w-[100px] font-semibold text-[#0a2540]">Niveau</TableHead>
                    <TableHead className="min-w-[100px] font-semibold text-[#0a2540]">Effectif</TableHead>
                    <TableHead className="min-w-[150px] font-semibold text-[#0a2540] hidden lg:table-cell">Enseignant</TableHead>
                    <TableHead className="w-[120px] text-right font-semibold text-[#0a2540]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClasses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="text-center">
                          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 font-medium">
                            {searchTerm ? "Aucune classe trouvée" : "Aucune classe enregistrée"}
                          </p>
                          {!searchTerm && (
                            <p className="text-gray-400 text-sm mt-1">
                              Commencez par ajouter votre première classe
                            </p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClasses.map((classe, idx) => (
                      <TableRow 
                        key={classe._id} 
                        className={`hover:bg-[#e0f2fe]/30 transition-all duration-200 group ${
                          idx % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"
                        }`}
                      >
                        <TableCell className="font-medium">
                          <div>
                            <p className="text-[#0a2540] font-semibold">
                              {classe.nomclass}
                            </p>
                            <p className="text-sm text-gray-500 md:hidden">
                              {classe.effectif || 0} / {classe.capacite} élèves
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="font-medium text-[#0a2540]">{classe.capacite}</span>
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-[#38bdf8]/10 text-[#0a2540] rounded-full text-sm font-medium">
                            {classe.niveau}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#0a2540]">{classe.effectif || 0}</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-[#38bdf8] h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${classe.capacite ? Math.min((classe.effectif || 0) / classe.capacite * 100, 100) : 0}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {classe.enseignant ? (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-[#38bdf8]/20 rounded-full flex items-center justify-center">
                                <Users className="w-3 h-3 text-[#38bdf8]" />
                              </div>
                              <span className="text-[#0a2540]">
                                {classe.enseignant.prenom} {classe.enseignant.nom}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-[#0a2540] hover:bg-[#e0f2fe] border-[#38bdf8] hover:border-[#0ea5e9] transition-all duration-200"
                              onClick={() => navigate(`/admin/classes/edit/${classe._id}`)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={deletingId === classe._id}
                              onClick={() => handleDelete(classe._id)}
                              className="hover:bg-red-700 transition-all duration-200"
                            >
                              {deletingId === classe._id ? (
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

export default Classes;
