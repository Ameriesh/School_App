import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AdminLayout from "./AdminLayout";
import { useEffect, useState } from "react";

function AddClasse() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nomclass: "",
    capacite: "",
    niveau: "",
    enseignant: "",
  });

  const [enseignants, setEnseignants] = useState([]);

  // Récupérer les enseignants du backend
  useEffect(() => {
  async function fetchEnseignants() {
    try {
      const res = await fetch("http://localhost:5000/api/teachers");
      const data = await res.json();
      console.log("Enseignants récupérés :", data); // <= vérification ici
     setEnseignants(data || []);

    } catch (err) {
      console.error("Erreur lors du chargement des enseignants", err);
    }
  }

  fetchEnseignants();
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        navigate("/admin/classes");
      } else {
        const errorData = await res.json();
        alert("Erreur : " + (errorData.message || "Échec de l'enregistrement"));
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Erreur réseau");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
        {/* Titre */}
        <Card className="w-full max-w-4xl mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Ajouter une Classe</CardTitle>
          </CardHeader>
        </Card>

        {/* Formulaire */}
        <Card className="w-full max-w-4xl flex-grow">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="nomclass"
                placeholder="Nom de la classe"
                required
                onChange={handleChange}
              />
              <Input
                name="capacite"
                placeholder="Capacité maximale"
                type="number"
                required
                onChange={handleChange}
              />
              <select
                name="niveau"
                required
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">-- Niveau --</option>
                <option value="I">Niveau I</option>
                <option value="II">Niveau II</option>
                <option value="III">Niveau III</option>
              </select>

              <select
                name="enseignant"
                required
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">-- Sélectionner un enseignant --</option>
                {enseignants.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.nom} {e.prenom}
                  </option>
                ))}
              </select>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Annuler
                </Button>
                <Button type="submit">Enregistrer</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default AddClasse;
