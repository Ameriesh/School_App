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
  Mail, 
  Phone,
  MapPin,
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
  CreditCard,
  Briefcase,
  FileText
} from "lucide-react";
import AdminLayout from "./AdminLayout";

export default function DemandesInscription() {
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
      const response = await fetch('http://localhost:5000/api/demandes-inscription', {
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
      const response = await fetch('http://localhost:5000/api/demandes-inscription/statistiques', {
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
        demande.parent.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demande.parent.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demande.parent.email.toLowerCase().includes(searchTerm.toLowerCase())
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
      const response = await fetch(`http://localhost:5000/api/demandes-inscription/${id}/traiter`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action, commentaire })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (action === 'approuver' && data.emailNonEnvoye) {
          // Email n'a pas été envoyé, afficher le mot de passe
          toast.success(`Demande approuvée avec succès (email non envoyé)`);
          toast.info(
            <div>
              <p className="font-semibold mb-2">Mot de passe généré :</p>
              <p className="font-mono bg-gray-100 p-2 rounded text-sm">{data.motDePasse}</p>
              <p className="text-xs mt-2 text-gray-600">Veuillez l'envoyer manuellement au parent</p>
            </div>,
            { duration: 10000 }
          );
        } else {
          toast.success(`Demande ${action === 'approuver' ? 'approuvée' : 'rejetée'} avec succès`);
        }
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
      const response = await fetch(`http://localhost:5000/api/demandes-inscription/${id}`, {
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

  const viewCniFile = async (demandeId) => {
    try {
      // Vérifier d'abord si le token est valide
      const isTokenValid = await checkTokenValidity();
      if (!isTokenValid) {
        handleTokenExpired();
        return;
      }
      
      const token = localStorage.getItem("token");
      console.log('Token récupéré:', token ? 'Présent' : 'Absent');
      
      if (!token) {
        toast.error("Token d'authentification manquant. Veuillez vous reconnecter.");
        return;
      }
      
      const response = await fetch(`http://localhost:5000/api/demandes-inscription/${demandeId}/cni`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      
      console.log('Réponse du serveur:', response.status, response.statusText);
      
      if (response.ok) {
        // Créer un blob à partir de la réponse
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        // Ouvrir le fichier dans un nouvel onglet
        window.open(url, '_blank');
        
        // Nettoyer l'URL après un délai
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      } else {
        const errorData = await response.json();
        console.error('Erreur serveur:', errorData);
        
        // Si c'est une erreur d'authentification, gérer la reconnexion
        if (errorData.code === 'MISSING_AUTH_TOKEN' || errorData.code === 'AUTH_ERROR') {
          handleTokenExpired();
          return;
        }
        
        throw new Error(errorData.message || 'Erreur lors de la récupération du fichier');
      }
    } catch (error) {
      toast.error("Erreur lors de l'ouverture du fichier CNI");
      console.error('Erreur récupération fichier CNI:', error);
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

  const checkTokenValidity = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return false;
      }
      
      // Test simple avec une requête à l'API
      const response = await fetch('http://localhost:5000/api/demandes-inscription/statistiques', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return response.ok;
    } catch (error) {
      console.error('Erreur vérification token:', error);
      return false;
    }
  };

  const handleTokenExpired = () => {
    toast.error("Session expirée. Veuillez vous reconnecter.");
    localStorage.removeItem("token");
    // Rediriger vers la page de connexion
    window.location.href = '/admin/login';
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
                  Demandes d'inscription Parents
                </h1>
                <p className="mt-2 text-gray-600">
                  Gérez les demandes d'accès à l'espace parent
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
                    <Users className="h-6 w-6 text-blue-600" />
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
                    placeholder="Rechercher par nom, prénom ou email..."
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
                    <Users className="h-5 w-5" />
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
                      <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Aucune demande trouvée
                      </h3>
                      <p className="text-gray-500">
                        {searchTerm || selectedStatut !== 'all' 
                          ? 'Aucune demande ne correspond à vos critères' 
                          : 'Aucune demande d\'inscription pour le moment'
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
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {demande.parent.nom} {demande.parent.prenom}
                                </h3>
                                <p className="text-sm text-gray-500">{demande.parent.email}</p>
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
                              <Users className="h-4 w-4" />
                              <span>Enfants à ajouter après approbation</span>
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
                          Informations parent
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{selectedDemande.parent.nom} {selectedDemande.parent.prenom}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{selectedDemande.parent.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{selectedDemande.parent.telephone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{selectedDemande.parent.adresse}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CreditCard className="h-4 w-4 text-gray-400" />
                            <span>CNI:</span>
                            {selectedDemande.parent.cni ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => viewCniFile(selectedDemande._id)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                Voir le fichier CNI
                              </Button>
                            ) : (
                              <span className="text-gray-500">Aucun fichier</span>
                            )}
                          </div>
                          {selectedDemande.parent.profession && (
                            <div className="flex items-center space-x-2">
                              <Briefcase className="h-4 w-4 text-gray-400" />
                              <span>Profession: {selectedDemande.parent.profession}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Note sur les enfants */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          Enfants
                        </h4>
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-800">
                            Les enfants seront ajoutés par le parent après approbation de sa demande, 
                            directement depuis son dashboard.
                          </p>
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
                          {selectedDemande.traitePar && (
                            <div>
                              <span className="font-medium">Traîtée par :</span> {selectedDemande.traitePar.nom} {selectedDemande.traitePar.prenom}
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