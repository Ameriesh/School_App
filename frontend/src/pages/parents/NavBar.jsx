// src/components/parents/Navbar.jsx
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-[#38bdf8] text-2xl font-bold">
          SchoolApp
        </Link>

        {/* Navigation links */}
        <div className="flex space-x-6">
          <Link
            to="/loginp"
            className={`text-sm font-medium ${
              isActive("/loginp") ? "text-[#0ea5e9]" : "text-gray-700"
            } hover:text-[#38bdf8]`}
          >
            Connexion
          </Link>
          <Link
            to="/registerp"
            className={`text-sm font-medium ${
              isActive("/registerp") ? "text-[#0ea5e9]" : "text-gray-700"
            } hover:text-[#38bdf8]`}
          >
            Inscription
          </Link>
        </div>
      </div>
    </nav>
  );
}
