import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AdminLayout from "./AdminLayout";
import { useState, useEffect } from "react";
import { Target, ArrowLeft, Loader2, Star, Layers, Hash } from "lucide-react";
import { toast } from "sonner";

export default function AddSousCompetence() {
  const navigate = useNavigate();
  const [competences, setCompetences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    bareme: "",
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
        toast.error("Erreur lors du chargement des compétences");
      } finally {
        setLoading(false);
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
    setSubmitting(true);
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
      if (res.ok) {
        toast.success("Sous-compétence ajoutée avec succès");
        navigate("/admin/sous-competences");
      } else {
        const errorData = await res.json();
        toast.error("Erreur : " + (errorData.message || "Échec de l'enregistrement"));
      }
    } catch (error) {
      toast.error("Erreur serveur ou réseau");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCompetence = competences.find(c => c._id === formData.competence);

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
                Ajouter une sous-compétence
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Créez une nouvelle sous-compétence avec son barème
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
                  <h3 className="text-lg font-semibold text-[#0a2540]">Informations de la sous-compétence</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">
                      Nom de la sous-compétence <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="nom"
                      placeholder="Ex: Expression orale, Calcul mental, Travail en équipe"
                      required
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">
                      Barème <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="bareme"
                      type="number"
                      min="1"
                      max="20"
                      placeholder="Ex: 10, 15, 20"
                      required
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500">
                      Note maximale sur 20
                    </p>
                  </div>
                </div>
              </div>

              {/* Compétence associée */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <Layers className="w-5 h-5 text-[#38bdf8]" />
                  <h3 className="text-lg font-semibold text-[#0a2540]">Compétence parent</h3>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#0a2540]">
                    Compétence associée <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="competence"
                    required
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                  >
                    <option value="">-- Choisir une compétence --</option>
                    {competences.map((comp) => (
                      <option key={comp._id} value={comp._id}>
                        {comp.nom} {comp.groupe ? `(${comp.groupe})` : ""}
                      </option>
                    ))}
                  </select>
                  {loading && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Chargement des compétences...
                    </div>
                  )}
                </div>
              </div>

              {/* Aperçu */}
              {(formData.nom || formData.bareme || formData.competence) && (
                <div className="space-y-4 p-4 bg-[#f8fafc] rounded-xl border border-[#e0f2fe]">
                  <h4 className="font-medium text-[#0a2540] flex items-center gap-2">
                    <Hash className="w-4 h-4 text-[#38bdf8]" />
                    Aperçu de la sous-compétence
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Nom:</span>
                      <p className="font-medium text-[#0a2540]">{formData.nom || "Non défini"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Barème:</span>
                      <p className="font-medium text-[#0a2540] flex items-center gap-1">
                        {formData.bareme || 0}/20
                        <Star className="w-3 h-3 text-yellow-500" />
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Compétence:</span>
                      <p className="font-medium text-[#0a2540]">
                        {selectedCompetence ? selectedCompetence.nom : "Non sélectionnée"}
                      </p>
                    </div>
                  </div>
                  {selectedCompetence && (
                    <div className="mt-2 p-2 bg-[#e0f2fe] rounded-lg">
                      <p className="text-xs text-[#0a2540]">
                        <strong>Groupe:</strong> {selectedCompetence.groupe || "Non défini"}
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
                  disabled={submitting || loading}
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
                      Créer la sous-compétence
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
