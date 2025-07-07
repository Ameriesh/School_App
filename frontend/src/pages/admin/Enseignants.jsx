import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { useNavigate } from "react-router-dom";

function Enseignants() {
  const navigate = useNavigate();
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEnseignants() {
      try {
        const res = await fetch("http://localhost:5000/api/teachers");
        if (!res.ok) throw new Error("Erreur lors du chargement");
        const data = await res.json();
        setEnseignants(data || []);; // adapte selon la forme de ta réponse
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchEnseignants();
  }, []);

  if (loading) return <AdminLayout><p>Chargement...</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <Card className="p-6 flex-grow max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800">Liste des enseignants</h1>
        </Card>
        <Button
          onClick={() => navigate("/admin/enseignants/ajouter")}
          className="flex items-center whitespace-nowrap"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un enseignant
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Noms</TableHead>
                <TableHead>Prénoms</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enseignants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
                    Aucun enseignant trouvé.
                  </TableCell>
                </TableRow>
              )}

              {enseignants.map((enseignant) => (
                <TableRow key={enseignant._id || enseignant.id}>
                  <TableCell>
                    <img
                      src={enseignant.photo ? `http://localhost:5000/uploads/${enseignant.photo}` : "https://via.placeholder.com/40"}
                      alt={`${enseignant.nom} ${enseignant.prenom}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell>{enseignant.nom}</TableCell>
                  <TableCell>{enseignant.prenom}</TableCell>
                  <TableCell>{enseignant.telephone}</TableCell>
                  <TableCell>{enseignant.email}</TableCell>
                  <TableCell>{enseignant.classe}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        title="Modifier"
                        onClick={() => navigate(`/admin/enseignants/modifier/${enseignant._id || enseignant.id}`)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        title="Supprimer"
                        onClick={() => alert(`Supprimer enseignant ${enseignant.nom} ${enseignant.prenom} ?`)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

export default Enseignants;
