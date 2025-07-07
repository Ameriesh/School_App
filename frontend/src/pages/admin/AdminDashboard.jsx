import AdminLayout from "./AdminLayout";

export default function AdminDashboard({ onLogout }) {
  return (
    <AdminLayout onLogout={onLogout}>
      <h2 className="text-2xl font-bold mb-4">Bienvenue dans le tableau de bord</h2>
      <p className="text-gray-700">Utilisez la barre latérale pour gérer les enseignants et les données.</p>
    </AdminLayout>
  );
}
