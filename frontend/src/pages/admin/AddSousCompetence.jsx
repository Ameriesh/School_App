import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AdminLayout from "./AdminLayout";
import { useState, useEffect } from "react";

export default function AddSousCompetence() {
  const navigate = useNavigate();
  const [competences, setCompetences] = useState([]);
  const [formData, setFormData] = useState({
    nom: "",         // ✅ nom au lieu de titre
    bareme: "",      // ✅ bareme au lieu de total
    competence: "",
  });

  useEffect(() => {
    const fetchCompetences = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5000/api/competences", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setCompetences(data.competences || []);
      } catch (error) {
        console.error("Erreur lors du chargement des compétences", error);
      }
    };
    fetchCompetences();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/souscompetences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) navigate("/admin/souscompetences");
      else alert("Erreur lors de l'enregistrement");
    } catch (error) {
      alert("Erreur serveur ou réseau");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
        <Card className="w-full max-w-2xl mb-6 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-extrabold text-[#38bdf8] text-center">
              Ajouter une Sous-compétence
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="w-full max-w-2xl shadow-lg rounded-2xl">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Nom</label>
                <Input
                  name="nom"
                  placeholder="Orale / Écrit / Savoir-être"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Barème</label>
                <Input
                  name="bareme"
                  type="number"
                  placeholder="ex: 12 / 15 / 3"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Compétence associée</label>
                <select
                  name="competence"
                  required
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">-- Choisir une compétence --</option>
                  {competences.map((comp) => (
                    <option key={comp._id} value={comp._id}>
                      {comp.nom} {comp.groupe ? `(${comp.groupe})` : ""}
                    </option>
                  ))}
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
