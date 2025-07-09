import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getIdToken } from "firebase/auth";


export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "administrateur",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { email, password, role } = formData;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken(); // ⬅️ AJOUTER ICI
      localStorage.setItem("token", token);
      console.log("🔥 Firebase ID Token:", token); // 🔑 Affiche le token dans la console

      const userDocRef = doc(firestore, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        throw new Error("Profil utilisateur introuvable.");
      }
      const userData = userDocSnap.data();
      if (userData.role !== role) {
        throw new Error("Rôle sélectionné ne correspond pas à votre rôle.");
      }
      onLogin(email, role);
      if (role === "administrateur") {
        navigate("/admin/dashboard");
      } else if (role === "enseignant") {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError("Erreur : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a2540] px-4">
      <div className="max-w-md w-full bg-[#f4f4f4] p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-[#38bdf8] mb-6 text-center tracking-tight">Connexion</h2>
        {error && (
          <div className="mb-4 p-3 bg-rose-100 text-rose-700 rounded-lg border border-rose-200 text-center text-sm font-medium">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1 font-semibold">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-[#38bdf8] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm transition"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-1 font-semibold">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-[#38bdf8] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm transition"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-gray-700 mb-1 font-semibold">
              Rôle
            </label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#38bdf8] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm transition"
            >
              <option value="administrateur">Administrateur</option>
              <option value="enseignant">Enseignant</option>
            </select>
          </div>
          <Button
            type="submit"
            className="w-full bg-[#38bdf8] hover:bg-[#38bdf6] text-white font-bold rounded-lg shadow-lg py-2 text-lg transition"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </div>
    </div>
  );
}
