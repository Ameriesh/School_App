import React, { useState } from "react";
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
  const [loading, setLoading] = useState(false);

  if (loading) return <AdminLayout><p>Chargement...</p></AdminLayout>;

  return (
    <AdminLayout>
      {/* Titre principal */}
      <Card className="mb-6 w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">Liste des Parents</CardTitle>
        </CardHeader>
      </Card>

      {/* Boutons */}
      <div className="flex flex-col md:flex-row justify-start items-start gap-4 mb-6">
        <Button
          onClick={() => navigate("/admin/parents/add")}
          className="flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un Parent d'eleve
        </Button>

      </div>

      {/* Tableau des élèves */}
      <Card>
        <CardContent className="p-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Nom du Responsable legal1</TableHead>
                <TableHead>Nom du responsable legal2</TableHead>
                <TableHead>Enfants</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <img
                    src="https://via.placeholder.com/40"
                    alt="élève"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </TableCell>
                <TableCell>Ngono</TableCell>
                <TableCell>Claire</TableCell>
                <TableCell>CE1</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      title="Modifier"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

export default Parents;
