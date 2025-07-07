import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../services/firebase'
import { Button } from "@/components/ui/button"
export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "administrateur",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Authentification Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Vérifie que le rôle est administrateur (plus tard tu peux vérifier dans Firestore)
      if (formData.role !== "administrateur") {
        setError("Seuls les administrateurs peuvent se connecter ici.");
        setLoading(false);
        return;
      }

      // Connexion réussie, on remonte l’info à App.jsx
      onLogin(formData.email, formData.role);
    } catch (err) {
      setError("Erreur d’authentification : " + err.message);
      setLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full bg-gray-50 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-black mb-6 text-center">Connexion</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-200 text-red-800 rounded">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007ACC]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-1 font-medium">Mot de passe</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007ACC]"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-gray-700 mb-1 font-medium">Rôle</label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007ACC]"
            >
              <option value="administrateur">Administrateur</option>
              <option value="enseignant">Enseignant</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#007ACC] text-white font-semibold rounded-md hover:bg-[#005A9E] transition-colors duration-300 disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
