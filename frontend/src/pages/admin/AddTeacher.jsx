import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AdminLayout from "./AdminLayout";
import { useState } from "react";

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

  const form = new FormData();
  for (let key in formData) {
    if (key === "photo" && formData.photo) {
      form.append("photo", formData.photo);
    } else {
      form.append(key, formData[key]);
    }
  }

  try {
    const res = await fetch("http://localhost:5000/api/teachers", {
      method: "POST",
      body: form,
    });

    if (res.ok) {
      navigate("/enseignants");
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
        <Card className="w-full max-w-4xl mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Add Teacher</CardTitle>
          </CardHeader>
        </Card>

        <Card className="w-full max-w-4xl flex-grow">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="nom" placeholder="Nom" required onChange={handleChange} />
              <Input name="prenom" placeholder="Prénom" required onChange={handleChange} />
              <Input name="designation" placeholder="Désignation" required onChange={handleChange} />
              <Input name="dateNaissance" type="date" required onChange={handleChange} />
              <Input name="sexe" placeholder="Sexe" required onChange={handleChange} />
              <Input name="email" type="email" placeholder="Email" required onChange={handleChange} />
              <Input name="adresse" placeholder="Adresse" required onChange={handleChange} />
              <Input name="telephone" placeholder="Téléphone" required onChange={handleChange} />
              <Input name="dateEntree" type="date" required onChange={handleChange} />
              <Input name="photo" type="file" accept="image/*" required onChange={handleChange} />
              <Input name="password" type="password" placeholder="Mot de passe" required onChange={handleChange} />

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>Annuler</Button>
                <Button type="submit">Enregistrer</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default AddTeacher;
