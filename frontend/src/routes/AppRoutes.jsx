import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "../pages/auth/register";
import Login from "../pages/auth/login";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Enseignants from "../pages/admin/Enseignants";
import AddTeacher from "../pages/admin/AddTeacher";
import Classes from "../pages/admin/Classes";
import AddClasse from "../pages/admin/AddClasse";
import Eleves from "../pages/admin/Eleves";
import AddStudent from "../pages/admin/AddStudent";
import Parents from "../pages/admin/Parents";
import AddParent from "../pages/admin/AddParents";
export default function AppRoutes({ user, onLogin, onLogout }) {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page de login devient la page d’accueil */}
        <Route
          path="/"
          element={
            !user ? (
              <Login onLogin={onLogin} />
            ) : (
              <Navigate to="/admin" />
            )
          }
        />

        {/* Dashboard uniquement accessible à l’admin connecté */}
        <Route
          path="/admin"
          element={
            user && user.role === "administrateur" ? (
              <AdminDashboard onLogout={onLogout}/>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Si tu veux gérer la création de compte plus tard */}
        <Route path="/register" element={<Register />} />
        <Route
          path="/Enseignants"
          element={
            user && user.role === "administrateur" ? (
              <Enseignants />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
         <Route
          path="/eleves"
          element={
            user && user.role === "administrateur" ? (
              <Eleves />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/parents"
          element={
            user && user.role === "administrateur" ? (
              <Parents />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/classes"
          element={
            user && user.role === "administrateur" ? (
              <Classes />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      <Route
        path="/admin/enseignants/ajouter"
        element={
          user && user.role === "administrateur" ? (
            <AddTeacher />
          ) : (
            <Navigate to="/login" />    
          )
        }
      />
      <Route
        path="/admin/classes/add"
        element={
          user && user.role === "administrateur" ? (
            <AddClasse />
          ) : (
            <Navigate to="/login" />    
          )
        }
      />
      <Route
        path="/admin/eleves/add"
        element={
          user && user.role === "administrateur" ? (
            <AddStudent />
          ) : (
            <Navigate to="/login" />    
          )
        }
      />
      <Route
        path="/admin/parents/add"
        element={
          user && user.role === "administrateur" ? (
            <AddParent />
          ) : (
            <Navigate to="/login" />    
          )
        }
      />
      </Routes>
      
    </BrowserRouter>
  );
}
