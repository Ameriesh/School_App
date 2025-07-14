import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AdminLayout from "./AdminLayout";
import { useEffect, useState } from "react";
import { BookOpen, Users, ArrowLeft, Loader2, GraduationCap } from "lucide-react";
import { toast } from "sonner";

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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchEnseignants() {
      const token = localStorage.getItem("token");
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
        setEnseignants(data.data || []);
      } catch (err) {
        console.error("Erreur lors du chargement des enseignants :", err);
        toast.error("Erreur lors du chargement des enseignants");
        setEnseignants([]);
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
    setSubmitting(true);
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
        toast.success("Classe ajoutée avec succès");
        navigate("/admin/classes");
      } else {
        const errorData = await res.json();
        toast.error("Erreur : " + (errorData.message || "Échec de l'enregistrement"));
      }
    } catch (error) {
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
                <BookOpen className="w-6 h-6 text-[#38bdf8]" />
                Ajouter une classe
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Créez une nouvelle classe avec ses paramètres
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
                  <BookOpen className="w-5 h-5 text-[#38bdf8]" />
                  <h3 className="text-lg font-semibold text-[#0a2540]">Informations de la classe</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">
                      Nom de la classe <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="nomclass"
                      placeholder="Ex: CP1, CE1A, 6ème A"
                      required
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">
                      Capacité maximale <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="capacite"
                      placeholder="Ex: 30"
                      type="number"
                      min="1"
                      max="50"
                      required
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Niveau et enseignant */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <GraduationCap className="w-5 h-5 text-[#38bdf8]" />
                  <h3 className="text-lg font-semibold text-[#0a2540]">Configuration pédagogique</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">
                      Niveau <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="niveau"
                      required
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    >
                      <option value="">-- Sélectionner un niveau --</option>
                      <option value="I">Niveau I</option>
                      <option value="II">Niveau II</option>
                      <option value="III">Niveau III</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">
                      Enseignant responsable <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="enseignant"
                      required
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    >
                      <option value="">-- Sélectionner un enseignant --</option>
                      {Array.isArray(enseignants) && enseignants.length > 0 ? (
                        enseignants.map((e) => (
                          <option key={e._id} value={e._id}>
                            {e.prenom} {e.nom}
                          </option>
                        ))
                      ) : (
                        <option disabled>
                          {loading ? "Chargement des enseignants..." : "Aucun enseignant disponible"}
                        </option>
                      )}
                    </select>
                    {loading && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Chargement des enseignants...
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Aperçu */}
              {formData.nomclass && (
                <div className="space-y-4 p-4 bg-[#f8fafc] rounded-xl border border-[#e0f2fe]">
                  <h4 className="font-medium text-[#0a2540] flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#38bdf8]" />
                    Aperçu de la classe
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Nom:</span>
                      <p className="font-medium text-[#0a2540]">{formData.nomclass}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Capacité:</span>
                      <p className="font-medium text-[#0a2540]">{formData.capacite || 0} élèves</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Niveau:</span>
                      <p className="font-medium text-[#0a2540]">{formData.niveau || "Non défini"}</p>
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
                      <BookOpen className="h-4 w-4" />
                      Créer la classe
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

export default AddClasse;
