import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { 
  CheckCircle, 
  Mail, 
  Clock, 
  Users, 
  ArrowLeft,
  Home,
  Phone,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ConfirmationDemande() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <Toaster position="top-right" richColors />
      
      {/* Logo/En-tête */}
      <div className="absolute top-8 left-8">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">SchoolApp</h1>
            <p className="text-xs text-gray-500">Espace Parent</p>
          </div>
        </div>
      </div>

      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Demande envoyée avec succès !
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Votre demande d'accès à l'espace parent a été enregistrée
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Message de confirmation */}
          <div className="text-center">
            <p className="text-gray-700 text-lg leading-relaxed">
              Nous avons bien reçu votre demande d'inscription pour l'espace parent de SchoolApp.
            </p>
          </div>

          {/* Étapes du processus */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Prochaines étapes
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900">Vérification des informations</p>
                  <p className="text-sm text-gray-600">Nous vérifions que toutes vos informations sont correctes</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900">Validation par l'administrateur</p>
                  <p className="text-sm text-gray-600">L'équipe administrative examine votre demande</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900">Création de votre compte</p>
                  <p className="text-sm text-gray-600">Votre espace parent sera créé automatiquement</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  4
                </div>
                <div>
                  <p className="font-medium text-gray-900">Réception de vos identifiants</p>
                  <p className="text-sm text-gray-600">Vous recevrez un email avec vos codes d'accès</p>
                </div>
              </div>
            </div>
          </div>

          {/* Informations importantes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2 flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Important
            </h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Vérifiez régulièrement votre boîte email</li>
              <li>• Vérifiez également vos spams</li>
              <li>• Le délai de traitement est généralement de 24-48h</li>
              <li>• Assurez-vous que vos enfants sont bien inscrits dans l'établissement</li>
            </ul>
          </div>

          {/* Fonctionnalités disponibles */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Ce que vous pourrez faire une fois connecté
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Consulter les notes de vos enfants</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Suivre leur progression scolaire</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Communiquer avec les enseignants</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Recevoir les bulletins de notes</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Consulter l'emploi du temps</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Accéder aux informations importantes</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              Besoin d'aide ?
            </h4>
            <p className="text-sm text-blue-800 mb-2">
              Si vous avez des questions ou si vous n'avez pas reçu de réponse dans les 48h :
            </p>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Contactez l'établissement directement</p>
              <p>• Vérifiez que votre email est correct</p>
              <p>• Assurez-vous que vos enfants sont bien inscrits</p>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              variant="outline"
              onClick={() => navigate('/parent/register')}
              className="flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Nouvelle demande
            </Button>
            
            <Button
              onClick={() => navigate('/')}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold"
            >
              <Home className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
          </div>

          {/* Informations supplémentaires */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Merci de votre confiance. L'équipe SchoolApp
            </p>
            <div className="flex items-center justify-center space-x-4 mt-2 text-xs text-gray-400">
              <span>© 2024 SchoolApp</span>
              <span>•</span>
              <span>Tous droits réservés</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 