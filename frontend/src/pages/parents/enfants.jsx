import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Users, School, FileText } from "lucide-react";
import { Toaster, toast } from "sonner";
import ParentLayoutDash from "./dash/ParentLayoutDash";
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from "@/lib/utils";

export default function Enfants() {
  const [loading, setLoading] = useState(true);
  const [parentInfo, setParentInfo] = useState(null);
  const [enfants, setEnfants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParentInfo = async () => {
      try {
        const token = getAuthToken('parent');
        const response = await fetch('http://localhost:5000/api/parent/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Erreur lors de la récupération du profil');
        const data = await response.json();
        setParentInfo(data.parent);
        setEnfants(data.parent.enfants || []);
      } catch (error) {
        toast.error("Erreur lors de la récupération des enfants");
      } finally {
        setLoading(false);
      }
    };
    fetchParentInfo();
  }, []);

  return (
    <ParentLayoutDash>
      <Toaster position="top-right" richColors />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Mes Enfants
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-2" />
                <span>Chargement...</span>
              </div>
            ) : enfants.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucun enfant trouvé pour ce compte parent.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enfants.map((enfant, idx) => (
                  <Card key={enfant._id || idx} className="shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <School className="h-6 w-6 text-blue-500" />
                        <span className="font-bold text-lg text-gray-800">{enfant.nom || '-'} {enfant.prenom || '-'}</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Classe :</span> {enfant.classe && enfant.classe.nomclass ? enfant.classe.nomclass : 'Non assignée'}
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Niveau :</span> {enfant.classe && enfant.classe.niveau ? enfant.classe.niveau : 'Non défini'}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow"
                          onClick={() => navigate(`/parent/enfant/${enfant._id}/notes`)}
                        >
                          <FileText className="h-4 w-4" /> Voir les notes
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ParentLayoutDash>
  );
} 