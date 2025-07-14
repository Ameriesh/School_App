import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "sonner";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  User, 
  Users,
  Calendar,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Trash2,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  FileText,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Baby,
  School,
  Camera,
  Home,
  BookOpen,
  Clock as ClockIcon
} from "lucide-react";
import AdminLayout from "./AdminLayout";

export default function DemandesInscriptionEnfants() {
  const [demandes, setDemandes] = useState([]);
  const [filteredDemandes, setFilteredDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatut, setSelectedStatut] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    enAttente: 0,
    approuvees: 0,
    rejetees: 0
  });
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchDemandes();
    fetchStats();
  }, []);

  useEffect(() => {
    filterDemandes();
  }, [demandes, searchTerm, selectedStatut]);

  const fetchDemandes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:5000/api/demandes-inscription-enfants', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setDemandes(data.demandes || []);
    } catch (error) {
      toast.error("Erreur lors du chargement des demandes");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:5000/api/demandes-inscription-enfants/statistiques', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const filterDemandes = () => {
    let filtered = demandes;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(demande =>
        demande.enfant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demande.enfant.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demande.parentId?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demande.parentId?.prenom?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (selectedStatut !== 'all') {
      filtered = filtered.filter(demande => demande.statut === selectedStatut);
    }

    setFilteredDemandes(filtered);
  };

  const traiterDemande = async (id, action, commentaire = '') => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/demandes-inscription-enfants/${id}/traiter`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action, commentaire })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success(`Demande ${action === 'approuver' ? 'approuvée' : 'rejetée'} avec succès`);
        fetchDemandes();
        fetchStats();
        setSelectedDemande(null);
      } else {
        throw new Error(data.message || 'Erreur lors du traitement');
      }
    } catch (error) {
      toast.error(error.message || "Erreur lors du traitement de la demande");
    }
  };

  const deleteDemande = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/demandes-inscription-enfants/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        toast.success("Demande supprimée avec succès");
        fetchDemandes();
        fetchStats();
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  const getStatutBadge = (statut) => {
    switch (statut) {
      case 'en_attente':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">En attente</Badge>;
      case 'approuvee':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approuvée</Badge>;
      case 'rejetee':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejetée</Badge>;
      default:
        return <Badge>{statut}</Badge>;
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case 'en_attente':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'approuvee':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejetee':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const viewFile = async (demandeId, fileType) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/demandes-inscription-enfants/${demandeId}/${fileType}`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      } else {
        throw new Error('Erreur lors de la récupération du fichier');
      }
    } catch (error) {
      toast.error("Erreur lors de l'ouverture du fichier");
      console.error('Erreur récupération fichier:', error);
    }
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        {/* En-tête */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Demandes d'inscription Enfants
                </h1>
                <p className="mt-2 text-gray-600">
                  Gérez les demandes d'inscription des enfants
                </p>
              </div>
              <Button
                onClick={() => {
                  fetchDemandes();
                  fetchStats();
                }}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Actualiser</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="transform hover:scale-105 transition-all duration-300 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Baby className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="transform hover:scale-105 transition-all duration-300 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">En attente</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.enAttente}</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="transform hover:scale-105 transition-all duration-300 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Approuvées</p>
                    <p className="text-3xl font-bold text-green-600">{stats.approuvees}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="transform hover:scale-105 transition-all duration-300 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Rejetées</p>
                    <p className="text-3xl font-bold text-red-600">{stats.rejetees}</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtres */}
          <Card className="shadow-lg mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Rechercher par nom d'enfant ou parent..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={selectedStatut}
                    onChange={(e) => setSelectedStatut(e.target.value)}
                    className="border rounded-md px-3 py-2 bg-white"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="en_attente">En attente</option>
                    <option value="approuvee">Approuvées</option>
                    <option value="rejetee">Rejetées</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Liste des demandes */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Baby className="h-5 w-5" />
                    <span>Demandes ({filteredDemandes.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                      <p className="text-gray-600">Chargement...</p>
                    </div>
                  ) : filteredDemandes.length === 0 ? (
                    <div className="text-center py-8">
                      <Baby className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Aucune demande trouvée
                      </h3>
                      <p className="text-gray-500">
                        {searchTerm || selectedStatut !== 'all' 
                          ? 'Aucune demande ne correspond à vos critères' 
                          : 'Aucune demande d\'inscription d\'enfant pour le moment'
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredDemandes.map((demande) => (
                        <div
                          key={demande._id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                            selectedDemande?._id === demande._id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedDemande(demande)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                                <Baby className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {demande.enfant.prenom} {demande.enfant.nom}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  Parent: {demande.parentId?.prenom} {demande.parentId?.nom}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatutBadge(demande.statut)}
                              {demande.statut === 'en_attente' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDetails(!showDetails);
                                  }}
                                >
                                  {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(demande.dateDemande)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <GraduationCap className="h-4 w-4" />
                              <span>{demande.enfant.classeDemandee?.nomclass}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ClockIcon className="h-4 w-4" />
                              <span>RDV: {formatDate(demande.rendezVous.date)} {demande.rendezVous.heure}</span>
                            </div>
                          </div>

                          {/* Actions rapides pour les demandes en attente */}
                          {demande.statut === 'en_attente' && (
                            <div className="mt-3 pt-3 border-t border-gray-200 flex space-x-2">
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  traiterDemande(demande._id, 'approuver');
                                }}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approuver
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  traiterDemande(demande._id, 'rejeter');
                                }}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Rejeter
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  viewFile(demande._id, 'photo');
                                }}
                                className="border-blue-300 text-blue-600 hover:bg-blue-50"
                              >
                                <Camera className="h-4 w-4 mr-1" />
                                Photo
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  viewFile(demande._id, 'acte-naissance');
                                }}
                                className="border-green-300 text-green-600 hover:bg-green-50"
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                Acte
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  viewFile(demande._id, 'certificat-domicile');
                                }}
                                className="border-purple-300 text-purple-600 hover:bg-purple-50"
                              >
                                <Home className="h-4 w-4 mr-1" />
                                Domicile
                              </Button>
                              {demande.enfant.ancienBulletin && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    viewFile(demande._id, 'ancien-bulletin');
                                  }}
                                  className="border-orange-300 text-orange-600 hover:bg-orange-50"
                                >
                                  <BookOpen className="h-4 w-4 mr-1" />
                                  Bulletin
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteDemande(demande._id);
                                }}
                                className="border-gray-300 text-gray-600 hover:bg-gray-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Détails de la demande */}
            <div>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Détails de la demande</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDemande ? (
                    <div className="space-y-4">
                      {/* Informations parent */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Parent
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{selectedDemande.parentId?.prenom} {selectedDemande.parentId?.nom}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{selectedDemande.parentId?.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{selectedDemande.parentId?.telephone}</span>
                          </div>
                        </div>
                      </div>

                      {/* Informations enfant */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <Baby className="h-4 w-4 mr-2" />
                          Enfant
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{selectedDemande.enfant.prenom} {selectedDemande.enfant.nom}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>Né(e) le {formatDate(selectedDemande.enfant.dateNaissance)} à {selectedDemande.enfant.lieuNaissance}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <GraduationCap className="h-4 w-4 text-gray-400" />
                            <span>Classe demandée: {selectedDemande.enfant.classeDemandee?.nomclass}</span>
                          </div>
                          {selectedDemande.enfant.etaitDansAutreEcole && (
                            <div className="flex items-center space-x-2">
                              <School className="h-4 w-4 text-gray-400" />
                              <span>Établissement précédent: {selectedDemande.enfant.etablissementPrecedent}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Rendez-vous */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <ClockIcon className="h-4 w-4 mr-2" />
                          Rendez-vous
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>Date: {formatDate(selectedDemande.rendezVous.date)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <ClockIcon className="h-4 w-4 text-gray-400" />
                            <span>Heure: {selectedDemande.rendezVous.heure}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Statut:</span>
                            <Badge className={
                              selectedDemande.rendezVous.statut === 'programme' ? 'bg-blue-100 text-blue-800' :
                              selectedDemande.rendezVous.statut === 'confirme' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {selectedDemande.rendezVous.statut}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Documents */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Documents
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Camera className="h-4 w-4 text-gray-400" />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewFile(selectedDemande._id, 'photo')}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              Voir la photo
                            </Button>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewFile(selectedDemande._id, 'acte-naissance')}
                              className="text-green-600 hover:text-green-700"
                            >
                              Voir l'acte de naissance
                            </Button>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Home className="h-4 w-4 text-gray-400" />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewFile(selectedDemande._id, 'certificat-domicile')}
                              className="text-purple-600 hover:text-purple-700"
                            >
                              Voir le certificat de domicile
                            </Button>
                          </div>
                          {selectedDemande.enfant.ancienBulletin && (
                            <div className="flex items-center space-x-2">
                              <BookOpen className="h-4 w-4 text-gray-400" />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => viewFile(selectedDemande._id, 'ancien-bulletin')}
                                className="text-orange-600 hover:text-orange-700"
                              >
                                Voir l'ancien bulletin
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Statut et dates */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          {getStatutIcon(selectedDemande.statut)}
                          <span className="ml-2">Statut</span>
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Statut :</span> {getStatutBadge(selectedDemande.statut)}
                          </div>
                          <div>
                            <span className="font-medium">Demande reçue :</span> {formatDate(selectedDemande.dateDemande)}
                          </div>
                          {selectedDemande.dateTraitement && (
                            <div>
                              <span className="font-medium">Traîtée le :</span> {formatDate(selectedDemande.dateTraitement)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Commentaire */}
                      {selectedDemande.commentaire && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Commentaire</h4>
                          <div className="p-3 bg-gray-50 rounded border text-sm">
                            {selectedDemande.commentaire}
                          </div>
                        </div>
                      )}

                      {/* Actions pour les demandes en attente */}
                      {selectedDemande.statut === 'en_attente' && (
                        <div className="space-y-2 pt-4 border-t">
                          <Button
                            onClick={() => traiterDemande(selectedDemande._id, 'approuver')}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approuver la demande
                          </Button>
                          <Button
                            onClick={() => traiterDemande(selectedDemande._id, 'rejeter')}
                            variant="outline"
                            className="w-full border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Rejeter la demande
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Eye className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>Sélectionnez une demande pour voir les détails</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 