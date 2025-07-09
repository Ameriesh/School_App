import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AdminLayout from "./AdminLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddCompetence() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    code: "",
    nom: "",
    groupe: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/competences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        navigate("/admin/competences");
      } else {
        const errorData = await res.json();
        alert("Erreur : " + (errorData.message || "Échec de l'enregistrement"));
      }
    } catch (err) {
      alert("Erreur réseau ou serveur");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
        <Card className="w-full max-w-2xl mb-6 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-extrabold text-[#38bdf8] text-center">
              Ajouter une Compétence
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="w-full max-w-2xl shadow-lg rounded-2xl">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Code</label>
                <Input
                  name="code"
                  placeholder="ex: 1A"
                  required
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Nom de la compétence</label>
                <Input
                  name="nom"
                  placeholder="ex: Français"
                  required
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Groupe (optionnel)</label>
                <Input
                  name="groupe"
                  placeholder="ex: Compétence 1"
                  onChange={handleChange}
                />
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
