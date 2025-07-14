import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "sonner";
import { 
  Baby, 
  Calendar,
  MapPin,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Upload,
  X,
  GraduationCap,
  School,
  Camera,
  Home,
  BookOpen,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function InscrireEnfant() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [acteNaissanceFile, setActeNaissanceFile] = useState(null);
  const [certificatDomicileFile, setCertificatDomicileFile] = useState(null);
  const [ancienBulletinFile, setAncienBulletinFile] = useState(null);
  
  const [formData, setFormData] = useState({
    enfant: {
      nom: '',
      prenom: '',
      dateNaissance: '',
      lieuNaissance: '',
      sexe: '',
      classeDemandee: '',
      etaitDansAutreEcole: false,
      etablissementPrecedent: ''
    },
    rendezVous: {
      date: '',
      heure: ''
    }
  });
  const [errors, setErrors] = useState({});

  // Récupérer les classes au chargement
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/demandes-inscription-enfants/classes');
      if (response.ok) {
        const data = await response.json();
        setClasses(data);
      }
    } catch (error) {
      console.error('Erreur récupération classes:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validation des informations de l'enfant
    if (!formData.enfant.nom.trim()) newErrors.enfantNom = 'Le nom de l\'enfant est requis';
    if (!formData.enfant.prenom.trim()) newErrors.enfantPrenom = 'Le prénom de l\'enfant est requis';
    if (!formData.enfant.dateNaissance) newErrors.enfantDateNaissance = 'La date de naissance est requise';
    if (!formData.enfant.lieuNaissance.trim()) newErrors.enfantLieuNaissance = 'Le lieu de naissance est requis';
    if (!formData.enfant.sexe) newErrors.enfantSexe = 'Le sexe est requis';
    if (!formData.enfant.classeDemandee) newErrors.enfantClasse = 'La classe demandée est requise';
    if (!photoFile) newErrors.photo = 'La photo de l\'enfant est requise';
    if (!acteNaissanceFile) newErrors.acteNaissance = 'L\'acte de naissance est requis';
    if (!certificatDomicileFile) newErrors.certificatDomicile = 'Le certificat de domicile est requis';
    if (!formData.rendezVous.date) newErrors.rendezVousDate = 'La date du rendez-vous est requise';
    if (!formData.rendezVous.heure) newErrors.rendezVousHeure = 'L\'heure du rendez-vous est requise';

    // Validation conditionnelle pour l'ancien bulletin
    if (formData.enfant.etaitDansAutreEcole && !ancienBulletinFile) {
      newErrors.ancienBulletin = 'L\'ancien bulletin est requis si l\'enfant était dans une autre école';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Format de fichier non supporté. Utilisez JPG, PNG ou PDF.');
        return;
      }
      
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Le fichier est trop volumineux. Taille maximale : 5MB.');
        return;
      }
      
      switch (fileType) {
        case 'photo':
          setPhotoFile(file);
          setErrors({ ...errors, photo: null });
          break;
        case 'acteNaissance':
          setActeNaissanceFile(file);
          setErrors({ ...errors, acteNaissance: null });
          break;
        case 'certificatDomicile':
          setCertificatDomicileFile(file);
          setErrors({ ...errors, certificatDomicile: null });
          break;
        case 'ancienBulletin':
          setAncienBulletinFile(file);
          setErrors({ ...errors, ancienBulletin: null });
          break;
        default:
          break;
      }
    }
  };

  const removeFile = (fileType) => {
    switch (fileType) {
      case 'photo':
        setPhotoFile(null);
        setErrors({ ...errors, photo: null });
        break;
      case 'acteNaissance':
        setActeNaissanceFile(null);
        setErrors({ ...errors, acteNaissance: null });
        break;
      case 'certificatDomicile':
        setCertificatDomicileFile(null);
        setErrors({ ...errors, certificatDomicile: null });
        break;
      case 'ancienBulletin':
        setAncienBulletinFile(null);
        setErrors({ ...errors, ancienBulletin: null });
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Ajouter les données de l'enfant
      Object.keys(formData.enfant).forEach(key => {
        formDataToSend.append(`enfant[${key}]`, formData.enfant[key]);
      });
      
      // Ajouter les données du rendez-vous
      Object.keys(formData.rendezVous).forEach(key => {
        formDataToSend.append(`rendezVous[${key}]`, formData.rendezVous[key]);
      });
      
      // Ajouter les fichiers
      formDataToSend.append('photo', photoFile);
      formDataToSend.append('acteNaissance', acteNaissanceFile);
      formDataToSend.append('certificatDomicile', certificatDomicileFile);
      if (ancienBulletinFile) {
        formDataToSend.append('ancienBulletin', ancienBulletinFile);
      }
      
      // Récupérer le token d'authentification
      const token = localStorage.getItem('parentToken');
      
      const response = await fetch('http://localhost:5000/api/demandes-inscription-enfants', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success("Demande d'inscription envoyée avec succès ! Un rendez-vous a été programmé.");
        setTimeout(() => {
          navigate('/parent/dashboard');
        }, 2000);
      } else {
        throw new Error(data.message || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      toast.error(error.message || "Erreur lors de l'envoi de la demande");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <Toaster position="top-right" richColors />
      
      {/* Logo/En-tête */}
      <div className="absolute top-8 left-8">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
            <Baby className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">SchoolApp</h1>
            <p className="text-xs text-gray-500">Inscription Enfant</p>
          </div>
        </div>
      </div>

      <Card className="w-full max-w-4xl shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mb-4">
            <Baby className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Inscrire un enfant
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Remplissez ce formulaire pour inscrire votre enfant
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informations de l'enfant */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Baby className="h-5 w-5 mr-2 text-green-600" />
                Informations de l'enfant
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'enfant *
                  </label>
                  <Input
                    type="text"
                    required
                    value={formData.enfant.nom}
                    onChange={(e) => setFormData({
                      ...formData, 
                      enfant: {...formData.enfant, nom: e.target.value}
                    })}
                    className={errors.enfantNom ? 'border-red-500' : ''}
                    placeholder="Nom de l'enfant"
                  />
                  {errors.enfantNom && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.enfantNom}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom de l'enfant *
                  </label>
                  <Input
                    type="text"
                    required
                    value={formData.enfant.prenom}
                    onChange={(e) => setFormData({
                      ...formData, 
                      enfant: {...formData.enfant, prenom: e.target.value}
                    })}
                    className={errors.enfantPrenom ? 'border-red-500' : ''}
                    placeholder="Prénom de l'enfant"
                  />
                  {errors.enfantPrenom && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.enfantPrenom}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de naissance *
                  </label>
                  <Input
                    type="date"
                    required
                    value={formData.enfant.dateNaissance}
                    onChange={(e) => setFormData({
                      ...formData, 
                      enfant: {...formData.enfant, dateNaissance: e.target.value}
                    })}
                    className={errors.enfantDateNaissance ? 'border-red-500' : ''}
                  />
                  {errors.enfantDateNaissance && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.enfantDateNaissance}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lieu de naissance *
                  </label>
                  <Input
                    type="text"
                    required
                    value={formData.enfant.lieuNaissance}
                    onChange={(e) => setFormData({
                      ...formData, 
                      enfant: {...formData.enfant, lieuNaissance: e.target.value}
                    })}
                    className={errors.enfantLieuNaissance ? 'border-red-500' : ''}
                    placeholder="Ville de naissance"
                  />
                  {errors.enfantLieuNaissance && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.enfantLieuNaissance}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sexe *
                  </label>
                  <select
                    value={formData.enfant.sexe}
                    onChange={(e) => setFormData({
                      ...formData, 
                      enfant: {...formData.enfant, sexe: e.target.value}
                    })}
                    className={`w-full border rounded-md px-3 py-2 bg-white ${errors.enfantSexe ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Sélectionner</option>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                  {errors.enfantSexe && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.enfantSexe}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Classe demandée *
                  </label>
                  <select
                    value={formData.enfant.classeDemandee}
                    onChange={(e) => setFormData({
                      ...formData, 
                      enfant: {...formData.enfant, classeDemandee: e.target.value}
                    })}
                    className={`w-full border rounded-md px-3 py-2 bg-white ${errors.enfantClasse ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Sélectionner une classe</option>
                    {classes.map((classe) => (
                      <option key={classe._id} value={classe._id}>
                        {classe.nomclass} - {classe.niveau}
                      </option>
                    ))}
                  </select>
                  {errors.enfantClasse && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.enfantClasse}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      checked={formData.enfant.etaitDansAutreEcole}
                      onChange={(e) => setFormData({
                        ...formData, 
                        enfant: {...formData.enfant, etaitDansAutreEcole: e.target.checked}
                      })}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      L'enfant était dans une autre école
                    </span>
                  </label>
                </div>

                {formData.enfant.etaitDansAutreEcole && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Établissement précédent
                    </label>
                    <Input
                      type="text"
                      value={formData.enfant.etablissementPrecedent}
                      onChange={(e) => setFormData({
                        ...formData, 
                        enfant: {...formData.enfant, etablissementPrecedent: e.target.value}
                      })}
                      placeholder="Nom de l'établissement précédent"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Rendez-vous */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-orange-600" />
                Rendez-vous à l'école
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date du rendez-vous *
                  </label>
                  <Input
                    type="date"
                    required
                    value={formData.rendezVous.date}
                    onChange={(e) => setFormData({
                      ...formData, 
                      rendezVous: {...formData.rendezVous, date: e.target.value}
                    })}
                    className={errors.rendezVousDate ? 'border-red-500' : ''}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.rendezVousDate && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.rendezVousDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure du rendez-vous *
                  </label>
                  <Input
                    type="time"
                    required
                    value={formData.rendezVous.heure}
                    onChange={(e) => setFormData({
                      ...formData, 
                      rendezVous: {...formData.rendezVous, heure: e.target.value}
                    })}
                    className={errors.rendezVousHeure ? 'border-red-500' : ''}
                  />
                  {errors.rendezVousHeure && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.rendezVousHeure}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-900 mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Documents à apporter au rendez-vous
                </h4>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• Certificat de domicile (déjà téléversé)</li>
                  <li>• Ancien bulletin scolaire (si applicable)</li>
                  <li>• Pièce d'identité du parent</li>
                  <li>• Autres documents demandés par l'école</li>
                </ul>
              </div>
            </div>

            {/* Documents requis */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-purple-600" />
                Documents à téléverser
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Photo de l'enfant */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo de l'enfant *
                  </label>
                  
                  {!photoFile ? (
                    <div className="relative">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, 'photo')}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label
                        htmlFor="photo-upload"
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                          errors.photo ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Camera className="w-8 h-8 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Cliquez pour téléverser</span> ou glissez-déposez
                          </p>
                          <p className="text-xs text-gray-500">
                            JPG ou PNG (max. 5MB)
                          </p>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Camera className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{photoFile.name}</p>
                            <p className="text-xs text-gray-500">
                              {(photoFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeFile('photo')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {errors.photo && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.photo}
                    </p>
                  )}
                </div>

                {/* Acte de naissance */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Acte de naissance de l'enfant *
                  </label>
                  
                  {!acteNaissanceFile ? (
                    <div className="relative">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => handleFileChange(e, 'acteNaissance')}
                        className="hidden"
                        id="acte-naissance-upload"
                      />
                      <label
                        htmlFor="acte-naissance-upload"
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                          errors.acteNaissance ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FileText className="w-8 h-8 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Cliquez pour téléverser</span> ou glissez-déposez
                          </p>
                          <p className="text-xs text-gray-500">
                            JPG, PNG ou PDF (max. 5MB)
                          </p>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{acteNaissanceFile.name}</p>
                            <p className="text-xs text-gray-500">
                              {(acteNaissanceFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeFile('acteNaissance')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {errors.acteNaissance && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.acteNaissance}
                    </p>
                  )}
                </div>

                {/* Certificat de domicile */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certificat de domicile *
                  </label>
                  
                  {!certificatDomicileFile ? (
                    <div className="relative">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => handleFileChange(e, 'certificatDomicile')}
                        className="hidden"
                        id="certificat-domicile-upload"
                      />
                      <label
                        htmlFor="certificat-domicile-upload"
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                          errors.certificatDomicile ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Home className="w-8 h-8 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Cliquez pour téléverser</span> ou glissez-déposez
                          </p>
                          <p className="text-xs text-gray-500">
                            JPG, PNG ou PDF (max. 5MB)
                          </p>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Home className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{certificatDomicileFile.name}</p>
                            <p className="text-xs text-gray-500">
                              {(certificatDomicileFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeFile('certificatDomicile')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {errors.certificatDomicile && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.certificatDomicile}
                    </p>
                  )}
                </div>

                {/* Ancien bulletin (conditionnel) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ancien bulletin scolaire {formData.enfant.etaitDansAutreEcole && '*'}
                  </label>
                  
                  {!ancienBulletinFile ? (
                    <div className="relative">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => handleFileChange(e, 'ancienBulletin')}
                        className="hidden"
                        id="ancien-bulletin-upload"
                      />
                      <label
                        htmlFor="ancien-bulletin-upload"
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                          errors.ancienBulletin ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <BookOpen className="w-8 h-8 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Cliquez pour téléverser</span> ou glissez-déposez
                          </p>
                          <p className="text-xs text-gray-500">
                            JPG, PNG ou PDF (max. 5MB)
                          </p>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <BookOpen className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{ancienBulletinFile.name}</p>
                            <p className="text-xs text-gray-500">
                              {(ancienBulletinFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeFile('ancienBulletin')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {errors.ancienBulletin && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.ancienBulletin}
                    </p>
                  )}
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                Téléversez des photos ou scans des documents. Formats acceptés : JPG, PNG, PDF.
              </p>
            </div>

            {/* Informations importantes */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Informations importantes
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Votre demande sera examinée par l'administration</li>
                <li>• Un rendez-vous sera programmé pour finaliser l'inscription</li>
                <li>• Apportez tous les documents originaux au rendez-vous</li>
                <li>• Tous les champs marqués d'un * sont obligatoires</li>
                <li>• Les documents doivent être lisibles et complets</li>
              </ul>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/parent/dashboard')}
                className="flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Envoi en cours...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Envoyer la demande</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 