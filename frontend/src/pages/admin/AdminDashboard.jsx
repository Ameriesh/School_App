import AdminLayout from "./AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminDashboard({ onLogout }) {
  return (
    <AdminLayout onLogout={onLogout}>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-[#007ACC]">Bienvenue dans le tableau de bord</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 text-center text-lg">Utilisez la barre latérale pour gérer les enseignants, élèves, parents et classes.</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
