// src/pages/parent/ParentLayout.jsx
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Navbar from "./NavBar";
import Footer from "./Footer";

export default function ParentLayout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-[#0a2540]">
      {/* Navbar */}
      
        <Navbar />
      {/* Page content */}
      <main className="flex-grow p-6 flex justify-center items-center">{children}</main>

      {/* Footer */}
        <Footer />
    
        {/* Optional: Back to top link */}
    </div>
  );
}
