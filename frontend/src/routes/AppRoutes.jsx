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
import AddNotes from "../pages/teacher/AddNotes";
import ListeNotes from "../pages/teacher/ListeNotes";
import RegisterParent from "../pages/parents/RegisterParent";
import LoginParent from "../pages/parents/LoginParent";
import ParentDashboard from "../pages/parents/dash/ParentDashboard";
import ParentLayoutDash from "../pages/parents/dash/ParentLayoutDash";
import DemandesInscription from "../pages/admin/DemandesInscription";
import DemandesInscriptionEnfants from "../pages/admin/DemandesInscriptionEnfants";
import ConfirmationDemande from "../pages/parents/ConfirmationDemande";
import InscrireEnfant from "../pages/parents/InscrireEnfant";
import ParentRedirect from "../pages/parents/ParentRedirect";
import Enfants from "../pages/parents/enfants";
import EnfantNotes from "../pages/parents/EnfantNotes";
import Absences from "../pages/teacher/Absences";
import Bulletin from "../pages/teacher/Bulletin";

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
            ) : user.role === "parent" ? (
              <Navigate to="/parent/dashboard" replace />
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

        {/* Demandes d'inscription - Admin */}
        <Route
          path="/admin/demandes-inscription"
          element={
            <ProtectedRoute requiredRole="administrateur">
              <DemandesInscription />
            </ProtectedRoute>
          }
        />

        {/* Demandes d'inscription d'enfants - Admin */}
        <Route
          path="/admin/demandes-inscription-enfants"
          element={
            <ProtectedRoute requiredRole="administrateur">
              <DemandesInscriptionEnfants />
            </ProtectedRoute>
          }
        />

        {/* Dashboard enseignant */}
        <Route
          path="/enseignant"
          element={
            <ProtectedRoute requiredRole="enseignant">
              <TeacherDashboard onLogout={onLogout} />
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
          path="/enseignant/eleves"
          element={
            <ProtectedRoute requiredRole="enseignant">
              <ListeEleve />
            </ProtectedRoute>
          }
        />
        <Route
          path="/enseignant/notes/add"
          element={
            <ProtectedRoute requiredRole="enseignant">
              <AddNotes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/enseignant/notes"
          element={
            <ProtectedRoute requiredRole="enseignant">
              <ListeNotes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/enseignant/absences"
          element={
            <ProtectedRoute requiredRole="enseignant">
              <Absences />
            </ProtectedRoute>
          }
        />
         <Route
          path="/enseignant/bulletin"
          element={
            <ProtectedRoute requiredRole="enseignant">
              <Bulletin />
            </ProtectedRoute>
          }
        />
        

        {/* Routes publiques pour les parents */}
        <Route path="/parent/register" element={<RegisterParent />} />
        <Route path="/parent/confirmation" element={<ConfirmationDemande />} />
        <Route path="/parent/login" element={<LoginParent />} />
        <Route path="/parent/redirect" element={<ParentRedirect />} />
        <Route
          path="/parent/enfants"
          element={<Enfants />}
        />
        <Route
          path="/parent/enfant/:id/notes"
          element={<EnfantNotes />}
        />

        {/* Dashboard parent */}
        <Route
          path="/parent/dashboard"
          element={
            <ProtectedRoute requiredRole="parent">
              <ParentLayoutDash onLogout={onLogout}>
                <ParentDashboard />
              </ParentLayoutDash>
            </ProtectedRoute>
          }
        />

        {/* Routes pour les parents connectés */}
        <Route
          path="/parent/inscrire-enfant"
          element={
            <ProtectedRoute requiredRole="parent">
              <InscrireEnfant />
            </ProtectedRoute>
          }
        />

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}