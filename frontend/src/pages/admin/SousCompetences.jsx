import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";

export default function SousCompetences() {
  const navigate = useNavigate();
  const [groupedData, setGroupedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/souscompetences")
      .then((res) => res.json())
      .then((data) => {
        const sousCompetences = data.sousCompetences || [];

        // Groupement par compétence
        const group = {};
        sousCompetences.forEach((sc) => {
          const comp = sc.competence?.nom || "Inconnue";
          if (!group[comp]) {
            group[comp] = [];
          }
          group[comp].push({ nom: sc.nom, bareme: sc.bareme });
        });

        const result = Object.entries(group).map(([competenceNom, sousCompetences]) => ({
          competenceNom,
          sousCompetences,
        }));

        setGroupedData(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur récupération sous-compétences:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <p className="p-4">Chargement des sous-compétences...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Card className="w-full max-w-6xl mx-auto mb-6 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold text-[#38bdf8]">
            Sous-compétences par compétence
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="max-w-6xl mx-auto flex justify-end mb-4">
        <Button
          onClick={() => navigate("/admin/sous-competences/add")}
          className="flex items-center gap-2 bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-bold rounded-lg shadow"
        >
          <Plus className="mr-2 h-4 w-4" /> Ajouter une sous-compétence
        </Button>
      </div>

      <Card className="w-full max-w-6xl mx-auto shadow-lg rounded-2xl">
        <CardContent className="overflow-x-auto p-0">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow className="bg-[#38bdf8]/20">
                <TableHead className="text-[#0a2540] font-bold">Compétence</TableHead>
                <TableHead className="text-[#0a2540] font-bold">Sous-compétences</TableHead>
                <TableHead className="text-[#0a2540] font-bold">Barèmes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedData.map((row, idx) => (
                <TableRow key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#f1f5f9]"}>
                  <TableCell className="font-semibold">{row.competenceNom}</TableCell>
                  <TableCell>{row.sousCompetences.map((sc) => sc.nom).join(", ")}</TableCell>
                  <TableCell>{row.sousCompetences.map((sc) => sc.bareme).join(", ")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
