import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AdminLayout from "./AdminLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ArrowLeft, Loader2, Clock, BookOpen, Hash } from "lucide-react";
import { toast } from "sonner";

export default function AddPeriode() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mois: "",
    ua: "",
    trimestre: "",
    annee: "",
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
      const res = await fetch("http://localhost:5000/api/periodes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Période ajoutée avec succès");
        navigate("/admin/periodes");
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

  const currentYear = new Date().getFullYear();

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
                <Calendar className="w-6 h-6 text-[#38bdf8]" />
                Ajouter une période
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Créez une nouvelle période scolaire
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
                  <Calendar className="w-5 h-5 text-[#38bdf8]" />
                  <h3 className="text-lg font-semibold text-[#0a2540]">Informations de la période</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">
                      Mois <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="mois"
                      placeholder="Ex: Septembre, Octobre, Novembre"
                      required
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">
                      Unité d'apprentissage (UA) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="ua"
                      placeholder="Ex: UA1, UA2, UA3"
                      required
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Configuration temporelle */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <Clock className="w-5 h-5 text-[#38bdf8]" />
                  <h3 className="text-lg font-semibold text-[#0a2540]">Configuration temporelle</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">
                      Trimestre <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="trimestre"
                      required
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    >
                      <option value="">-- Sélectionner un trimestre --</option>
                      <option value="1er Trimestre">1er Trimestre</option>
                      <option value="2e Trimestre">2e Trimestre</option>
                      <option value="3e Trimestre">3e Trimestre</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">
                      Année scolaire <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="annee"
                      placeholder={`Ex: ${currentYear}-${currentYear + 1}`}
                      required
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Aperçu */}
              {(formData.mois || formData.ua || formData.trimestre || formData.annee) && (
                <div className="space-y-4 p-4 bg-[#f8fafc] rounded-xl border border-[#e0f2fe]">
                  <h4 className="font-medium text-[#0a2540] flex items-center gap-2">
                    <Hash className="w-4 h-4 text-[#38bdf8]" />
                    Aperçu de la période
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Mois:</span>
                      <p className="font-medium text-[#0a2540]">{formData.mois || "Non défini"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">UA:</span>
                      <p className="font-medium text-[#0a2540]">{formData.ua || "Non défini"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Trimestre:</span>
                      <p className="font-medium text-[#0a2540]">{formData.trimestre || "Non défini"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Année:</span>
                      <p className="font-medium text-[#0a2540]">{formData.annee || "Non défini"}</p>
                    </div>
                  </div>
                  {formData.mois && formData.trimestre && (
                    <div className="mt-2 p-2 bg-[#e0f2fe] rounded-lg">
                      <p className="text-xs text-[#0a2540]">
                        <strong>Période complète:</strong> {formData.mois} - {formData.trimestre} {formData.annee}
                      </p>
                    </div>
                  )}
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
                      <Calendar className="h-4 w-4" />
                      Créer la période
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
