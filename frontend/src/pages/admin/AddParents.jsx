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
        navigate("/parents");
      } else {
        const errorData = await res.json();
        alert("Erreur lors de l'ajout : " + (errorData.message || res.statusText));
      }
    } catch (err) {
      alert("Erreur réseau, réessayez plus tard.");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
        <Card className="w-full max-w-2xl mb-6 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-extrabold text-[#38bdf8] text-center">Ajouter un Parent d'élève</CardTitle>
          </CardHeader>
        </Card>
        <Card className="w-full max-w-2xl shadow-lg rounded-2xl">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Nom du responsable légal 1</label>
                <Input name="nom1" placeholder="Nom du responsable légal 1" required onChange={handleChange} />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Prénom du responsable légal 1</label>
                <Input name="prenom1" placeholder="Prénom du responsable légal 1" required onChange={handleChange} />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Nom du responsable légal 2</label>
                <Input name="nom2" placeholder="Nom du responsable légal 2" onChange={handleChange} />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Prénom du responsable légal 2</label>
                <Input name="prenom2" placeholder="Prénom du responsable légal 2" onChange={handleChange} />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Profession du responsable légal 1</label>
                <Input name="proffesion1" placeholder="Profession du responsable légal 1" required onChange={handleChange} />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Profession du responsable légal 2</label>
                <Input name="proffesion2" placeholder="Profession du responsable légal 2" onChange={handleChange} />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Email du responsable légal 1</label>
                <Input name="email1" type="email" placeholder="Email du responsable légal 1" required onChange={handleChange} />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Email du responsable légal 2</label>
                <Input name="email2" type="email" placeholder="Email du responsable légal 2" onChange={handleChange} />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Téléphone du responsable légal 1</label>
                <Input name="telephone1" placeholder="Téléphone du responsable légal 1" required onChange={handleChange} />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Téléphone du responsable légal 2</label>
                <Input name="telephone2" placeholder="Téléphone du responsable légal 2" onChange={handleChange} />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Adresse du responsable légal 1</label>
                <Input name="adresse1" placeholder="Adresse du responsable légal 1" required onChange={handleChange} />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Adresse du responsable légal 2</label>
                <Input name="adresse2" placeholder="Adresse du responsable légal 2" onChange={handleChange} />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Photo du responsable légal 1</label>
                <Input name="photo1" type="file" accept="image/*" required onChange={handleChange} />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Photo du responsable légal 2</label>
                <Input name="photo2" type="file" accept="image/*" onChange={handleChange} />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Nom d'utilisateur</label>
                <Input name="name_user" placeholder="Nom d'utilisateur" required onChange={handleChange} />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#0a2540]">Mot de passe</label>
                <Input name="password" type="password" placeholder="Mot de passe" required onChange={handleChange} />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" onClick={() => navigate(-1)} className="rounded-lg">
                  Annuler
                </Button>
                <Button type="submit" className="bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-bold rounded-lg">Enregistrer</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default AddParent;
