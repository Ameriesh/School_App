# Système de Demandes d'Inscription Parents

## Vue d'ensemble

Ce système permet aux parents de soumettre des demandes d'inscription pour accéder à l'espace parent de SchoolApp. L'administrateur peut ensuite approuver ou rejeter ces demandes, et les parents reçoivent automatiquement leurs identifiants de connexion par email.

## Fonctionnalités

### Pour les Parents
- Formulaire d'inscription en ligne
- Saisie des informations personnelles et des enfants
- Confirmation de réception de la demande
- Réception automatique des identifiants par email

### Pour l'Administrateur
- Tableau de bord avec statistiques des demandes
- Interface de gestion des demandes
- Possibilité d'approuver ou rejeter les demandes
- Envoi automatique d'emails avec les identifiants

## Configuration

### Variables d'environnement

Créez un fichier `.env` dans le dossier `backend` avec les variables suivantes :

```env
# Configuration de la base de données
MONGODB_URI=mongodb://localhost:27017/school_app

# Configuration du serveur
PORT=5000

# Configuration JWT
JWT_SECRET=votre_secret_jwt_tres_securise

# Configuration email (pour les demandes d'inscription)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre_email@gmail.com
SMTP_PASS=votre_mot_de_passe_application

# URL du frontend
FRONTEND_URL=http://localhost:3000
```

### Configuration Email

Pour utiliser Gmail comme service d'email :

1. Activez l'authentification à deux facteurs sur votre compte Gmail
2. Générez un mot de passe d'application
3. Utilisez ce mot de passe dans `SMTP_PASS`

## Installation

1. Installer les dépendances :
```bash
npm install nodemailer bcryptjs
```

2. Configurer les variables d'environnement

3. Démarrer le serveur :
```bash
npm start
```

## API Endpoints

### Demandes d'inscription

- `POST /api/demandes-inscription` - Créer une nouvelle demande
- `GET /api/demandes-inscription` - Récupérer toutes les demandes (admin)
- `GET /api/demandes-inscription/:id` - Récupérer une demande spécifique
- `PUT /api/demandes-inscription/:id/traiter` - Traiter une demande (approuver/rejeter)
- `DELETE /api/demandes-inscription/:id` - Supprimer une demande
- `GET /api/demandes-inscription/statistiques` - Statistiques des demandes

## Workflow

1. **Demande parent** : Le parent remplit le formulaire d'inscription
2. **Validation** : Le système vérifie les informations et crée la demande
3. **Notification admin** : L'admin voit la nouvelle demande dans son tableau de bord
4. **Traitement** : L'admin examine et approuve/rejette la demande
5. **Création compte** : Si approuvée, un compte parent est créé automatiquement
6. **Envoi identifiants** : Les identifiants sont envoyés par email au parent
7. **Connexion** : Le parent peut se connecter avec ses identifiants

## Sécurité

- Validation des données côté serveur
- Hachage des mots de passe avec bcrypt
- Authentification JWT pour les routes admin
- Protection contre les doublons d'email
- Génération sécurisée de mots de passe

## Modèles de données

### DemandeInscription
```javascript
{
  parent: {
    nom: String,
    prenom: String,
    email: String,
    telephone: String,
    adresse: String,
    enfants: [{
      nom: String,
      prenom: String,
      classe: ObjectId
    }]
  },
  statut: 'en_attente' | 'approuvee' | 'rejetee',
  dateDemande: Date,
  dateTraitement: Date,
  traitePar: ObjectId,
  commentaire: String
}
```

## Interface utilisateur

### Pages créées
- `/parent/register` - Formulaire d'inscription
- `/parent/confirmation` - Page de confirmation
- `/admin/demandes-inscription` - Gestion des demandes

### Intégrations
- Tableau de bord admin mis à jour avec les statistiques
- Sidebar admin avec lien vers les demandes
- Notifications en temps réel

## Support

Pour toute question ou problème, consultez la documentation ou contactez l'équipe de développement. 