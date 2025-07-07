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

function Classes() {
  const navigate = useNavigate();

  // Exemple de données de classes (à remplacer plus tard par Firestore)
  const classes = [
    {
      nom: "CP",
      capacite: 45,
      niveau: "I",
      nbEleves: 38,
      enseignant: "Mme Alice",
    },
    {
      nom: "CE1",
      capacite: 50,
      niveau: "II",
      nbEleves: 40,
      enseignant: "M. Jean",
    },
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Titre */}
        <Card className="w-full max-w-6xl mx-auto mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Classes</CardTitle>
          </CardHeader>
        </Card>

        {/* Bouton ajouter */}
        <div className="max-w-6xl mx-auto flex justify-end mb-4">
          <Button onClick={() => navigate("/admin/classes/add")}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter une classe
          </Button>
        </div>

        {/* Tableau des classes */}
        <Card className="w-full max-w-6xl mx-auto">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom de la classe</TableHead>
                  <TableHead>Capacité max</TableHead>
                  <TableHead>Niveau</TableHead>
                  <TableHead>Nombre d'élèves</TableHead>
                  <TableHead>Enseignant</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((classe, index) => (
                  <TableRow key={index}>
                    <TableCell>{classe.nom}</TableCell>
                    <TableCell>{classe.capacite}</TableCell>
                    <TableCell>{classe.niveau}</TableCell>
                    <TableCell>{classe.nbEleves}</TableCell>
                    <TableCell>{classe.enseignant}</TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default Classes;
