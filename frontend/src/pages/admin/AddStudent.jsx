import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AdminLayout from "./AdminLayout";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { School, ArrowLeft, Loader2, User, MapPin, Calendar, Upload, Hash } from "lucide-react";
import { toast } from "sonner";

function AddStudent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    parentId: "",
    dateNaissance: "",
    sexe: "",
    groupeSanguin: "",
    email: "",
    telephone: "",
    lieuNaissance: "",
    adresse: "",
    ville: "",
    pays: "",
    niveau: "",
    classe: "",
    matricule: "",
    nationalite: "",
    langue: "",
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [parents, setParents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchParents = async () => {
    try {
      const token = localStorage.getItem('token');
      const parentsRes = await fetch("http://localhost:5000/api/parents", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const parentsData = await parentsRes.json();
      setParents(Array.isArray(parentsData) ? parentsData : []);
    } catch (err) {
      console.error("Erreur chargement parents:", err);
      toast.error("Erreur lors du chargement des parents");
      setParents([]);
    }
  };

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('token');
      const classesRes = await fetch("http://localhost:5000/api/classes", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const classesData = await classesRes.json();
      setClasses(Array.isArray(classesData.classes) ? classesData.classes : []);
    } catch (err) {
      console.error("Erreur chargement classes:", err);
      toast.error("Erreur lors du chargement des classes");
      setClasses([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchParents(), fetchClasses()]);
      } catch (err) {
        console.error("Erreur chargement données:", err);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        dataToSend.append(key, value);
      });
      if (photo) {
        dataToSend.append("photo", photo);
      }
      
      const response = await fetch("http://localhost:5000/api/eleves", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: dataToSend,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur serveur");
      }
      
      await response.json();
      toast.success("Élève ajouté avec succès");
      navigate("/admin/eleves");
      fetchParents(); // Recharge la liste des parents après l'ajout
    } catch (error) {
      toast.error(error.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedParent = Array.isArray(parents) ? parents.find(p => p._id === formData.parentId) : null;
  const selectedClasse = Array.isArray(classes) ? classes.find(c => c._id === formData.classe) : null;

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
                <School className="w-6 h-6 text-[#38bdf8]" />
                Ajouter un élève
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Créez un nouveau profil d'élève
              </p>
            </div>
          </div>
        </div>

        <Card className="bg-white shadow-lg rounded-2xl border-0">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8" encType="multipart/form-data">
              {/* Informations personnelles */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <User className="w-5 h-5 text-[#38bdf8]" />
                  <h3 className="text-lg font-semibold text-[#0a2540]">Informations personnelles</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      name="nom" 
                      placeholder="Nom de famille" 
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
                      placeholder="Prénom" 
                      required 
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">
                      Matricule
                    </label>
                    <Input 
                      name="matricule" 
                      placeholder="Numéro matricule" 
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">
                      Date de naissance <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      name="dateNaissance" 
                      type="date" 
                      required 
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">
                      Sexe <span className="text-red-500">*</span>
                    </label>
                    <select 
                      name="sexe" 
                      required 
                      onChange={handleChange} 
                      value={formData.sexe} 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    >
                      <option value="">Sélectionner le sexe</option>
                      <option value="Masculin">Masculin</option>
                      <option value="Féminin">Féminin</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">Groupe sanguin</label>
                    <select 
                      name="groupeSanguin" 
                      onChange={handleChange} 
                      value={formData.groupeSanguin} 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    >
                      <option value="">Sélectionner le groupe sanguin</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact et localisation */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <MapPin className="w-5 h-5 text-[#38bdf8]" />
                  <h3 className="text-lg font-semibold text-[#0a2540]">Contact et localisation</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">Email</label>
                    <Input 
                      name="email" 
                      type="email" 
                      placeholder="Adresse email" 
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
                      placeholder="Numéro de téléphone" 
                      required 
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">Lieu de naissance</label>
                    <Input 
                      name="lieuNaissance" 
                      placeholder="Ville de naissance" 
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
                      placeholder="Adresse complète" 
                      required 
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">Ville</label>
                    <Input 
                      name="ville" 
                      placeholder="Ville de résidence" 
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">Pays</label>
                    <select 
                      name="pays" 
                      onChange={handleChange} 
                      value={formData.pays} 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    >
                      <option value="">Sélectionner le pays</option>
                      <option value="Cameroun">Cameroun</option>
                      <option value="Tchad">Tchad</option>
                      <option value="Gabon">Gabon</option>
                      <option value="Congo">Congo</option>
                      <option value="RCA">République Centrafricaine</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">Nationalité</label>
                    <Input 
                      name="nationalite" 
                      placeholder="Nationalité" 
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">Langue parlée</label>
                    <Input 
                      name="langue" 
                      placeholder="Langue maternelle" 
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Scolarité */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <School className="w-5 h-5 text-[#38bdf8]" />
                  <h3 className="text-lg font-semibold text-[#0a2540]">Informations scolaires</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">
                      Parent responsable <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <select 
                        name="parentId" 
                        required 
                        onChange={handleChange} 
                        value={formData.parentId} 
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                      >
                        <option value="">Sélectionner un parent</option>
                        {parents.map((parent) => (
                          <option key={parent._id} value={parent._id}>
                            {parent.prenom} {parent.nom} - {parent.email}
                          </option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={fetchParents}
                        className="px-3 py-2 border-[#38bdf8] text-[#38bdf8] hover:bg-[#e0f2fe]"
                        title="Recharger la liste des parents"
                      >
                        🔄
                      </Button>
                    </div>
                    {loading && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Chargement des parents...
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">
                      Niveau <span className="text-red-500">*</span>
                    </label>
                    <select 
                      name="niveau" 
                      required 
                      onChange={handleChange} 
                      value={formData.niveau} 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    >
                      <option value="">Sélectionner le niveau</option>
                      <option value="I">Niveau I</option>
                      <option value="II">Niveau II</option>
                      <option value="III">Niveau III</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">
                      Classe <span className="text-red-500">*</span>
                    </label>
                    <select 
                      name="classe" 
                      required 
                      onChange={handleChange} 
                      value={formData.classe} 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    >
                      <option value="">Sélectionner la classe</option>
                      {classes.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.nomclass}
                        </option>
                      ))}
                    </select>
                    {loading && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Chargement des classes...
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Photo */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <Upload className="w-5 h-5 text-[#38bdf8]" />
                  <h3 className="text-lg font-semibold text-[#0a2540]">Photo de l'élève</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0a2540]">Photo</label>
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoChange}
                      className="focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                    />
                  </div>
                  
                  {photoPreview && (
                    <div className="flex items-center gap-4">
                      <img 
                        src={photoPreview} 
                        alt="Aperçu" 
                        className="w-24 h-24 rounded-lg object-cover border"
                      />
                      <div className="text-sm text-gray-600">
                        <p>Aperçu de la photo sélectionnée</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Aperçu */}
              {(formData.nom || formData.prenom || formData.classe) && (
                <div className="space-y-4 p-4 bg-[#f8fafc] rounded-xl border border-[#e0f2fe]">
                  <h4 className="font-medium text-[#0a2540] flex items-center gap-2">
                    <Hash className="w-4 h-4 text-[#38bdf8]" />
                    Aperçu de l'élève
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Nom complet:</span>
                      <p className="font-medium text-[#0a2540]">
                        {formData.prenom} {formData.nom}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Classe:</span>
                      <p className="font-medium text-[#0a2540]">
                        {selectedClasse ? selectedClasse.nomclass : "Non sélectionnée"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Parent:</span>
                      <p className="font-medium text-[#0a2540]">
                        {selectedParent ? `${selectedParent.prenom} ${selectedParent.nom}` : "Non sélectionné"}
                      </p>
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
                      <School className="h-4 w-4" />
                      Créer l'élève
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

export default AddStudent;
