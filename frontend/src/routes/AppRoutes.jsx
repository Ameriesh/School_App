import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import ListeEleve from "../pages/teacher/ListeEleve";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import Periodes from "../pages/admin/Periodes";
import Competences from "../pages/admin/Competences";
import SousCompetences from "../pages/admin/SousCompetences"; 
import AddSousCompetence from "../pages/admin/AddSousCompetence";
import AddCompetence from "../pages/admin/AddCompetences";
import AddPeriode from "../pages/admin/AddPeriode";
import ListeNotes from "../pages/teacher/ListeNotes";
export default function AppRoutes({ user, onLogin, onLogout }) {
  // Fonction de protection de route
  const ProtectedRoute = ({ children, requiredRole }) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }
    
    if (user.role !== requiredRole) {
      return <Navigate to="/" replace />;
    }
    
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Page d'accueil/login */}
        <Route
          path="/"
          element={
            !user ? (
              <Login onLogin={onLogin} />
            ) : user.role === "administrateur" ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/enseignant" replace />
            )
          }
        />

        {/* Dashboard admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="administrateur">
              <AdminDashboard onLogout={onLogout} />
            </ProtectedRoute>
          }
        />

        {/* Routes admin protégées */}
        <Route
          path="/enseignants"
          element={
            <ProtectedRoute requiredRole="administrateur">
              <Enseignants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/enseignants/ajouter"
          element={
            <ProtectedRoute requiredRole="administrateur">
              <AddTeacher />
            </ProtectedRoute>
          }
        />
        <Route
          path="/classes"
          element={
            <ProtectedRoute requiredRole="administrateur">
              <Classes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/classes/add"
          element={
            <ProtectedRoute requiredRole="administrateur">
              <AddClasse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/eleves"
          element={
            <ProtectedRoute requiredRole="administrateur">
              <Eleves />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/eleves/add"
          element={
            <ProtectedRoute requiredRole="administrateur">
              <AddStudent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parents"
          element={
            <ProtectedRoute requiredRole="administrateur">
              <Parents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/parents/add"
          element={
            <ProtectedRoute requiredRole="administrateur">
              <AddParent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/periodes"
          element={
            <ProtectedRoute requiredRole="administrateur">
              <Periodes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/periodes/add"
          element={
            <ProtectedRoute requiredRole="administrateur">
              <AddPeriode />
            </ProtectedRoute>
          }
        />
        <Route
          path="/competences"
          element={
            <ProtectedRoute requiredRole="administrateur">
              <Competences />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/competences/add"
          element={
            <ProtectedRoute requiredRole="administrateur">
              <AddCompetence />
            </ProtectedRoute>
          }
        />
        <Route
          path="/souscompetences"
          element={
            <ProtectedRoute requiredRole="administrateur">
              <SousCompetences />
            </ProtectedRoute>
          }
        />
         <Route
          path="/admin/sous-competences/add"
          element={
            <ProtectedRoute requiredRole="administrateur">
              <AddSousCompetence />
            </ProtectedRoute>
          }
        />

        {/* Dashboard enseignant */}
        <Route
          path="/enseignant"
          element={
            <ProtectedRoute requiredRole="enseignant">
              <AdminDashboard onLogout={onLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/enseignant/dashboard"
          element={
            <ProtectedRoute requiredRole="enseignant">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/enseignants/liste"
          element={
            <ProtectedRoute requiredRole="enseignant">
              <ListeEleve />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <ProtectedRoute requiredRole="enseignant">
              <ListeNotes />
            </ProtectedRoute>
          }
        />

        {/* Fallback - redirige vers accueil */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}