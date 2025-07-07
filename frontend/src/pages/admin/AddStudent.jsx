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

  // États pour listes dynamiques
  const [parents, setParents] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    // Charger parents
    fetch("http://localhost:5000/api/parents")
      .then(res => res.json())
      .then(data => setParents(data || []))
      .catch(err => console.error("Erreur chargement parents:", err));

    // Charger classes
    fetch("http://localhost:5000/api/classes")
      .then(res => res.json())
      .then(data => setClasses(data.classes || []))
      .catch(err => console.error("Erreur chargement classes:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulaire élève :", formData);
    // Ici envoie au backend puis navigate après succès
    navigate("/eleves");
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
        <Card className="w-full max-w-4xl mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Ajouter un élève</CardTitle>
          </CardHeader>
        </Card>

        <Card className="w-full max-w-4xl">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <Input name="nom" placeholder="Noms" required onChange={handleChange} />
              <Input name="prenom" placeholder="Prénoms" required onChange={handleChange} />
              
              <select name="parentId" className="w-full border p-2 rounded" required onChange={handleChange} value={formData.parentId}>
                <option value="">Sélectionner un parent</option>
                {parents.map(parent => (
                  <option key={parent._id} value={parent._id}>
                    {parent.nom1} {parent.prenom1} {/* adapte selon ton modèle */}
                  </option>
                ))}
              </select>

              <Input name="matricule" placeholder="Matricule" onChange={handleChange} />
              <Input name="dateNaissance" type="date" required onChange={handleChange} />
              
              <select name="sexe" className="w-full border p-2 rounded" required onChange={handleChange} value={formData.sexe}>
                <option value="">Sexe</option>
                <option value="Masculin">Masculin</option>
                <option value="Féminin">Féminin</option>
              </select>
              
              <select name="groupeSanguin" className="w-full border p-2 rounded" onChange={handleChange} value={formData.groupeSanguin}>
                <option value="">Groupe sanguin</option>
                <option value="A+">A+</option>
                <option value="O+">O+</option>
                <option value="B+">B+</option>
                <option value="AB+">AB+</option>
              </select>
              
              <Input name="email" type="email" placeholder="Email" onChange={handleChange} />
              <Input name="telephone" placeholder="Téléphone" required onChange={handleChange} />
              <Input name="lieuNaissance" placeholder="Lieu de naissance" onChange={handleChange} />
              <Input name="adresse" placeholder="Adresse" required onChange={handleChange} />
              <Input name="ville" placeholder="Ville" onChange={handleChange} />
              
              <select name="pays" className="w-full border p-2 rounded" onChange={handleChange} value={formData.pays}>
                <option value="">Pays</option>
                <option value="Cameroun">Cameroun</option>
                <option value="Tchad">Tchad</option>
              </select>
              
              <Input name="nationalite" placeholder="Nationalité" onChange={handleChange} />
              <Input name="langue" placeholder="Langue parlée" onChange={handleChange} />
              
              <select name="niveau" className="w-full border p-2 rounded" required onChange={handleChange} value={formData.niveau}>
                <option value="">Niveau</option>
                <option value="I">I</option>
                <option value="II">II</option>
                <option value="III">III</option>
              </select>
              
              <select name="classe" className="w-full border p-2 rounded" required onChange={handleChange} value={formData.classe}>
                <option value="">Classe</option>
                {classes.map(c => (
                  <option key={c._id} value={c._id}>
                    {c.nomclass} {/* ou c.nom, selon ta structure */}
                  </option>
                ))}
              </select>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Annuler
                </Button>
                <Button type="submit">Enregistrer</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default AddStudent;
