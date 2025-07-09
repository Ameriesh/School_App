import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
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

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        console.log(token)
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
       toast.error("Message d'erreur");
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
      toast.success("Message de succès");
    } catch (error) {
      console.error("Erreur:", error);
     toast.error("Message d'erreur");
    } finally {
      setDeletingId(null);
    }
  };

  const getInitials = (nom, prenom) => {
    return `${nom?.[0] || ''}${prenom?.[0] || ''}`.toUpperCase();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#38bdf8]" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mb-6 shadow-lg rounded-2xl">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-2xl font-extrabold text-[#38bdf8]">
              Liste des enseignants
            </CardTitle>
            <Button
              onClick={() => navigate("/admin/enseignants/ajouter")}
              className="flex items-center gap-2 bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-bold rounded-lg shadow"
            >
              <Plus className="h-4 w-4" />
              Ajouter un enseignant
            </Button>
          </CardHeader>
        </Card>

        <Card className="shadow-lg rounded-2xl">
          <CardContent className="p-0 overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-[#38bdf8]/20">
                  <TableHead className="w-[80px]">Photo</TableHead>
                  <TableHead className="min-w-[150px]">Nom complet</TableHead>
                  <TableHead className="min-w-[120px]">Téléphone</TableHead>
                  <TableHead className="min-w-[200px]">Email</TableHead>
                  <TableHead className="w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enseignants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      {loading ? "Chargement..." : "Aucun enseignant trouvé"}
                    </TableCell>
                  </TableRow>
                ) : (
                  enseignants.map((enseignant) => (
                    <TableRow 
                      key={enseignant._id} 
                      className="hover:bg-[#e0f2fe]/50 transition-colors"
                    >
                      <TableCell>
                        <Avatar className="h-10 w-10">
                          <AvatarImage 
                            src={enseignant.photo ? `http://localhost:5000/uploads/${enseignant.photo}` : undefined} 
                          />
                          <AvatarFallback className="bg-[#38bdf8]/20 text-[#0a2540]">
                            {getInitials(enseignant.nom, enseignant.prenom)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {enseignant.prenom} {enseignant.nom}
                      </TableCell>
                      <TableCell>{enseignant.telephone || "-"}</TableCell>
                      <TableCell className="truncate max-w-[200px]">
                        {enseignant.email}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-[#0a2540] hover:bg-[#e0f2fe] border-[#38bdf8]"
                            onClick={() => navigate(`/admin/enseignants/modifier/${enseignant._id}`)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={deletingId === enseignant._id}
                            onClick={() => handleDelete(enseignant._id)}
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
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default Enseignants;