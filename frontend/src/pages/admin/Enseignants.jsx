import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Plus, Edit, Trash2, Loader2, Users, Search, Filter } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { useNavigate } from "react-router-dom";
import { auth } from "@/services/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

function Enseignants() {
  const navigate = useNavigate();
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error("Utilisateur non authentifié");

        const response = await fetch("http://localhost:5000/api/teachers", {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache"
          }
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        setEnseignants(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Erreur lors du chargement des enseignants");
        setEnseignants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet enseignant ?")) return;
    
    try {
      setDeletingId(id);
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(`http://localhost:5000/api/teachers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Échec de la suppression");

      setEnseignants(prev => prev.filter(ens => ens._id !== id));
      toast.success("Enseignant supprimé avec succès");
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  const getInitials = (nom, prenom) => {
    return `${nom?.[0] || ''}${prenom?.[0] || ''}`.toUpperCase();
  };

  const filteredEnseignants = enseignants.filter(enseignant =>
    enseignant.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enseignant.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enseignant.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#38bdf8] mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Chargement des enseignants...</p>
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
              <Users className="w-6 h-6 text-[#38bdf8]" />
              Gestion des enseignants
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Gérez les enseignants de votre établissement
            </p>
          </div>
          <Button
            onClick={() => navigate("/admin/enseignants/ajouter")}
            className="flex items-center gap-2 bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Ajouter un enseignant</span>
            <span className="sm:hidden">Ajouter</span>
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-2xl border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total enseignants</p>
                  <p className="text-2xl font-bold text-blue-800">{enseignants.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-50 to-green-100 shadow-lg rounded-2xl border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Actifs</p>
                  <p className="text-2xl font-bold text-green-800">{enseignants.length}</p>
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 shadow-lg rounded-2xl border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Nouveaux ce mois</p>
                  <p className="text-2xl font-bold text-purple-800">+3</p>
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
                  placeholder="Rechercher un enseignant..."
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
                    <TableHead className="w-[80px] font-semibold text-[#0a2540]">Photo</TableHead>
                    <TableHead className="min-w-[150px] font-semibold text-[#0a2540]">Nom complet</TableHead>
                    <TableHead className="min-w-[120px] font-semibold text-[#0a2540] hidden md:table-cell">Téléphone</TableHead>
                    <TableHead className="min-w-[200px] font-semibold text-[#0a2540] hidden lg:table-cell">Email</TableHead>
                    <TableHead className="w-[120px] text-right font-semibold text-[#0a2540]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEnseignants.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="text-center">
                          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 font-medium">
                            {searchTerm ? "Aucun enseignant trouvé" : "Aucun enseignant enregistré"}
                          </p>
                          {!searchTerm && (
                            <p className="text-gray-400 text-sm mt-1">
                              Commencez par ajouter votre premier enseignant
                            </p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEnseignants.map((enseignant) => (
                      <TableRow 
                        key={enseignant._id} 
                        className="hover:bg-[#e0f2fe]/30 transition-all duration-200 group"
                      >
                        <TableCell>
                          <Avatar className="h-10 w-10 group-hover:scale-110 transition-transform">
                            <AvatarImage 
                              src={enseignant.photo ? `http://localhost:5000/uploads/${enseignant.photo}` : undefined} 
                            />
                            <AvatarFallback className="bg-[#38bdf8]/20 text-[#0a2540] font-semibold">
                              {getInitials(enseignant.nom, enseignant.prenom)}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div>
                            <p className="text-[#0a2540] font-semibold">
                              {enseignant.prenom} {enseignant.nom}
                            </p>
                            <p className="text-sm text-gray-500 md:hidden">
                              {enseignant.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{enseignant.telephone || "-"}</TableCell>
                        <TableCell className="hidden lg:table-cell truncate max-w-[200px]">
                          {enseignant.email}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-[#0a2540] hover:bg-[#e0f2fe] border-[#38bdf8] hover:border-[#0ea5e9] transition-all duration-200"
                              onClick={() => navigate(`/admin/enseignants/modifier/${enseignant._id}`)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={deletingId === enseignant._id}
                              onClick={() => handleDelete(enseignant._id)}
                              className="hover:bg-red-700 transition-all duration-200"
                            >
                              {deletingId === enseignant._id ? (
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

export default Enseignants;