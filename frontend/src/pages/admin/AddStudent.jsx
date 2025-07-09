import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AdminLayout from "./AdminLayout";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

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
  const [parents, setParents] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/parents")
      .then((res) => res.json())
      .then((data) => setParents(data || []))
      .catch((err) => console.error("Erreur chargement parents:", err));
    fetch("http://localhost:5000/api/classes")
      .then((res) => res.json())
      .then((data) => setClasses(data.classes || []))
      .catch((err) => console.error("Erreur chargement classes:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        dataToSend.append(key, value);
      });
      if (photo) {
        dataToSend.append("photo", photo);
      }
      const response = await fetch("http://localhost:5000/api/eleves", {
        method: "POST",
        body: dataToSend,
      });
      if (!response.ok) {
        throw new Error("Erreur serveur");
      }
      await response.json();
      navigate("/admin/eleves");
    } catch (error) {
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };
  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
        <Card className="w-full max-w-2xl mb-6 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-extrabold text-indigo-600 text-center">Ajouter un élève</CardTitle>
          </CardHeader>
        </Card>
        <Card className="w-full max-w-2xl shadow-lg rounded-2xl">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4" encType="multipart/form-data">
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Noms</label>
                <Input name="nom" placeholder="Noms" required onChange={handleChange} />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Prénoms</label>
                <Input name="prenom" placeholder="Prénoms" required onChange={handleChange} />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Parent</label>
                <select name="parentId" required onChange={handleChange} value={formData.parentId} className="w-full border p-2 rounded">
                  <option value="">Sélectionner un parent</option>
                  {parents.map((parent) => (
                    <option key={parent._id} value={parent._id}>
                      {parent.nom1} {parent.prenom1}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Matricule</label>
                <Input name="matricule" placeholder="Matricule" onChange={handleChange} />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Date de naissance</label>
                <Input name="dateNaissance" type="date" required onChange={handleChange} />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Sexe</label>
                <select name="sexe" required onChange={handleChange} value={formData.sexe} className="w-full border p-2 rounded">
                  <option value="">Sexe</option>
                  <option value="Masculin">Masculin</option>
                  <option value="Féminin">Féminin</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Groupe sanguin</label>
                <select name="groupeSanguin" onChange={handleChange} value={formData.groupeSanguin} className="w-full border p-2 rounded">
                  <option value="">Groupe sanguin</option>
                  <option value="A+">A+</option>
                  <option value="O+">O+</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Email</label>
                <Input name="email" type="email" placeholder="Email" onChange={handleChange} />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Téléphone</label>
                <Input name="telephone" placeholder="Téléphone" required onChange={handleChange} />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Lieu de naissance</label>
                <Input name="lieuNaissance" placeholder="Lieu de naissance" onChange={handleChange} />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Adresse</label>
                <Input name="adresse" placeholder="Adresse" required onChange={handleChange} />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Ville</label>
                <Input name="ville" placeholder="Ville" onChange={handleChange} />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Pays</label>
                <select name="pays" onChange={handleChange} value={formData.pays} className="w-full border p-2 rounded">
                  <option value="">Pays</option>
                  <option value="Cameroun">Cameroun</option>
                  <option value="Tchad">Tchad</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Nationalité</label>
                <Input name="nationalite" placeholder="Nationalité" onChange={handleChange} />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Langue parlée</label>
                <Input name="langue" placeholder="Langue parlée" onChange={handleChange} />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Niveau</label>
                <select name="niveau" required onChange={handleChange} value={formData.niveau} className="w-full border p-2 rounded">
                  <option value="">Niveau</option>
                  <option value="I">I</option>
                  <option value="II">II</option>
                  <option value="III">III</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Classe</label>
                <select name="classe" required onChange={handleChange} value={formData.classe} className="w-full border p-2 rounded">
                  <option value="">Classe</option>
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.nomclass}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Photo de l'élève</label>
                <Input type="file" accept="image/*" onChange={handlePhotoChange} />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" onClick={() => navigate(-1)} className="rounded-lg bg-gray-700 text-white hover:bg-gray-800">Annuler</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg">Enregistrer</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default AddStudent;
