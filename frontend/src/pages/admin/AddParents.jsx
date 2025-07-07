import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AdminLayout from "./AdminLayout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function AddParent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom1: "",
    nom2: "",
    prenom1: "",
    prenom2: "",
    proffesion1: "",
    proffesion2: "",
    email1: "",
    email2: "",
    telephone1: "",
    telephone2: "",
    adresse1: "",
    adresse2: "",
    photo1: null,
    photo2: null,
    name_user: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        navigate("/parents"); // adapte cette route à ta structure
      } else {
        const errorData = await res.json();
        console.error("Erreur lors de l'ajout", errorData);
        alert("Erreur lors de l'ajout : " + (errorData.message || res.statusText));
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau, réessayez plus tard.");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
        {/* Titre */}
        <Card className="w-full max-w-4xl mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Ajouter un Parent d'élève</CardTitle>
          </CardHeader>
        </Card>

        {/* Formulaire */}
        <Card className="w-full max-w-4xl">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <Input name="nom1" placeholder="Nom du responsable légal 1" required onChange={handleChange} />
              <Input name="prenom1" placeholder="Prénom du responsable légal 1" required onChange={handleChange} />
              <Input name="nom2" placeholder="Nom du responsable légal 2" onChange={handleChange} />
              <Input name="prenom2" placeholder="Prénom du responsable légal 2" onChange={handleChange} />
              <Input name="proffesion1" placeholder="Profession du responsable légal 1" required onChange={handleChange} />
              <Input name="proffesion2" placeholder="Profession du responsable légal 2" onChange={handleChange} />
              <Input name="email1" type="email" placeholder="Email du responsable légal 1" required onChange={handleChange} />
              <Input name="email2" type="email" placeholder="Email du responsable légal 2" onChange={handleChange} />
              <Input name="telephone1" placeholder="Téléphone du responsable légal 1" required onChange={handleChange} />
              <Input name="telephone2" placeholder="Téléphone du responsable légal 2" onChange={handleChange} />
              <Input name="adresse1" placeholder="Adresse du responsable légal 1" required onChange={handleChange} />
              <Input name="adresse2" placeholder="Adresse du responsable légal 2" onChange={handleChange} />
              <Input name="photo1" type="file" accept="image/*" required onChange={handleChange} />
              <Input name="photo2" type="file" accept="image/*" onChange={handleChange} />
              <Input name="name_user" placeholder="Nom d'utilisateur" required onChange={handleChange} />
              <Input name="password" type="password" placeholder="Mot de passe" required onChange={handleChange} />

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

export default AddParent;
