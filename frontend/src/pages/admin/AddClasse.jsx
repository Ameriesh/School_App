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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEnseignants() {
      const token = localStorage.getItem("token");
      console.log("TOKEN LOCALSTORAGE =", token);
      try {
        const res = await fetch("http://localhost:5000/api/teachers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Non autorisé ou erreur serveur");
        }

        const data = await res.json();

        // ⚠️ Assure-toi que ton backend renvoie { teachers: [...] }
        setEnseignants(data.data || []);
      } catch (err) {
        console.error("Erreur lors du chargement des enseignants :", err);
        setEnseignants([]); // évite plantage si map
      } finally {
        setLoading(false);
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
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        navigate("/admin/classes");
        console.log("Authorization header:", req.headers.authorization);

      } else {
        const errorData = await res.json();
        alert("Erreur : " + (errorData.message || "Échec de l'enregistrement"));
      }
    } catch (error) {
      alert("Erreur réseau ou serveur");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
        <Card className="w-full max-w-2xl mb-6 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-extrabold text-[#38bdf8] text-center">
              Ajouter une Classe
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="w-full max-w-2xl shadow-lg rounded-2xl">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Nom de la classe</label>
                <Input
                  name="nomclass"
                  placeholder="Nom de la classe"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Capacité maximale</label>
                <Input
                  name="capacite"
                  placeholder="Capacité maximale"
                  type="number"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Niveau</label>
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
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Enseignant</label>
                <select
                  name="enseignant"
                  required
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">-- Sélectionner un enseignant --</option>
                  {Array.isArray(enseignants) && enseignants.length > 0 ? (
                    enseignants.map((e) => (
                      <option key={e._id} value={e._id}>
                        {e.nom} {e.prenom}
                      </option>
                    ))
                  ) : (
                    <option disabled>
                      {loading ? "Chargement..." : "Aucun enseignant trouvé"}
                    </option>
                  )}
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" onClick={() => navigate(-1)} className="rounded-lg">
                  Annuler
                </Button>
                <Button type="submit" className="bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-bold rounded-lg">
                  Enregistrer
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default AddClasse;
