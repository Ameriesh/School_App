import React, { useEffect, useState } from 'react';
import { fetchAbsences, fetchAllAbsences, addAbsence, updateAbsence, deleteAbsence } from '../../services/absences';
import { fetchEleves } from '../../services/eleves';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../../components/ui/table';
import { Plus, Edit, Trash2, Calendar, Clock, Users, Search, Filter, Loader2 } from 'lucide-react';
import AdminLayout from "../admin/AdminLayout";
import { toast } from "sonner";

const motifs = ['Maladie', 'Retard', 'Raisons familiales', 'Autre'];
const statuts = ['Justifiée', 'Non justifiée'];

export default function Absences() {
  const [absences, setAbsences] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [filters, setFilters] = useState({ eleve: '', date: '', statut: '' });
  const [form, setForm] = useState({ eleve: '', date: '', statut: '', motif: '', heures: 1 });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalAbsences, setTotalAbsences] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchEleves(token).then(data => setEleves(data.eleves || []));
    loadAbsences();
    // eslint-disable-next-line
  }, []);

  const loadAbsences = async () => {
    setLoading(true);
    try {
      // Utiliser fetchAllAbsences pour voir toutes les absences (debug/admin)
      const data = await fetchAllAbsences(token);
      console.log("Réponse API toutes les absences:", data);
      setAbsences(data.absences || []);
      
      // Calculer le total d'heures d'absence par élève
      const totals = {};
      console.log("Absences reçues:", data.absences);
      
      (data.absences || []).forEach((abs, index) => {
        console.log(`Absence ${index}:`, abs);
        console.log(`Élève ID:`, abs.eleve?._id);
        console.log(`Heures:`, abs.heures);
        
        const eleveId = abs.eleve?._id?.toString();
        if (eleveId) {
          totals[eleveId] = (totals[eleveId] || 0) + (abs.heures || 0);
          console.log(`Total pour élève ${eleveId}:`, totals[eleveId]);
        }
      });
      
      console.log("Totaux calculés:", totals);
      setTotalAbsences(totals);
    } catch (e) {
      toast.error(e.message);
    }
    setLoading(false);
  };

  const handleFilterChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = e => {
    e.preventDefault();
    loadAbsences();
  };

  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    try {
      if (editId) {
        await updateAbsence(token, editId, form);
        toast.success("Absence modifiée avec succès");
      } else {
        await addAbsence(token, form);
        toast.success("Absence ajoutée avec succès");
      }
      setForm({ eleve: '', date: '', statut: '', motif: '', heures: 1 });
      setEditId(null);
      // Correction : réinitialiser les filtres pour afficher toute la liste après ajout
      setFilters({ eleve: '', date: '', statut: '' });
      await loadAbsences();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleEdit = absence => {
    setForm({
      eleve: absence.eleve._id,
      date: absence.date.slice(0, 10),
      statut: absence.statut,
      motif: absence.motif,
      heures: absence.heures || 1,
    });
    setEditId(absence._id);
  };

  const handleDelete = async id => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette absence ?')) {
      try {
        await deleteAbsence(token, id);
        toast.success("Absence supprimée avec succès");
        loadAbsences();
      } catch (e) {
        toast.error(e.message);
      }
    }
  };

  // Calcul du total d'heures d'absence pour chaque élève affiché dans le tableau
  const getTotalForEleve = (eleveId) => totalAbsences[eleveId] || 0;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#38bdf8] mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Chargement des absences...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-2 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-[#38bdf8]" />
              Gestion des absences
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Gérez les absences des élèves
            </p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-2xl border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total absences</p>
                  <p className="text-2xl font-bold text-blue-800">{absences.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-50 to-green-100 shadow-lg rounded-2xl border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Heures totales</p>
                  <p className="text-2xl font-bold text-green-800">
                    {absences.reduce((total, abs) => total + (abs.heures || 0), 0)}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 shadow-lg rounded-2xl border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Élèves concernés</p>
                  <p className="text-2xl font-bold text-purple-800">
                    {new Set(absences.map(abs => abs.eleve?._id)).size}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Formulaire d'ajout/modification */}
        <Card className="bg-white shadow-lg rounded-2xl border-0">
          <CardHeader>
            <CardTitle className="text-[#0f172a] flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#38bdf8]" />
              {editId ? 'Modifier une absence' : 'Ajouter une absence'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Élève</label>
                <select 
                  name="eleve" 
                  value={form.eleve} 
                  onChange={handleFormChange} 
                  required 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                >
                  <option value="">Sélectionner un élève</option>
                  {eleves.map(e => (
                    <option key={e._id} value={e._id}>{e.nom} {e.prenom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  name="date" 
                  value={form.date} 
                  onChange={handleFormChange} 
                  required 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select 
                  name="statut" 
                  value={form.statut} 
                  onChange={handleFormChange} 
                  required 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                >
                  <option value="">Sélectionner un statut</option>
                  {statuts.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motif</label>
                <select 
                  name="motif" 
                  value={form.motif} 
                  onChange={handleFormChange} 
                  required 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                >
                  <option value="">Sélectionner un motif</option>
                  {motifs.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heures</label>
                <input 
                  type="number" 
                  name="heures" 
                  min="1" 
                  value={form.heures} 
                  onChange={handleFormChange} 
                  required 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent" 
                />
              </div>
              <div className="flex items-end gap-2">
                <Button 
                  type="submit"
                  className="flex items-center gap-2 bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {editId ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  <span className="hidden sm:inline">{editId ? 'Modifier' : 'Ajouter'}</span>
                </Button>
                {editId && (
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => { 
                      setEditId(null); 
                      setForm({ eleve: '', date: '', statut: '', motif: '', heures: 1 }); 
                    }}
                    className="border-[#38bdf8] text-[#38bdf8] hover:bg-[#e0f2fe]"
                  >
                    Annuler
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Filtres */}
        <Card className="bg-white shadow-lg rounded-2xl border-0">
          <CardHeader>
            <CardTitle className="text-[#0f172a] flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#38bdf8]" />
              Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Élève</label>
                <select 
                  name="eleve" 
                  value={filters.eleve} 
                  onChange={handleFilterChange} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                >
                  <option value="">Tous les élèves</option>
                  {eleves.map(e => (
                    <option key={e._id} value={e._id}>{e.nom} {e.prenom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  name="date" 
                  value={filters.date} 
                  onChange={handleFilterChange} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select 
                  name="statut" 
                  value={filters.statut} 
                  onChange={handleFilterChange} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                >
                  <option value="">Tous les statuts</option>
                  {statuts.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <Button 
                  type="submit"
                  className="flex items-center gap-2 bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Search className="h-4 w-4" />
                  Filtrer
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tableau des absences */}
        <Card className="bg-white shadow-lg rounded-2xl border-0 overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-[#38bdf8]/10">
                    <TableHead className="font-semibold text-[#0a2540]">Élève</TableHead>
                    <TableHead className="font-semibold text-[#0a2540]">Date</TableHead>
                    <TableHead className="font-semibold text-[#0a2540]">Statut</TableHead>
                    <TableHead className="font-semibold text-[#0a2540]">Motif</TableHead>
                    <TableHead className="font-semibold text-[#0a2540]">Heures</TableHead>
                    <TableHead className="font-semibold text-[#0a2540]">Total heures</TableHead>
                    <TableHead className="text-right font-semibold text-[#0a2540]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {absences.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="text-center">
                          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 font-medium">Aucune absence trouvée</p>
                          <p className="text-gray-400 text-sm mt-1">
                            Commencez par ajouter votre première absence
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    absences.map((abs, idx) => (
                      <TableRow 
                        key={abs._id} 
                        className={`hover:bg-[#e0f2fe]/30 transition-all duration-200 group ${
                          idx % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"
                        }`}
                      >
                        <TableCell className="font-medium">
                          <div>
                            <p className="text-[#0a2540] font-semibold">
                              {abs.eleve?.nom} {abs.eleve?.prenom}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-[#0a2540]">
                            {abs.date?.slice(0, 10)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={abs.statut === 'Justifiée' 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : 'bg-red-100 text-red-800 border-red-200'
                            }
                          >
                            {abs.statut}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-[#0a2540]">{abs.motif}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-[#0a2540] font-medium">{abs.heures}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-[#0a2540] font-bold">
                            {getTotalForEleve(abs.eleve?._id)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-[#0a2540] hover:bg-[#e0f2fe] border-[#38bdf8] hover:border-[#0ea5e9] transition-all duration-200"
                              onClick={() => handleEdit(abs)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(abs._id)}
                              className="hover:bg-red-700 transition-all duration-200"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
} 