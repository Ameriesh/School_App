# Configuration Email pour SchoolApp

## Problème identifié
L'email n'est pas envoyé car les variables d'environnement SMTP ne sont pas configurées.

## Solution

### 1. Créer un fichier .env dans le dossier backend

Créez un fichier `.env` dans le dossier `backend/` avec le contenu suivant :

```env
# Configuration de la base de données MongoDB
MONGODB_URI=mongodb://localhost:27017/school_app

# Configuration SMTP pour l'envoi d'emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-application

# URL du frontend
FRONTEND_URL=http://localhost:3000

# Port du serveur
PORT=5000
```

### 2. Configuration Gmail

Pour utiliser Gmail comme service SMTP :

1. **Activez l'authentification à 2 facteurs** sur votre compte Gmail
2. **Générez un mot de passe d'application** :
   - Allez dans les paramètres de votre compte Google
   - Sécurité > Authentification à 2 facteurs
   - Mots de passe d'application
   - Générez un nouveau mot de passe pour "Mail"
3. **Utilisez ce mot de passe** dans la variable `SMTP_PASS`

### 3. Autres services SMTP

Vous pouvez aussi utiliser d'autres services :

#### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=votre-email@outlook.com
SMTP_PASS=votre-mot-de-passe
```

#### Yahoo
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=votre-email@yahoo.com
SMTP_PASS=votre-mot-de-passe-application
```

### 4. Test de configuration

Après avoir configuré le fichier .env :

1. Redémarrez le serveur backend
2. Testez l'approbation d'une demande d'inscription
3. Vérifiez les logs du serveur pour voir si l'email est envoyé

### 5. Dépannage

Si l'email ne s'envoie toujours pas :

1. **Vérifiez les logs** dans la console du serveur
2. **Testez la connexion SMTP** avec un script simple
3. **Vérifiez que le port 587 n'est pas bloqué** par votre pare-feu
4. **Assurez-vous que l'email de destination est valide**

### 6. Alternative temporaire

Si vous ne pouvez pas configurer l'email immédiatement, vous pouvez :

1. Modifier le contrôleur pour afficher le mot de passe généré dans la réponse
2. L'administrateur peut copier le mot de passe et l'envoyer manuellement au parent 