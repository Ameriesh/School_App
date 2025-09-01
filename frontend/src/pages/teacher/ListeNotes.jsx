import { useState, useEffect } from 'react';
import AdminLayout from "../admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { Download, Search, Star, Award } from "lucide-react";
import { getAuthToken } from "@/lib/utils";

export default function ListeNotes() {
  const [periodes, setPeriodes] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [selectedPeriode, setSelectedPeriode] = useState('');
  const [selectedCompetence, setSelectedCompetence] = useState('');
  const [selectedEleve, setSelectedEleve] = useState('');
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sousCompetences, setSousCompetences] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Ajout utilitaire pour le barème par sous-compétence
  const BAREMES = {
    'Oral': 12,
    'Écrit': 15,
    'Savoir-être': 3
  };

  function getBareme(sousCompNom) {
    if (!sousCompNom) return 20;
    if (sousCompNom.toLowerCase().includes('oral')) return 12;
    if (sousCompNom.toLowerCase().includes('écrit')) return 15;
    if (sousCompNom.toLowerCase().includes('savoir')) return 3;
    return 20;
  }

  useEffect(() => {
    const fetchPeriodesCompetencesEleves = async () => {
      try {
        const token = getAuthToken();
        const [periodesRes, competencesRes, elevesRes] = await Promise.all([
          fetch('http://localhost:5000/api/periodes', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:5000/api/competences', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:5000/api/eleves/enseignant', {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);
        const periodesData = await periodesRes.json();
        const competencesData = await competencesRes.json();
        const elevesData = await elevesRes.json();
        setPeriodes(periodesData.periodes || []);
        setCompetences(competencesData.competences || []);
        setEleves(elevesData.eleves || []);
      } catch (error) {
        toast.error('Erreur lors du chargement des périodes, compétences ou élèves');
      }
    };
    fetchPeriodesCompetencesEleves();
  }, []);

  const loadNotes = async () => {
    if (!selectedPeriode || !selectedCompetence) return;
    setIsLoading(true);
    try {
      const token = getAuthToken();
      // Récupérer les sous-compétences pour l'en-tête du tableau
      const sousCompRes = await fetch(`http://localhost:5000/api/souscompetences/byCompetence/${selectedCompetence}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sousCompData = await sousCompRes.json();
      setSousCompetences(sousCompData.sousCompetences || []);
      let notesData = [];
      if (selectedEleve) {
        // Utiliser la route dédiée enseignant/notes
        const res = await fetch(`http://localhost:5000/api/enseignant/notes?eleveId=${selectedEleve}&periode=${selectedPeriode}&competence=${selectedCompetence}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        notesData = data.notes || [];
      } else {
        // Affichage global (tous les élèves)
        const res = await fetch(`http://localhost:5000/api/notes/by-periode-competence?periode=${selectedPeriode}&competence=${selectedCompetence}`, {
          headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
        notesData = data.notes || [];
      }
      setNotes(notesData);
    } catch (error) {
      toast.error('Erreur lors du chargement des notes');
    } finally {
      setIsLoading(false);
    }
  };

  // Regrouper les notes par élève
  const notesParEleve = {};
  notes.forEach(note => {
    const eleveId = note.eleve?._id;
    if (!eleveId) return;
    if (!notesParEleve[eleveId]) {
      notesParEleve[eleveId] = {
        eleve: note.eleve,
        notes: {},
        total: 0
      };
    }
    notesParEleve[eleveId].notes[note.sousCompetence?._id] = note.note;
    notesParEleve[eleveId].total += Number(note.note) || 0;
  });

  // Appliquer la recherche
  const filteredEleves = Object.values(notesParEleve).filter(row => {
    const nom = row.eleve.nom?.toLowerCase() || '';
    const prenom = row.eleve.prenom?.toLowerCase() || '';
    return (
      nom.includes(searchTerm.toLowerCase()) ||
      prenom.includes(searchTerm.toLowerCase())
    );
  });

  // Moyenne générale
  const moyenneGenerale =
    filteredEleves.length > 0
      ? (
          filteredEleves.reduce((sum, row) => sum + row.total, 0) /
          filteredEleves.length
        ).toFixed(2)
      : 0;

  // Meilleur élève
  const meilleurEleve =
    filteredEleves.length > 0
      ? filteredEleves.reduce((best, curr) =>
          curr.total > best.total ? curr : best
        )
      : null;

  // Moyenne par sous-compétence
  const moyennesParSousComp = sousCompetences.map(sc => {
    const notesSC = filteredEleves.map(row => row.notes[sc._id]).filter(n => n !== undefined);
    const moyenne = notesSC.length > 0 ? (notesSC.reduce((a, b) => a + Number(b), 0) / notesSC.length).toFixed(2) : '-';
    return { nom: sc.nom, moyenne };
  });

  // Export PDF sécurisé
  const exportPDF = async () => {
    if (!selectedPeriode || !selectedCompetence) {
      toast.warning('Veuillez sélectionner une période et une compétence');
      return;
    }
    try {
      const token = getAuthToken();
      const res = await fetch(`http://localhost:5000/api/notes/export-pdf?periodeId=${selectedPeriode}&competenceId=${selectedCompetence}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Erreur lors de la génération du PDF");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `notes-${selectedPeriode}-${selectedCompetence}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Export PDF lancé');
    } catch (error) {
      toast.error('Erreur lors de l\'export PDF');
    }
  };

  // Calcul des moyennes sur toutes les compétences remplies
  const [moyennesParEleve, setMoyennesParEleve] = useState([]);
  const [moyenneGeneraleClasse, setMoyenneGeneraleClasse] = useState(null);

  useEffect(() => {
    if (!selectedPeriode) return;
    const calculerMoyennes = async () => {
      try {
        const token = getAuthToken();
        // Récupérer toutes les compétences
        const compRes = await fetch('http://localhost:5000/api/competences', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const compData = await compRes.json();
        const allCompetences = compData.competences || [];
        // Pour chaque élève, calculer la moyenne sur toutes les compétences remplies
        const moyennes = [];
        for (const eleve of eleves) {
          let totalNote = 0;
          let totalBareme = 0;
          for (const comp of allCompetences) {
            // Récupérer les sous-compétences de cette compétence
            const sousCompRes = await fetch(`http://localhost:5000/api/souscompetences/byCompetence/${comp._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const sousCompData = await sousCompRes.json();
            const sousComps = sousCompData.sousCompetences || [];
            // Pour chaque sous-compétence, récupérer la note de l'élève
            for (const sc of sousComps) {
              const noteRes = await fetch(`http://localhost:5000/api/enseignant/notes?eleveId=${eleve._id}&periode=${selectedPeriode}&competence=${comp._id}&sousCompetence=${sc._id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              const noteData = await noteRes.json();
              const note = Array.isArray(noteData.notes) && noteData.notes.length > 0 ? noteData.notes[0].note : null;
              if (note !== null && note !== undefined) {
                totalNote += Number(note);
                totalBareme += getBareme(sc.nom);
              }
            }
          }
          const moyenne = totalBareme > 0 ? (totalNote / totalBareme * 20).toFixed(2) : null;
          moyennes.push({ eleve, moyenne });
        }
        // Trier par moyenne décroissante (rang)
        moyennes.sort((a, b) => (b.moyenne || 0) - (a.moyenne || 0));
        setMoyennesParEleve(moyennes);
        // Moyenne générale de la classe
        const moys = moyennes.map(m => Number(m.moyenne)).filter(m => !isNaN(m));
        setMoyenneGeneraleClasse(moys.length > 0 ? (moys.reduce((a, b) => a + b, 0) / moys.length).toFixed(2) : null);
      } catch (err) {
        setMoyennesParEleve([]);
        setMoyenneGeneraleClasse(null);
      }
    };
    calculerMoyennes();
    // eslint-disable-next-line
  }, [eleves, selectedPeriode]);

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Card className="mb-6">
            <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-end">
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
                className="bg-blue-600 hover:bg-blue-700"
              >
                Afficher les notes
              </Button>
              <Button
                onClick={exportPDF}
                variant="outline"
                disabled={!selectedPeriode || !selectedCompetence}
                className="ml-2"
              >
                <Download className="h-4 w-4 mr-2" /> Export PDF
              </Button>
            </CardContent>
          </Card>

          {/* Statistiques */}
          {(filteredEleves.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <span className="text-sm text-gray-500">Moyenne Générale</span>
                  <span className="text-2xl font-bold text-blue-700">{moyenneGenerale}</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <span className="text-sm text-gray-500">Meilleur Élève</span>
                  <span className="text-lg font-bold text-green-700 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    {meilleurEleve?.eleve?.nom} {meilleurEleve?.eleve?.prenom}
                  </span>
                  <span className="text-xs text-gray-500">Total: {meilleurEleve?.total}</span>
                </CardContent>
              </Card>
              <Card className="col-span-2">
                <CardContent className="p-4">
                  <span className="text-sm text-gray-500">Moyennes par sous-compétence</span>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {moyennesParSousComp.map((msc, idx) => (
                      <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                        {msc.nom}: <span className="ml-1 font-bold">{msc.moyenne}</span>
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Barre de recherche */}
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                      type="text"
                placeholder="Rechercher un élève par nom ou prénom..."
                      value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-full"
                    />
                  </div>
            <div className="flex-1">
                    <select
                value={selectedEleve}
                onChange={e => setSelectedEleve(e.target.value)}
                className="border rounded-lg px-4 py-2 w-full"
              >
                <option value="">Tous les élèves</option>
                {eleves.map(eleve => (
                  <option key={eleve._id} value={eleve._id}>{eleve.nom} {eleve.prenom}</option>
                      ))}
                    </select>
                  </div>
                </div>

          {isLoading ? (
            <div className="text-center py-12">
              <span className="text-lg font-semibold">Chargement des notes...</span>
            </div>
          ) : filteredEleves.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-lg font-semibold text-gray-500">Aucune note trouvée pour cette période et cette compétence.</span>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Notes des élèves</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-3 border">Élève</th>
                        {sousCompetences.map(sc => (
                          <th key={sc._id} className="p-3 border">{sc.nom}</th>
                        ))}
                        <th className="p-3 border">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEleves.map((row, idx) => (
                        <tr key={row.eleve._id || idx} className="border-b">
                          <td className="p-3 border font-semibold">{row.eleve.nom} {row.eleve.prenom}</td>
                          {sousCompetences.map(sc => (
                            <td key={sc._id} className="p-3 border text-center">{row.notes[sc._id] !== undefined ? row.notes[sc._id] : '-'}</td>
                          ))}
                          <td className="p-3 border font-bold text-center">{row.total}</td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {moyennesParEleve.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Classement & Moyennes sur toutes les compétences remplies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 border">Rang</th>
                    <th className="p-3 border">Nom</th>
                    <th className="p-3 border">Moyenne (/20)</th>
                  </tr>
                </thead>
                <tbody>
                  {moyennesParEleve.map((row, idx) => (
                    <tr key={row.eleve._id}>
                      <td className="p-3 border text-center">{idx + 1}</td>
                      <td className="p-3 border">{row.eleve.nom} {row.eleve.prenom}</td>
                      <td className="p-3 border text-center font-bold">{row.moyenne ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 text-right text-sm text-gray-600">
                Moyenne générale de la classe : <span className="font-bold">{moyenneGeneraleClasse ?? '-'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
}