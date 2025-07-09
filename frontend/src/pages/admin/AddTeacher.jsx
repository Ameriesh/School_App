import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AdminLayout from "./AdminLayout";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData({ ...formData, photo: files[0] });
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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="mb-6 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-extrabold text-indigo-600 text-center">
                Ajouter un enseignant
              </CardTitle>
            </CardHeader>
          </Card>
          
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <Card className="shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Colonne 1 */}
                  <div className="space-y-6">
                    <div>
                      <label className="block mb-1 font-semibold text-[#0a2540]">Nom*</label>
                      <Input name="nom" value={formData.nom} onChange={handleChange} required />
                    </div>
                    
                    <div>
                      <label className="block mb-1 font-semibold text-[#0a2540]">Prénom*</label>
                      <Input name="prenom" value={formData.prenom} onChange={handleChange} required />
                    </div>
                    
                    <div>
                      <label className="block mb-1 font-semibold text-[#0a2540]">Désignation</label>
                      <Input name="designation" value={formData.designation} onChange={handleChange} />
                    </div>
                    
                    <div>
                      <label className="block mb-1 font-semibold text-[#0a2540]">Date de naissance</label>
                      <Input type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange} />
                    </div>
                    
                    <div>
                      <label className="block mb-1 font-semibold text-[#0a2540]">Sexe</label>
                      <select 
                        name="sexe" 
                        value={formData.sexe} 
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="">Sélectionner</option>
                        <option value="M">Masculin</option>
                        <option value="F">Féminin</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Colonne 2 */}
                  <div className="space-y-6">
                    <div>
                      <label className="block mb-1 font-semibold text-[#0a2540]">Email*</label>
                      <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    
                    <div>
                      <label className="block mb-1 font-semibold text-[#0a2540]">Adresse</label>
                      <Input name="adresse" value={formData.adresse} onChange={handleChange} />
                    </div>
                    
                    <div>
                      <label className="block mb-1 font-semibold text-[#0a2540]">Téléphone</label>
                      <Input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} />
                    </div>
                    
                    <div>
                      <label className="block mb-1 font-semibold text-[#0a2540]">Date d'entrée</label>
                      <Input type="date" name="dateEntree" value={formData.dateEntree} onChange={handleChange} />
                    </div>
                    
                    <div>
                      <label className="block mb-1 font-semibold text-[#0a2540]">Photo</label>
                      <Input type="file" name="photo" onChange={handleChange} accept="image/*" />
                    </div>
                    
                    <div>
                      <label className="block mb-1 font-semibold text-[#0a2540]">Mot de passe*</label>
                      <Input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="border-gray-700 text-gray-700 hover:bg-gray-100"
                    disabled={loading}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    disabled={loading}
                  >
                    {loading ? "Enregistrement en cours..." : "Enregistrer"}
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