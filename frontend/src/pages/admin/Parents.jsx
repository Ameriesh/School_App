import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Users, Search, Filter, Loader2, UserCheck } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

function Parents() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [parents, setParents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchParents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/parents", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) throw new Error("Erreur lors du chargement");
        const data = await response.json();
        setParents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erreur chargement parents:", err);
        toast.error("Erreur lors du chargement des parents");
        setParents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchParents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce parent ?")) return;
    
    try {
      setDeletingId(id);
      const response = await fetch(`http://localhost:5000/api/parents/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Échec de la suppression");

      setParents(prev => prev.filter(parent => parent._id !== id));
      toast.success("Parent supprimé avec succès");
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

  const filteredParents = parents.filter(parent =>
    parent.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#38bdf8] mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Chargement des parents...</p>
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
              Gestion des parents
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Gérez les parents et responsables légaux
            </p>
          </div>
          <Button
            onClick={() => navigate("/admin/parents/add")}
            className="flex items-center gap-2 bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Ajouter un parent</span>
            <span className="sm:hidden">Ajouter</span>
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-2xl border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total parents</p>
                  <p className="text-2xl font-bold text-blue-800">{parents.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-50 to-green-100 shadow-lg rounded-2xl border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Avec enfants</p>
                  <p className="text-2xl font-bold text-green-800">
                    {parents.filter(p => p.enfants?.length > 0).length}
                  </p>
                </div>
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 shadow-lg rounded-2xl border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Nouveaux ce mois</p>
                  <p className="text-2xl font-bold text-purple-800">+5</p>
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
                  placeholder="Rechercher un parent..."
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
                    <TableHead className="min-w-[150px] font-semibold text-[#0a2540]">Responsable</TableHead>
                    <TableHead className="min-w-[150px] font-semibold text-[#0a2540] hidden md:table-cell">Contact</TableHead>
                    <TableHead className="min-w-[200px] font-semibold text-[#0a2540] hidden lg:table-cell">Enfants</TableHead>
                    <TableHead className="w-[120px] text-right font-semibold text-[#0a2540]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="text-center">
                          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 font-medium">
                            {searchTerm ? "Aucun parent trouvé" : "Aucun parent enregistré"}
                          </p>
                          {!searchTerm && (
                            <p className="text-gray-400 text-sm mt-1">
                              Commencez par ajouter votre premier parent
                            </p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredParents.map((parent, idx) => (
                      <TableRow 
                        key={parent._id} 
                        className={`hover:bg-[#e0f2fe]/30 transition-all duration-200 group ${
                          idx % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"
                        }`}
                      >
                        <TableCell>
                          <Avatar className="h-10 w-10 group-hover:scale-110 transition-transform">
                            <AvatarImage 
                              src={parent.photo ? `http://localhost:5000/uploads/${parent.photo}` : undefined} 
                            />
                            <AvatarFallback className="bg-[#38bdf8]/20 text-[#0a2540] font-semibold">
                              {getInitials(parent.nom, parent.prenom)}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div>
                            <p className="text-[#0a2540] font-semibold">
                              {parent.prenom} {parent.nom}
                            </p>
                            <p className="text-sm text-gray-500">
                              {parent.email}
                            </p>
                            <p className="text-sm text-gray-500 md:hidden">
                              {parent.enfants?.length || 0} enfant(s)
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div>
                            <p className="text-[#0a2540]">{parent.telephone}</p>
                            <p className="text-sm text-gray-500">{parent.adresse}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {parent.enfants?.length > 0 ? (
                            <div className="space-y-1">
                              {parent.enfants.slice(0, 2).map((enf) => (
                                <div key={enf._id} className="text-sm text-gray-700">
                                  {enf.nom} {enf.prenom} ({enf.classe?.nomclass || "Classe inconnue"})
                                </div>
                              ))}
                              {parent.enfants.length > 2 && (
                                <div className="text-xs text-gray-500">
                                  +{parent.enfants.length - 2} autre(s)
                                </div>
                              )}
                            </div>
                          ) : (
                            <em className="text-gray-400">Aucun enfant</em>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-[#0a2540] hover:bg-[#e0f2fe] border-[#38bdf8] hover:border-[#0ea5e9] transition-all duration-200"
                              onClick={() => navigate(`/admin/parents/edit/${parent._id}`)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={deletingId === parent._id}
                              onClick={() => handleDelete(parent._id)}
                              className="hover:bg-red-700 transition-all duration-200"
                            >
                              {deletingId === parent._id ? (
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

export default Parents;
