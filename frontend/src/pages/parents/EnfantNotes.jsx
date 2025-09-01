import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ParentLayoutDash from "./dash/ParentLayoutDash";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { Loader2, Search, Star } from "lucide-react";
import { getAuthToken } from "@/lib/utils";
import { fetchAbsencesForParent } from "@/services/absences";

export default function EnfantNotes() {
  const { id } = useParams();
  const [periodes, setPeriodes] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [selectedPeriode, setSelectedPeriode] = useState('');
  const [selectedCompetence, setSelectedCompetence] = useState('');
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sousCompetences, setSousCompetences] = useState([]);
  const [enfant, setEnfant] = useState(null);
  const [moyenneGenerale, setMoyenneGenerale] = useState(null);
  const [moyenneMeilleur, setMoyenneMeilleur] = useState(null);
  const [absences, setAbsences] = useState([]);
  const [loadingAbsences, setLoadingAbsences] = useState(false);
  const [rangMoyenne, setRangMoyenne] = useState(null);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const token = getAuthToken('parent');
        const [periodesRes, competencesRes, enfantRes] = await Promise.all([
          fetch('http://localhost:5000/api/periodes', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/competences', { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`http://localhost:5000/api/eleves/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        const periodesData = await periodesRes.json();
        const competencesData = await competencesRes.json();
        const enfantData = await enfantRes.json();
        setPeriodes(periodesData.periodes || []);
        setCompetences(competencesData.competences || []);
        setEnfant(enfantData.eleve);
        // Charger les absences de l'enfant
        setLoadingAbsences(true);
        const absData = await fetchAbsencesForParent(token, id);
        setAbsences(absData.absences || []);
        // Charger le rang et la moyenne globale
        const rangRes = await fetch(`http://localhost:5000/api/notes/parent/notes/rang-moyenne?enfantId=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (rangRes.ok) {
          const rangData = await rangRes.json();
          setRangMoyenne(rangData);
        }
      } catch (error) {
        toast.error("Erreur lors du chargement des données initiales");
      } finally {
        setLoadingAbsences(false);
      }
    };
    fetchInitial();
  }, [id]);

  const loadNotes = async () => {
    if (!selectedPeriode || !selectedCompetence) return;
    setIsLoading(true);
    try {
      const token = getAuthToken('parent');
      // Récupérer les sous-compétences
      const sousCompRes = await fetch(`http://localhost:5000/api/souscompetences/byCompetence/${selectedCompetence}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sousCompData = await sousCompRes.json();
      setSousCompetences(sousCompData.sousCompetences || []);
      // Récupérer les notes de l'enfant via la route dédiée
      const res = await fetch(`http://localhost:5000/api/parent/notes?enfantId=${id}&periode=${selectedPeriode}&competence=${selectedCompetence}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotes(data.notes || []);
      // Récupérer les stats de la classe (moyenne générale et meilleure moyenne)
      const statsData = await statsRes.json();
      setMoyenneGenerale(statsData.moyenneGenerale ?? null);
      setMoyenneMeilleur(statsData.moyenneMeilleur ?? null);
    } catch (error) {
      toast.error('Erreur lors du chargement des notes');
    } finally {
      setIsLoading(false);
    }
  };

  // Regrouper les notes par sous-compétence
  const notesBySousComp = {};
  notes.forEach(note => {
    if (note.sousCompetence?._id) {
      notesBySousComp[note.sousCompetence._id] = note.note;
    }
  });

  return (
    <ParentLayoutDash>
      <Toaster position="top-right" richColors />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-500" />
              Notes de {enfant ? `${enfant.nom} ${enfant.prenom}` : '...'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label className="block mb-2 font-semibold text-gray-700">Période</label>
                <select
                  value={selectedPeriode}
                  onChange={e => setSelectedPeriode(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option value="">-- Choisir une période --</option>
                  {periodes.map(periode => (
                    <option key={periode._id} value={periode._id}>
                      UA{periode.ua} - {periode.mois} (Trimestre {periode.trimestre})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block mb-2 font-semibold text-gray-700">Compétence</label>
                <select
                  value={selectedCompetence}
                  onChange={e => setSelectedCompetence(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option value="">-- Choisir une compétence --</option>
                  {competences.map(comp => (
                    <option key={comp._id} value={comp._id}>{comp.nom}</option>
                  ))}
                </select>
              </div>
              <Button
                onClick={loadNotes}
                disabled={!selectedPeriode || !selectedCompetence || isLoading}
                className="bg-blue-600 hover:bg-blue-700 mt-4 md:mt-0"
              >
                Afficher les notes
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-2" />
                <span>Chargement...</span>
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucune note trouvée pour cette période et cette compétence.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      {sousCompetences.map(sc => (
                        <th key={sc._id} className="p-3 border">{sc.nom}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {sousCompetences.map(sc => (
                        <td key={sc._id} className="p-3 border text-center font-semibold">
                          {notesBySousComp[sc._id] !== undefined ? notesBySousComp[sc._id] : '-'}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
                {/* Rang et moyenne globale de l'enfant */}
                {rangMoyenne && (
                  <div className="flex flex-col md:flex-row gap-4 mt-6">
                    <div className="flex-1 bg-yellow-50 rounded-lg p-4 text-center">
                      <span className="text-sm text-gray-500">Moyenne globale de l'enfant</span>
                      <div className="text-2xl font-bold text-yellow-700">{rangMoyenne.moyenne !== null && rangMoyenne.moyenne !== undefined ? Number(rangMoyenne.moyenne).toFixed(2) : '-'}</div>
                    </div>
                    <div className="flex-1 bg-purple-50 rounded-lg p-4 text-center">
                      <span className="text-sm text-gray-500">Rang de l'enfant dans la classe</span>
                      <div className="text-2xl font-bold text-purple-700">{rangMoyenne.rang ? `${rangMoyenne.rang} / ${rangMoyenne.effectif}` : '-'}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        {/* Bloc absences */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>
              Absences de {enfant ? `${enfant.nom} ${enfant.prenom}` : '...'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingAbsences ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-red-600 mr-2" />
                <span>Chargement des absences...</span>
              </div>
            ) : absences.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucune absence enregistrée pour cet enfant.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 border">Date</th>
                      <th className="p-3 border">Statut</th>
                      <th className="p-3 border">Motif</th>
                      <th className="p-3 border">Heures</th>
                      <th className="p-3 border">Enseignant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {absences.map(abs => (
                      <tr key={abs._id}>
                        <td className="p-3 border text-center">{new Date(abs.date).toLocaleDateString('fr-FR')}</td>
                        <td className="p-3 border text-center">{abs.statut}</td>
                        <td className="p-3 border text-center">{abs.motif}</td>
                        <td className="p-3 border text-center">{abs.heures}</td>
                        <td className="p-3 border text-center">{abs.enseignant ? `${abs.enseignant.prenom} ${abs.enseignant.nom}` : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 text-right text-sm text-gray-600">
                  Total absences : <span className="font-bold">{absences.length}</span>
                  {absences.length > 0 && (
                    <span> • Total heures : <span className="font-bold">{absences.reduce((acc, a) => acc + (a.heures || 0), 0)}</span></span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ParentLayoutDash>
  );
} 