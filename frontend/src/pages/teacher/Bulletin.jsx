import { useState, useEffect } from 'react';
import AdminLayout from "../admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { Loader2, BarChart3, TrendingUp, TrendingDown, Star, Award, FileText } from "lucide-react";

export default function Bulletin() {
  const [periodes, setPeriodes] = useState([]); // Peut être supprimé si inutilisé
  const [eleves, setEleves] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [moyennesParEleve, setMoyennesParEleve] = useState([]);
  const [moyenneGeneraleClasse, setMoyenneGeneraleClasse] = useState(null);

  // Calcul automatique au chargement
  useEffect(() => {
    const fetchDataAndCalcul = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        // Récupérer élèves, compétences, sous-compétences et toutes les notes d'un coup
        const [elevesRes, compRes, sousCompRes, notesRes] = await Promise.all([
          fetch('http://localhost:5000/api/eleves/enseignant', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:5000/api/competences', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:5000/api/souscompetences', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:5000/api/notes/all-eleves', {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);
        const elevesData = await elevesRes.json();
        const compData = await compRes.json();
        const sousCompData = await sousCompRes.json();
        const notesData = await notesRes.json();
        const allEleves = elevesData.eleves || [];
        const allCompetences = compData.competences || [];
        const allSousCompetences = sousCompData.sousCompetences || [];
        const allNotes = notesData.notes || [];
        setEleves(allEleves);
        // Calcul des moyennes
        const moyennes = [];
        for (const eleve of allEleves) {
          let totalNote = 0;
          let totalBareme = 0;
          for (const comp of allCompetences) {
            const sousComps = allSousCompetences.filter(sc => sc.competence === comp._id || (sc.competence && sc.competence._id === comp._id));
            for (const sc of sousComps) {
              const noteObj = allNotes.find(n => n.eleve._id === eleve._id && n.competence._id === comp._id && n.sousCompetence._id === sc._id);
              const note = noteObj ? noteObj.note : null;
              if (note !== null && note !== undefined) {
                let bareme = sc.bareme || 20;
                totalNote += Number(note);
                totalBareme += bareme;
              }
            }
          }
          const moyenne = totalBareme > 0 ? (totalNote / totalBareme * 20).toFixed(2) : null;
          moyennes.push({ eleve, moyenne });
        }
        // Trier par moyenne décroissante (rang), mais garder tous les élèves
        const sorted = [...moyennes].sort((a, b) => (b.moyenne || 0) - (a.moyenne || 0));
        setMoyennesParEleve(sorted);
        // Moyenne générale de la classe (seulement ceux qui ont une moyenne)
        const moys = sorted.map(m => Number(m.moyenne)).filter(m => !isNaN(m));
        setMoyenneGeneraleClasse(moys.length > 0 ? (moys.reduce((a, b) => a + b, 0) / moys.length).toFixed(2) : null);
      } catch (err) {
        setMoyennesParEleve([]);
        setMoyenneGeneraleClasse(null);
        toast.error('Erreur lors du calcul des moyennes');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDataAndCalcul();
  }, []);

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* On n'affiche plus le select ni le bouton, juste le tableau et le loader si besoin */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-2" />
              <span>Calcul des moyennes...</span>
            </div>
          ) : moyennesParEleve.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Classement & Moyennes semestrielles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-3 border">Rang</th>
                        <th className="p-3 border">Nom</th>
                        <th className="p-3 border">Moyenne (/20)</th>
                        <th className="p-3 border">Export PDF</th>
                      </tr>
                    </thead>
                    <tbody>
                      {moyennesParEleve.map((row, idx) => (
                        <tr key={row.eleve._id}>
                          <td className="p-3 border text-center">{row.moyenne !== null ? idx + 1 : '-'}</td>
                          <td className="p-3 border">{row.eleve.nom} {row.eleve.prenom}</td>
                          <td className="p-3 border text-center font-bold">{row.moyenne ?? '-'}</td>
                          <td className="p-3 border text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={async () => {
                                try {
                                  const token = localStorage.getItem("token");
                                  const res = await fetch(`http://localhost:5000/api/notes/bulletin-pdf/${row.eleve._id}`, {
                                    headers: { Authorization: `Bearer ${token}` },
                                  });
                                  if (!res.ok) throw new Error("Erreur lors de la génération du PDF");
                                  const blob = await res.blob();
                                  const url = window.URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = `bulletin-${row.eleve.nom}-${row.eleve.prenom}.pdf`;
                                  document.body.appendChild(a);
                                  a.click();
                                  a.remove();
                                  window.URL.revokeObjectURL(url);
                                } catch (err) {
                                  toast.error("Erreur lors de l'export PDF");
                                }
                              }}
                            >
                              <FileText className="h-4 w-4 mr-1" /> PDF
                            </Button>
                          </td>
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
        </div>
      </div>
    </AdminLayout>
  );
} 