import React from "react";
import { useState } from "react";

function Register() {
 const [formData, setFormData] = useState({
    nom: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Ici tu ajoutes la logique d'inscription (Firebase ou API)
    console.log("Inscription", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full bg-gray-50 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-black mb-6 text-center">Créer un compte</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="nom" className="block text-gray-700 mb-1 font-medium">Nom complet</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007ACC]"
              placeholder="Ton nom complet"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1 font-medium">Adresse email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007ACC]"
              placeholder="exemple@exemple.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-1 font-medium">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007ACC]"
              placeholder="********"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 mb-1 font-medium">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007ACC]"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#007ACC] text-white font-semibold rounded-md hover:bg-[#005A9E] transition-colors duration-300"
          >
            S’inscrire
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register;