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
import { Plus, Edit, Trash2 } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { useNavigate } from "react-router-dom";

function Eleves() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [eleves, setEleves] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/eleves")  // adapte si besoin
      .then((res) => res.json())
      .then((data) => {
        setEleves(data.eleves || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement élèves:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <p>Chargement...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6 w-full max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Liste des élèves</h1>
      </div>

      <div className="flex flex-col md:flex-row justify-start items-start gap-4 mb-6 max-w-7xl mx-auto">
        <Button
          onClick={() => navigate("/admin/eleves/add")}
          className="flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un élève
        </Button>

        <Button
          variant="outline"
          onClick={() => alert("Fonction de téléchargement à venir")}
          className="flex items-center"
        >
          Télécharger la liste
        </Button>
      </div>

      <div className="max-w-7xl mx-auto overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Noms</TableHead>
              <TableHead>Prénoms</TableHead>
              <TableHead>Date de naissance</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Classe</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eleves.map((eleve) => (
              <TableRow key={eleve._id}>
                <TableCell>
                  <img
                    src={eleve.photo || "https://via.placeholder.com/40"}
                    alt="élève"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </TableCell>
                <TableCell>{eleve.nom}</TableCell>
                <TableCell>{eleve.prenom}</TableCell>
                <TableCell>{new Date(eleve.dateNaissance).toLocaleDateString()}</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>{eleve.classe?.nomclass || "Non assignée"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      title="Modifier"
                      onClick={() => navigate(`/admin/eleves/edit/${eleve._id}`)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      title="Supprimer"
                      onClick={() => alert("Fonction suppression à implémenter")}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}

export default Eleves;
