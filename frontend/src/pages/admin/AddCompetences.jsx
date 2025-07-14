import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AdminLayout from "./AdminLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Target, ArrowLeft, Loader2, Layers, Hash } from "lucide-react";
import { toast } from "sonner";

export default function AddCompetence() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    code: "",
    nom: "",
    groupe: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
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
        toast.success("Compétence ajoutée avec succès");
        navigate("/admin/competences");
      } else {
        const errorData = await res.json();
        toast.error("Erreur : " + (errorData.message || "Échec de l'enregistrement"));
      }
    } catch (err) {
      toast.error("Erreur réseau ou serveur");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Retour</span>
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-2 flex items-center gap-2">
                <Target className="w-6 h-6 text-[#38bdf8]" />
                Ajouter une compétence
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Créez une nouvelle compétence pédagogique
              </p>
            </div>
          </div>
        </div>

        <Card className="bg-white shadow-lg rounded-2xl border-0">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informations de base */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <Target className="w-5 h-5 text-[#38bdf8]" />
                  <h3 className="text-lg font-semibold text-[#0a2540]">Informations de la compétence</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">
                      Code <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="code"
                      placeholder="Ex: 1A, 2B, 3C"
                      required
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">
                      Nom de la compétence <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="nom"
                      placeholder="Ex: Français, Mathématiques, Sciences"
                      required
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Groupe */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <Layers className="w-5 h-5 text-[#38bdf8]" />
                  <h3 className="text-lg font-semibold text-[#0a2540]">Classification</h3>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#0a2540]">
                    Groupe de compétences
                  </label>
                  <Input
                    name="groupe"
                    placeholder="Ex: Compétences linguistiques, Compétences scientifiques"
                    onChange={handleChange}
                    className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500">
                    Optionnel - Permet de regrouper les compétences par domaine
                  </p>
                </div>
              </div>

              {/* Aperçu */}
              {(formData.code || formData.nom) && (
                <div className="space-y-4 p-4 bg-[#f8fafc] rounded-xl border border-[#e0f2fe]">
                  <h4 className="font-medium text-[#0a2540] flex items-center gap-2">
                    <Hash className="w-4 h-4 text-[#38bdf8]" />
                    Aperçu de la compétence
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Code:</span>
                      <p className="font-medium text-[#0a2540]">{formData.code || "Non défini"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Nom:</span>
                      <p className="font-medium text-[#0a2540]">{formData.nom || "Non défini"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Groupe:</span>
                      <p className="font-medium text-[#0a2540]">{formData.groupe || "Non défini"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(-1)} 
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Target className="h-4 w-4" />
                      Créer la compétence
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
