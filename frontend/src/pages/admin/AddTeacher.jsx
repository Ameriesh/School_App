import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AdminLayout from "./AdminLayout";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import { Users, ArrowLeft, Save, Upload, Loader2 } from "lucide-react";

function AddTeacher() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    designation: "",
    dateNaissance: "",
    sexe: "",
    email: "",
    adresse: "",
    telephone: "",
    dateEntree: "",
    photo: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      const file = files[0];
      setFormData({ ...formData, photo: file });
      
      // Créer un aperçu de l'image
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setPreviewImage(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setPreviewImage(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = await auth.currentUser.getIdToken();
      const form = new FormData();

      // Ajoutez tous les champs au FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "" && value !== null) {
          form.append(key, value);
        }
      });

      const response = await fetch("http://localhost:5000/api/teachers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: form
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la création");
      }

      navigate("/enseignants", { state: { success: "Enseignant créé avec succès" } });
    } catch (err) {
      console.error("Erreur:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#0a2540]" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-2 flex items-center gap-2">
                <Users className="w-6 h-6 text-[#38bdf8]" />
                Ajouter un enseignant
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Créez un nouveau profil enseignant
              </p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="max-w-4xl mx-auto">
          {error && (
            <Card className="mb-6 bg-red-50 border-red-200 shadow-lg rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <p className="font-medium">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-white shadow-lg rounded-2xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#38bdf8]/5 to-[#0a2540]/5">
              <CardTitle className="text-xl font-bold text-[#0f172a] flex items-center gap-2">
                <Save className="w-5 h-5 text-[#38bdf8]" />
                Informations de l'enseignant
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Photo de profil */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-lg overflow-hidden">
                      {previewImage ? (
                        <img 
                          src={previewImage} 
                          alt="Aperçu" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-[#38bdf8] text-white p-2 rounded-full cursor-pointer hover:bg-[#0ea5e9] transition-colors">
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        name="photo"
                        onChange={handleChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 text-center">
                    Cliquez sur l'icône pour ajouter une photo
                  </p>
                </div>

                {/* Informations personnelles */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#0a2540] border-b border-gray-200 pb-2">
                      Informations personnelles
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 font-medium text-[#0a2540]">
                          Nom <span className="text-red-500">*</span>
                        </label>
                        <Input 
                          name="nom" 
                          value={formData.nom} 
                          onChange={handleChange} 
                          required 
                          className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block mb-2 font-medium text-[#0a2540]">
                          Prénom <span className="text-red-500">*</span>
                        </label>
                        <Input 
                          name="prenom" 
                          value={formData.prenom} 
                          onChange={handleChange} 
                          required 
                          className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-medium text-[#0a2540]">Désignation</label>
                      <Input 
                        name="designation" 
                        value={formData.designation} 
                        onChange={handleChange}
                        placeholder="Ex: Professeur de mathématiques"
                        className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 font-medium text-[#0a2540]">Date de naissance</label>
                        <Input 
                          type="date" 
                          name="dateNaissance" 
                          value={formData.dateNaissance} 
                          onChange={handleChange}
                          className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block mb-2 font-medium text-[#0a2540]">Sexe</label>
                        <select 
                          name="sexe" 
                          value={formData.sexe} 
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                        >
                          <option value="">Sélectionner</option>
                          <option value="M">Masculin</option>
                          <option value="F">Féminin</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Informations de contact */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#0a2540] border-b border-gray-200 pb-2">
                      Informations de contact
                    </h3>
                    
                    <div>
                      <label className="block mb-2 font-medium text-[#0a2540]">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required
                        placeholder="exemple@email.com"
                        className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-medium text-[#0a2540]">Adresse</label>
                      <Input 
                        name="adresse" 
                        value={formData.adresse} 
                        onChange={handleChange}
                        placeholder="Adresse complète"
                        className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-medium text-[#0a2540]">Téléphone</label>
                      <Input 
                        type="tel" 
                        name="telephone" 
                        value={formData.telephone} 
                        onChange={handleChange}
                        placeholder="+33 6 12 34 56 78"
                        className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-medium text-[#0a2540]">Date d'entrée</label>
                      <Input 
                        type="date" 
                        name="dateEntree" 
                        value={formData.dateEntree} 
                        onChange={handleChange}
                        className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-medium text-[#0a2540]">
                        Mot de passe <span className="text-red-500">*</span>
                      </label>
                      <Input 
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required
                        placeholder="Mot de passe sécurisé"
                        className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Boutons d'action */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                    disabled={loading}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Enregistrer l'enseignant
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AddTeacher;