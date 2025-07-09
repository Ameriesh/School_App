import { useEffect, useState } from "react";
import AdminLayout from "../admin/AdminLayout" // adapte le chemin si besoin

export default function ListeEleve() {
  const [eleves, setEleves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEleves = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/eleves/enseignant", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Erreur lors du chargement des élèves");
        }
        const data = await res.json();
        setEleves(data.eleves || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEleves();
  }, []);

  return (
    <AdminLayout>
      {loading && <p>Chargement des élèves...</p>}
      {error && <p className="text-red-600">Erreur : {error}</p>}
      {!loading && !error && eleves.length === 0 && <p>Aucun élève trouvé.</p>}

      {!loading && !error && eleves.length > 0 && (
        <div className="p-6 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Liste des élèves de votre classe</h1>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-200">
                <th className="border border-gray-300 p-2 text-left">Nom</th>
                <th className="border border-gray-300 p-2 text-left">Prénom</th>
                <th className="border border-gray-300 p-2 text-left">Classe</th>
                <th className="border border-gray-300 p-2 text-left">Niveau</th>
              </tr>
            </thead>
            <tbody>
              {eleves.map((eleve) => (
                <tr key={eleve._id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-2">{eleve.nom}</td>
                  <td className="border border-gray-300 p-2">{eleve.prenom}</td>
                  <td className="border border-gray-300 p-2">{eleve.classe?.nomclass || "N/A"}</td>
                  <td className="border border-gray-300 p-2">{eleve.classe?.niveau || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
