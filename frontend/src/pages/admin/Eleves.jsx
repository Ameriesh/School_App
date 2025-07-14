import React, { useState, useEffect } from "react";
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
import { Plus, Edit, Trash2, School, Search, Filter, Loader2, Users, Calendar, BookOpen } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

function Eleves() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [eleves, setEleves] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchEleves = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/eleves");
      if (!response.ok) throw new Error("Erreur lors du chargement");
      const data = await response.json();
      setEleves(data.eleves || []);
    } catch (err) {
      console.error("Erreur chargement élèves:", err);
      toast.error("Erreur lors du chargement des élèves");
      setEleves([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEleves();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet élève ?")) return;
    
    try {
      setDeletingId(id);
      const res = await fetch(`http://localhost:5000/api/eleves/${id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) throw new Error("Échec de la suppression");
      
      const data = await res.json();
      toast.success(data.message || "Élève supprimé avec succès");
      setEleves(prev => prev.filter(eleve => eleve._id !== id));
    } catch (error) {
      console.error("Erreur suppression:", error);
      toast.error("Échec de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  const getInitials = (nom, prenom) => {
    return `${nom?.[0] || ''}${prenom?.[0] || ''}`.toUpperCase();
  };

  const filteredEleves = eleves.filter(eleve =>
    eleve.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eleve.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eleve.classe?.nomclass?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEleves = eleves.length;
  const elevesWithClass = eleves.filter(eleve => eleve.classe).length;
  const averageAge = eleves.length > 0 ? 
    Math.round(eleves.reduce((sum, eleve) => {
      const age = new Date().getFullYear() - new Date(eleve.dateNaissance).getFullYear();
      return sum + age;
    }, 0) / eleves.length) : 0;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#38bdf8] mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Chargement des élèves...</p>
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
              <School className="w-6 h-6 text-[#38bdf8]" />
              Gestion des élèves
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Gérez les élèves de votre établissement
            </p>
          </div>
          <Button
            onClick={() => navigate("/admin/eleves/add")}
            className="flex items-center gap-2 bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Ajouter un élève</span>
            <span className="sm:hidden">Ajouter</span>
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-2xl border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total élèves</p>
                  <p className="text-2xl font-bold text-blue-800">{totalEleves}</p>
                </div>
                <School className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-50 to-green-100 shadow-lg rounded-2xl border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Avec classe</p>
                  <p className="text-2xl font-bold text-green-800">{elevesWithClass}</p>
                </div>
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 shadow-lg rounded-2xl border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Âge moyen</p>
                  <p className="text-2xl font-bold text-purple-800">{averageAge} ans</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
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
                  placeholder="Rechercher un élève..."
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
                    <TableHead className="min-w-[120px] font-semibold text-[#0a2540] hidden md:table-cell">Date de naissance</TableHead>
                    <TableHead className="min-w-[120px] font-semibold text-[#0a2540]">Classe</TableHead>
                    <TableHead className="w-[120px] text-right font-semibold text-[#0a2540]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEleves.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="text-center">
                          <School className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 font-medium">
                            {searchTerm ? "Aucun élève trouvé" : "Aucun élève enregistré"}
                          </p>
                          {!searchTerm && (
                            <p className="text-gray-400 text-sm mt-1">
                              Commencez par ajouter votre premier élève
                            </p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEleves.map((eleve, idx) => (
                      <TableRow 
                        key={eleve._id} 
                        className={`hover:bg-[#e0f2fe]/30 transition-all duration-200 group ${
                          idx % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"
                        }`}
                      >
                        <TableCell>
                          <Avatar className="h-10 w-10 group-hover:scale-110 transition-transform">
                            <AvatarImage 
                              src={eleve.photo ? `http://localhost:5000/uploads/${eleve.photo}` : undefined} 
                            />
                            <AvatarFallback className="bg-[#38bdf8]/20 text-[#0a2540] font-semibold">
                              {getInitials(eleve.nom, eleve.prenom)}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div>
                            <p className="text-[#0a2540] font-semibold">
                              {eleve.prenom} {eleve.nom}
                            </p>
                            <p className="text-sm text-gray-500 md:hidden">
                              {new Date(eleve.dateNaissance).toLocaleDateString()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-[#0a2540]">
                            {new Date(eleve.dateNaissance).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          {eleve.classe ? (
                            <span className="px-2 py-1 bg-[#38bdf8]/10 text-[#0a2540] rounded-full text-sm font-medium">
                              {eleve.classe.nomclass}
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-sm font-medium">
                              Non assignée
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-[#0a2540] hover:bg-[#e0f2fe] border-[#38bdf8] hover:border-[#0ea5e9] transition-all duration-200"
                              onClick={() => navigate(`/admin/eleves/edit/${eleve._id}`)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={deletingId === eleve._id}
                              onClick={() => handleDelete(eleve._id)}
                              className="hover:bg-red-700 transition-all duration-200"
                            >
                              {deletingId === eleve._id ? (
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

export default Eleves;
