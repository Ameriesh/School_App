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
import { Plus, Edit, Trash2 } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { useNavigate } from "react-router-dom";

function Eleves() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [eleves, setEleves] = useState([]);

  const fetchEleves = () => {
    fetch("http://localhost:5000/api/eleves")
      .then((res) => res.json())
      .then((data) => {
        setEleves(data.eleves || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement élèves:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEleves();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet élève ?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/eleves/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        alert(data.message);
        fetchEleves();
      } catch (error) {
        console.error("Erreur suppression:", error);
        alert("Échec de la suppression");
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <p>Chargement...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Card className="w-full max-w-7xl mx-auto mb-6 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold text-[#38bdf8]">Liste des élèves</CardTitle>
        </CardHeader>
      </Card>
      <div className="flex flex-col md:flex-row justify-end items-center gap-4 mb-6 max-w-7xl mx-auto">
        <Button onClick={() => navigate("/admin/eleves/add")}
          className="flex items-center gap-2 bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-bold rounded-lg shadow">
          <Plus className="h-4 w-4" /> Ajouter un élève
        </Button>
      </div>
      <Card className="max-w-7xl mx-auto shadow-lg rounded-2xl">
        <CardContent className="overflow-x-auto p-0">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow className="bg-[#38bdf8]/20">
                <TableHead className="text-[#0a2540] font-bold">Photo</TableHead>
                <TableHead className="text-[#0a2540] font-bold">Noms</TableHead>
                <TableHead className="text-[#0a2540] font-bold">Prénoms</TableHead>
                <TableHead className="text-[#0a2540] font-bold">Date de naissance</TableHead>
                <TableHead className="text-[#0a2540] font-bold">Classe</TableHead>
                <TableHead className="text-[#0a2540] font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eleves.map((eleve, idx) => (
                <TableRow key={eleve._id} className={idx % 2 === 0 ? "bg-white" : "bg-[#f1f5f9] hover:bg-[#e0f2fe] transition"}>
                  <TableCell>
                    <img
                      src={
                        eleve.photo
                          ? `http://localhost:5000/uploads/${eleve.photo}`
                          : "https://via.placeholder.com/40"
                      }
                      alt="élève"
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                  </TableCell>
                  <TableCell className="font-semibold">{eleve.nom}</TableCell>
                  <TableCell>{eleve.prenom}</TableCell>
                  <TableCell>
                    {new Date(eleve.dateNaissance).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{eleve.classe?.nomclass || "Non assignée"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/admin/eleves/edit/${eleve._id}`)}
                        className="flex items-center gap-1 border-[#38bdf8] text-[#0a2540] hover:bg-[#e0f2fe] font-bold rounded-lg"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(eleve._id)}
                        className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg"
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

export default Eleves;
