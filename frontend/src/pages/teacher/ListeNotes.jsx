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
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Plus, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../admin/AdminLayout";

function ListeNotes() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/notes")
      .then((res) => res.json())
      .then((data) => {
        setNotes(data.notes || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur récupération notes:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <p className="p-4">Chargement des notes...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Card className="w-full max-w-6xl mx-auto mb-6 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold text-[#38bdf8]">
            Notes des élèves
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="max-w-6xl mx-auto flex justify-end mb-4">
        <Button
          onClick={() => navigate("/enseignant/notes/add")}
          className="flex items-center gap-2 bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-bold rounded-lg shadow"
        >
          <Plus className="mr-2 h-4 w-4" /> Ajouter une note
        </Button>
      </div>

      <Card className="w-full max-w-6xl mx-auto shadow-lg rounded-2xl">
        <CardContent className="overflow-x-auto p-0">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow className="bg-[#38bdf8]/20">
                <TableHead className="text-[#0a2540] font-bold">Élève</TableHead>
                <TableHead className="text-[#0a2540] font-bold">Compétence</TableHead>
                <TableHead className="text-[#0a2540] font-bold">Sous-compétences & Notes</TableHead>
                <TableHead className="text-[#0a2540] font-bold">Total</TableHead>
                <TableHead className="text-[#0a2540] font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notes.map((note, idx) => (
                <TableRow
                  key={note._id}
                  className={
                    idx % 2 === 0
                      ? "bg-white"
                      : "bg-[#f1f5f9] hover:bg-[#e0f2fe] transition"
                  }
                >
                  <TableCell className="font-semibold">
                    {note.eleve?.nom} {note.eleve?.prenom}
                  </TableCell>
                  <TableCell>{note.competence?.nom}</TableCell>
                  <TableCell>
                    {note.sousCompetences.map((sc) => (
                      <div key={sc._id}>
                        <strong>{sc.nom} :</strong> {sc.note} / {sc.bareme}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {note.sousCompetences.reduce(
                      (total, sc) => total + (sc.note || 0),
                      0
                    )}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1 border-[#38bdf8] text-[#0a2540] hover:bg-[#e0f2fe] font-bold rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
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

export default ListeNotes;
