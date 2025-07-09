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
import { Plus, Edit, Trash2 } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { useNavigate } from "react-router-dom";

function Parents() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [parents, setParents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/parents")
      .then(res => res.json())
      .then(data => {
        setParents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur chargement parents:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <AdminLayout><p>Chargement...</p></AdminLayout>;

  return (
    <AdminLayout>
      <Card className="mb-6 w-full max-w-6xl mx-auto shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold text-[#38bdf8]">Liste des Parents</CardTitle>
        </CardHeader>
      </Card>
      <div className="flex flex-col md:flex-row justify-end items-center gap-4 mb-6 max-w-6xl mx-auto">
        <Button onClick={() => navigate("/admin/parents/add")} className="flex items-center gap-2 bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-bold rounded-lg shadow">
          <Plus className="mr-2 h-4 w-4" /> Ajouter un Parent d'élève
        </Button>
      </div>
      <Card className="max-w-6xl mx-auto shadow-lg rounded-2xl">
        <CardContent className="p-0 overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow className="bg-[#38bdf8]/20">
                <TableHead className="text-[#0a2540] font-bold">Photo</TableHead>
                <TableHead className="text-[#0a2540] font-bold">Nom du Responsable légal 1</TableHead>
                <TableHead className="text-[#0a2540] font-bold">Nom du Responsable légal 2</TableHead>
                <TableHead className="text-[#0a2540] font-bold">Enfants (classe)</TableHead>
                <TableHead className="text-[#0a2540] font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parents.map((parent, idx) => (
                <TableRow key={parent._id} className={idx % 2 === 0 ? "bg-white" : "bg-[#f1f5f9] hover:bg-[#e0f2fe] transition"}>
                  <TableCell>
                    <img
                      src={
                        parent.photo1
                          ? `http://localhost:5000/uploads/${parent.photo1}`
                          : "https://via.placeholder.com/40"
                      }
                      alt="parent"
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                  </TableCell>
                  <TableCell className="font-semibold">{parent.nom1} {parent.prenom1}</TableCell>
                  <TableCell>{parent.nom2} {parent.prenom2}</TableCell>
                  <TableCell>
                    {parent.enfants?.length > 0
                      ? parent.enfants.map((enf) => (
                          <div key={enf._id} className="text-xs text-gray-700">
                            {enf.nom} {enf.prenom} ({enf.classe?.nomclass || "Classe inconnue"})
                          </div>
                        ))
                      : <em className="text-gray-400">Aucun enfant</em>}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1 border-[#38bdf8] text-[#0a2540] hover:bg-[#e0f2fe] font-bold rounded-lg"
                        title="Modifier"
                        onClick={() => navigate(`/admin/parents/edit/${parent._id}`)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg"
                        title="Supprimer"
                        onClick={() => alert("Fonction suppression à venir")}
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

export default Parents;
