import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AdminLayout from "./AdminLayout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Users, Upload, Loader2, ArrowLeft, UserPlus } from "lucide-react";
import { toast } from "sonner";

function AddParent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    profession: "",
    email: "",
    telephone: "",
    adresse: "",
    photo: null,
    name_user: "",
    password: "",
  });

  const [photoPreview, setPhotoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
      
      // Créer un aperçu de l'image
      if (files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPhotoPreview(e.target.result);
        };
        reader.readAsDataURL(files[0]);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const form = new FormData();
    for (let key in formData) {
      if (formData[key]) {
        form.append(key, formData[key]);
      }
    }
    
    try {
      const res = await fetch("http://localhost:5000/api/parents", {
        method: "POST",
        body: form,
      });
      
      if (res.ok) {
        toast.success("Parent ajouté avec succès");
        navigate("/admin/parents");
      } else {
        const errorData = await res.json();
        toast.error("Erreur lors de l'ajout : " + (errorData.message || res.statusText));
      }
    } catch (err) {
      toast.error("Erreur réseau, réessayez plus tard.");
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
                <UserPlus className="w-6 h-6 text-[#38bdf8]" />
                Ajouter un parent
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Créez un nouveau compte parent
              </p>
            </div>
          </div>
        </div>

        <Card className="bg-white shadow-lg rounded-2xl border-0">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informations du parent */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <Users className="w-5 h-5 text-[#38bdf8]" />
                  <h3 className="text-lg font-semibold text-[#0a2540]">Informations du parent</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      name="nom" 
                      placeholder="Nom du parent" 
                      required 
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">
                      Prénom <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      name="prenom" 
                      placeholder="Prénom du parent" 
                      required 
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">
                      Profession <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      name="profession" 
                      placeholder="Profession du parent" 
                      required 
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      name="email" 
                      type="email" 
                      placeholder="Email du parent" 
                      required 
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">
                      Téléphone <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      name="telephone" 
                      placeholder="Téléphone du parent" 
                      required 
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">
                      Adresse <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      name="adresse" 
                      placeholder="Adresse du parent" 
                      required 
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">
                      Photo <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      <Input 
                        name="photo" 
                        type="file" 
                        accept="image/*" 
                        required 
                        onChange={handleChange}
                        className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                      />
                      {photoPreview && (
                        <div className="mt-2">
                          <img 
                            src={photoPreview} 
                            alt="Aperçu" 
                            className="w-20 h-20 rounded-lg object-cover border"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Compte utilisateur */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <Upload className="w-5 h-5 text-[#38bdf8]" />
                  <h3 className="text-lg font-semibold text-[#0a2540]">Compte utilisateur</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">
                      Nom d'utilisateur <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      name="name_user" 
                      placeholder="Nom d'utilisateur" 
                      required 
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">
                      Mot de passe <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      name="password" 
                      type="password" 
                      placeholder="Mot de passe" 
                      required 
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

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
                  disabled={loading}
                  className="bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Enregistrer
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

export default AddParent;
