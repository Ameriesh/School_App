import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AdminLayout from "../admin/AdminLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Loader2, 
  FileText, 
  Users, 
  Award, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Save,
  Calculator,
  Info,
  TrendingUp,
  BookOpen,
  Calendar,
  Plus,
  Minus
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { getAuthToken } from "@/lib/utils";

export default function AddNotes() {
  const navigate = useNavigate();
  const [periodes, setPeriodes] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [sousCompetences, setSousCompetences] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [elevesANoter, setElevesANoter] = useState([]);
  const [periodeId, setPeriodeId] = useState("");
  const [competenceId, setCompetenceId] = useState("");
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [maxNotes, setMaxNotes] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});

  // Charger les données initiales
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      const token = getAuthToken();

      try {
        const [periodesRes, competencesRes, elevesRes] = await Promise.all([
          fetch("http://localhost:5000/api/periodes", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/competences", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/eleves/enseignant", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const periodesData = await periodesRes.json();
        const competencesData = await competencesRes.json();
        const elevesData = await elevesRes.json();

        setPeriodes(periodesData.periodes || []);
        setCompetences(competencesData.competences || []);
        setEleves(elevesData.eleves || []);
      } catch (error) {
        toast.error("Impossible de charger les données initiales");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Charger les données quand période ou compétence change
  useEffect(() => {
    const fetchData = async () => {
      if (!periodeId || !competenceId || eleves.length === 0) {
        // Réinitialiser les données quand on change de sélection
        setSousCompetences([]);
        setElevesANoter([]);
        setNotes([]);
        setCurrentStep(1);
        setValidationErrors({});
        return;
      }

      setIsLoading(true);
      const token = getAuthToken();

      try {
        // Charger les sous-compétences avec les bonnes notes max
        const [sousCompRes, notesRes] = await Promise.all([
          fetch(
            `http://localhost:5000/api/souscompetences/byCompetence/${competenceId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          fetch(
            `http://localhost:5000/api/notes/existantes?periode=${periodeId}&competence=${competenceId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        ]);

        const sousCompData = await sousCompRes.json();
        const notesData = await notesRes.json();

        // Définir les notes maximales selon le type
        const maxNotesObj = {};
        sousCompData.sousCompetences.forEach((sc) => {
          let max = 20; // Par défaut
          const nom = sc.nom.toLowerCase();
          if (nom.includes("écrit") || nom.includes("ecrit")) max = 15;
          else if (nom.includes("savoir-être") || nom.includes("savoir-etre")) max = 3;
          else if (nom.includes("oral")) max = 12;
          maxNotesObj[sc._id] = max;
        });
        setMaxNotes(maxNotesObj);
        setSousCompetences(sousCompData.sousCompetences || []);

        // Filtrer les élèves déjà notés
        const elevesDejaNotes = notesData.notesExistantes || [];
        const elevesIdsDejaNotes = elevesDejaNotes.map(n => n.eleve._id || n.eleve);
        const elevesANoter = eleves.filter(e => !elevesIdsDejaNotes.includes(e._id));
        setElevesANoter(elevesANoter);

        // Initialiser les notes pour les élèves à noter
        const initialNotes = elevesANoter.flatMap(eleve => 
          sousCompData.sousCompetences.map(sc => ({
            eleve: eleve._id,
            sousCompetence: sc._id,
            note: "",
            statut: "new",
          }))
        );
        setNotes(initialNotes);

        // Passer à l'étape 2 si il y a des élèves à noter
        if (elevesANoter.length > 0) {
          setCurrentStep(2);
        } else {
          setCurrentStep(1);
        }

        // Réinitialiser les erreurs de validation
        setValidationErrors({});
      } catch (error) {
        toast.error("Erreur lors du chargement des données");
        // Réinitialiser en cas d'erreur
        setSousCompetences([]);
        setElevesANoter([]);
        setNotes([]);
        setCurrentStep(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [periodeId, competenceId, eleves]);

  const handleNoteChange = (eleveId, scId, value) => {
    setNotes(prev =>
      prev.map(n =>
        n.eleve === eleveId && n.sousCompetence === scId
          ? { ...n, note: value, statut: "edited" }
          : n
      )
    );

    // Effacer l'erreur de validation pour ce champ
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`${eleveId}-${scId}`];
      return newErrors;
    });
  };

  const handlePeriodeChange = (e) => {
    const newPeriodeId = e.target.value;
    setPeriodeId(newPeriodeId);
    // Réinitialiser la compétence et les données associées
    setCompetenceId("");
    setSousCompetences([]);
    setElevesANoter([]);
    setNotes([]);
    setCurrentStep(1);
    setValidationErrors({});
  };

  const handleCompetenceChange = (e) => {
    const newCompetenceId = e.target.value;
    setCompetenceId(newCompetenceId);
    // Réinitialiser les données associées
    setSousCompetences([]);
    setElevesANoter([]);
    setNotes([]);
    setCurrentStep(1);
    setValidationErrors({});
  };

  const validateNotes = () => {
    const errors = {};
    let hasNotes = false;

    // Vérifier qu'au moins une note est saisie
    notes.forEach(noteObj => {
      if (noteObj.note !== "") {
        hasNotes = true;
        const noteValue = parseFloat(noteObj.note);
        const maxNote = maxNotes[noteObj.sousCompetence] || 20;

        if (isNaN(noteValue)) {
          errors[`${noteObj.eleve}-${noteObj.sousCompetence}`] = "Note invalide";
        } else if (noteValue < 0 || noteValue > maxNote) {
          errors[`${noteObj.eleve}-${noteObj.sousCompetence}`] = `Entre 0 et ${maxNote}`;
        }
      }
    });

    if (!hasNotes) {
      toast.error("Veuillez saisir au moins une note");
      return false;
    }

    // Vérifier que toutes les sous-compétences sont notées pour les élèves sélectionnés
    const elevesAvecNotes = [...new Set(notes.filter(n => n.note !== "").map(n => n.eleve))];
    
    for (const eleveId of elevesAvecNotes) {
      const notesEleve = notes.filter(n => n.eleve === eleveId);
      const sousCompNotes = notesEleve.filter(n => n.note !== "");
      
      if (sousCompNotes.length !== sousCompetences.length) {
        const eleve = eleves.find(e => e._id === eleveId);
        toast.error(`Veuillez compléter toutes les notes pour ${eleve?.nom} ${eleve?.prenom}`);
        return false;
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateNotes()) return;

    setIsLoading(true);
    const token = getAuthToken();

    try {
      // Préparer les notes à envoyer (uniquement celles remplies)
      const notesToSubmit = notes.filter(n => n.note !== "");

      const res = await fetch("http://localhost:5000/api/notes/multiple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          periode: periodeId,
          competence: competenceId,
          notes: notesToSubmit,
        }),
      });

      if (res.ok) {
        toast.success("Notes enregistrées avec succès");
        // Recharger les données pour mettre à jour la liste des élèves
        const notesRes = await fetch(
          `http://localhost:5000/api/notes/existantes?periode=${periodeId}&competence=${competenceId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const notesData = await notesRes.json();
        const elevesDejaNotes = notesData.notesExistantes || [];
        const elevesIdsDejaNotes = elevesDejaNotes.map(n => n.eleve._id || n.eleve);
        setElevesANoter(eleves.filter(e => !elevesIdsDejaNotes.includes(e._id)));
        // Réinitialiser les notes
        setNotes([]);
        setCurrentStep(1);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erreur lors de l'enregistrement");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (nom, prenom) => {
    return `${nom?.charAt(0) || ''}${prenom?.charAt(0) || ''}`.toUpperCase();
  };

  const getRandomColor = (nom) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-yellow-500', 'bg-red-500', 'bg-teal-500'
    ];
    const index = nom?.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getNoteTypeIcon = (sousComp) => {
    const nom = sousComp.nom.toLowerCase();
    if (nom.includes("oral")) return <TrendingUp className="h-4 w-4 text-blue-500" />;
    if (nom.includes("écrit") || nom.includes("ecrit")) return <FileText className="h-4 w-4 text-green-500" />;
    if (nom.includes("savoir-être") || nom.includes("savoir-etre")) return <Award className="h-4 w-4 text-purple-500" />;
    return <Calculator className="h-4 w-4 text-gray-500" />;
  };

  if (!isLoading && eleves.length === 0) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <p className="text-lg font-semibold text-gray-700">Aucun élève trouvé. Il est possible qu'aucune classe ne vous soit assignée. Contactez l'administrateur si besoin.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        {/* En-tête */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Retour</span>
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
              Ajouter des Notes
                  </h1>
                  <p className="mt-2 text-gray-600">
                    Saisissez les notes de vos élèves pour cette période
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                <Info className="h-4 w-4" />
                <span>Étape {currentStep}/2</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Indicateur de progression */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className="font-medium">Sélection</span>
              </div>
              <div className="w-16 h-1 bg-gray-200 rounded">
                <div className={`h-full bg-blue-600 rounded transition-all duration-500 ${currentStep >= 2 ? 'w-full' : 'w-0'}`}></div>
              </div>
              <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className="font-medium">Saisie</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Étape 1: Sélection de la période et compétence */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Étape 1: Sélection de la période et compétence
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">
                      Période (UA)
                    </label>
                    <select
                      value={periodeId}
                      onChange={handlePeriodeChange}
                      className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                      disabled={isLoading}
                    >
                      <option value="">-- Choisir une période --</option>
                      {periodes.map((p) => (
                        <option key={p._id} value={p._id}>
                          UA{p.ua} - {p.mois} (Trimestre {p.trimestre})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">
                      Compétence
                    </label>
                    <select
                      value={competenceId}
                      onChange={handleCompetenceChange}
                      className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                      disabled={isLoading || !periodeId}
                    >
                      <option value="">-- Choisir une compétence --</option>
                      {competences.map((comp) => (
                        <option key={comp._id} value={comp._id}>
                          {comp.code} - {comp.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {periodeId && competenceId && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 text-blue-700">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Configuration sélectionnée</span>
                    </div>
                    <p className="text-sm text-blue-600 mt-1">
                      Prêt à saisir les notes pour cette période et compétence
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Étape 2: Saisie des notes */}
            {currentStep >= 2 && sousCompetences.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-green-600" />
                    Étape 2: Saisie des notes
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {elevesANoter.length} élève{elevesANoter.length > 1 ? 's' : ''} à noter
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Informations sur les types de notes */}
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-gray-900 mb-3">Types de notes :</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">Oral: 12 points max</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Écrit: 15 points max</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Award className="h-4 w-4 text-purple-500" />
                            <span className="text-sm">Savoir-être: 3 points max</span>
                          </div>
                        </div>
                      </div>

                      {/* Tableau des notes */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                              <th className="border border-blue-500 p-3 text-left">Élève</th>
                            {sousCompetences.map((sc) => (
                                <th key={sc._id} className="border border-blue-500 p-3 text-center">
                                  <div className="flex items-center justify-center space-x-1">
                                    {getNoteTypeIcon(sc)}
                                    <span className="text-sm">{sc.nom}</span>
                                  </div>
                                  <div className="text-xs opacity-90">
                                  (Max: {maxNotes[sc._id]} pts)
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {elevesANoter.map((eleve) => (
                              <tr key={eleve._id} className="hover:bg-gray-50 transition-colors">
                                <td className="border border-gray-200 p-3">
                                  <div className="flex items-center space-x-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${getRandomColor(eleve.nom)}`}>
                                      {getInitials(eleve.nom, eleve.prenom)}
                                    </div>
                                    <div>
                                      <div className="font-semibold text-gray-900">
                                {eleve.nom} {eleve.prenom}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {eleve.classe?.nomclass || "Classe non définie"}
                                      </div>
                                    </div>
                                  </div>
                              </td>
                              {sousCompetences.map((sc) => (
                                  <td key={sc._id} className="border border-gray-200 p-3">
                                    <div className="flex items-center space-x-2">
                                  <Input
                                    type="number"
                                        className={`w-20 text-center ${validationErrors[`${eleve._id}-${sc._id}`] ? 'border-red-500' : ''}`}
                                    value={
                                      notes.find(
                                        n => n.eleve === eleve._id && n.sousCompetence === sc._id
                                      )?.note || ""
                                    }
                                    onChange={(e) =>
                                      handleNoteChange(eleve._id, sc._id, e.target.value)
                                    }
                                    min={0}
                                    max={maxNotes[sc._id]}
                                    step="0.5"
                                    disabled={isLoading}
                                        placeholder="0"
                                      />
                                      <span className="text-xs text-gray-500">/ {maxNotes[sc._id]}</span>
                                    </div>
                                    {validationErrors[`${eleve._id}-${sc._id}`] && (
                                      <div className="text-xs text-red-500 mt-1">
                                        {validationErrors[`${eleve._id}-${sc._id}`]}
                                      </div>
                                    )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                      {/* Message si tous les élèves sont déjà notés */}
                      {elevesANoter.length === 0 && (
                        <div className="text-center py-8">
                          <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Tous les élèves ont déjà une note
                          </h3>
                          <p className="text-gray-500">
                            Tous les élèves ont déjà une note pour cette compétence et cette période.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Boutons d'action */}
            {currentStep >= 2 && (
              <div className="flex justify-end space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    disabled={isLoading}
                  className="flex items-center space-x-2"
                  >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Annuler</span>
                  </Button>
                  <Button
                    type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center space-x-2"
                    disabled={isLoading || elevesANoter.length === 0}
                  >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>Enregistrer les Notes</span>
                  </Button>
                </div>
            )}
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}