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
import { Plus, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";

function Competences() {
  const navigate = useNavigate();
  const [competences, setCompetences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/competences")
      .then((res) => res.json())
      .then((data) => {
        setCompetences(data.competences || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur récupération des compétences:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <p className="p-4">Chargement des compétences...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Card className="w-full max-w-6xl mx-auto mb-6 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold text-[#38bdf8]">Compétences</CardTitle>
        </CardHeader>
      </Card>
      <div className="max-w-6xl mx-auto flex justify-end mb-4">
        <Button
          onClick={() => navigate("/admin/competences/add")}
          className="flex items-center gap-2 bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-bold rounded-lg shadow"
        >
          <Plus className="mr-2 h-4 w-4" /> Ajouter une compétence
        </Button>
      </div>
      <Card className="w-full max-w-6xl mx-auto shadow-lg rounded-2xl">
        <CardContent className="overflow-x-auto p-0">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow className="bg-[#38bdf8]/20">
                <TableHead className="text-[#0a2540] font-bold">Nom de la competence</TableHead>
                <TableHead className="text-[#0a2540] font-bold">Code</TableHead>
                <TableHead className="text-[#0a2540] font-bold">Groupe de competences</TableHead>
                <TableHead className="text-[#0a2540] font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competences.map((competence, idx) => (
                <TableRow
                  key={competence._id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-[#f1f5f9] hover:bg-[#e0f2fe] transition"}
                >
                  <TableCell className="font-semibold">{competence.nom}</TableCell>
                  <TableCell>{competence.code}</TableCell>
                  <TableCell>{competence.groupe}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1 border-[#38bdf8] text-[#0a2540] hover:bg-[#e0f2fe] font-bold rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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

export default Competences;
