const nodemailer = require('nodemailer');

// Configuration du transporteur email (à adapter selon votre fournisseur)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true pour 465, false pour les autres ports
  auth: {
    user: process.env.SMTP_USER || 'amerieninmazou@gmail.com',
    pass: process.env.SMTP_PASS || 'tnhr dljx rfpo xovi'
  }
});

// Envoyer les identifiants de connexion aux parents
const sendParentCredentials = async (email, nom, prenom, motDePasse) => {
  const mailOptions = {
    from: `"SchoolApp" <${process.env.SMTP_USER || 'amerieninmazou@gmail.com.com'}>`,
    to: email,
    subject: 'Votre compte parent a été activé - SchoolApp',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px;">
        <div style="background: white; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- En-tête -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #2563eb, #06b6d4); width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
              <span style="color: white; font-size: 24px; font-weight: bold;">S</span>
            </div>
            <h1 style="color: #1e293b; margin: 0; font-size: 24px;">Bienvenue sur SchoolApp !</h1>
            <p style="color: #64748b; margin: 5px 0 0 0;">Votre espace parent est maintenant accessible</p>
          </div>

          <!-- Contenu principal -->
          <div style="margin-bottom: 30px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Bonjour <strong>${prenom} ${nom}</strong>,
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Nous avons le plaisir de vous informer que votre demande d'accès à l'espace parent a été <strong>approuvée</strong>.
            </p>

            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              Vous pouvez maintenant vous connecter à votre espace personnel pour suivre la scolarité de vos enfants.
            </p>

            <!-- Identifiants -->
            <div style="background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border: 2px solid #0ea5e9; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 18px;">Vos identifiants de connexion :</h3>
              
              <div style="background: white; border-radius: 6px; padding: 15px; margin-bottom: 10px;">
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                  <span style="color: #6b7280; font-weight: 500; min-width: 80px;">Email :</span>
                  <span style="color: #1f2937; font-weight: 600;">${email}</span>
                </div>
                <div style="display: flex; align-items: center;">
                  <span style="color: #6b7280; font-weight: 500; min-width: 80px;">Mot de passe :</span>
                  <span style="color: #1f2937; font-weight: 600; font-family: monospace; background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">${motDePasse}</span>
                </div>
              </div>
              
              <p style="color: #0c4a6e; font-size: 14px; margin: 0; font-style: italic;">
                ⚠️ Pour des raisons de sécurité, nous vous recommandons de changer votre mot de passe après votre première connexion.
              </p>
            </div>

            <!-- Bouton de connexion -->
            <div style="text-align: center; margin-bottom: 25px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173/'}/parent/login" 
                 style="background: linear-gradient(135deg, #2563eb, #06b6d4); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);">
                🚀 Accéder à mon espace parent
              </a>
            </div>
          </div>

          <!-- Fonctionnalités -->
          <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 16px;">Ce que vous pouvez faire :</h3>
            <ul style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li>Consulter les notes de vos enfants</li>
              <li>Suivre leur progression scolaire</li>
              <li>Communiquer avec les enseignants</li>
              <li>Recevoir les bulletins de notes</li>
              <li>Consulter l'emploi du temps</li>
            </ul>
          </div>

          <!-- Sécurité -->
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 0 6px 6px 0;">
            <h4 style="color: #92400e; margin: 0 0 8px 0; font-size: 14px;">🔒 Conseils de sécurité :</h4>
            <ul style="color: #92400e; font-size: 13px; line-height: 1.5; margin: 0; padding-left: 18px;">
              <li>Changez votre mot de passe dès votre première connexion</li>
              <li>Ne partagez jamais vos identifiants</li>
              <li>Déconnectez-vous après chaque utilisation</li>
              <li>Utilisez un navigateur sécurisé</li>
            </ul>
          </div>
        </div>

        <!-- Pied de page -->
        <div style="text-align: center; margin-top: 20px;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            Cet email a été envoyé automatiquement. Merci de ne pas y répondre.
          </p>
          <p style="color: #6b7280; font-size: 12px; margin: 5px 0 0 0;">
            © 2024 SchoolApp - Tous droits réservés
          </p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé avec succès:', info.messageId);
    return info;
  } catch (error) {
    console.error('Erreur envoi email:', error);
    throw error;
  }
};

// Envoyer un email de confirmation de demande
const sendDemandeConfirmation = async (email, nom, prenom) => {
  const mailOptions = {
    from: `"SchoolApp" <${process.env.SMTP_USER || 'amerieninmazou@gmail.com'}>`,
    to: email,
    subject: 'Confirmation de votre demande d\'inscription - SchoolApp',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px;">
        <div style="background: white; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #2563eb, #06b6d4); width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
              <span style="color: white; font-size: 24px; font-weight: bold;">✓</span>
            </div>
            <h1 style="color: #1e293b; margin: 0; font-size: 24px;">Demande reçue !</h1>
            <p style="color: #64748b; margin: 5px 0 0 0;">Votre demande d'inscription a été enregistrée</p>
          </div>

          <div style="margin-bottom: 30px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Bonjour <strong>${prenom} ${nom}</strong>,
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Nous avons bien reçu votre demande d'accès à l'espace parent de SchoolApp.
            </p>

            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Notre équipe administrative va examiner votre demande et vous contactera dans les plus brefs délais.
            </p>

            <div style="background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px; padding: 20px;">
              <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 16px;">Prochaines étapes :</h3>
              <ol style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Vérification de vos informations</li>
                <li>Validation par l'administrateur</li>
                <li>Création de votre compte</li>
                <li>Envoi de vos identifiants de connexion</li>
              </ol>
            </div>
          </div>

          <div style="text-align: center; margin-bottom: 25px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Vous recevrez un email dès que votre compte sera activé.
            </p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            © 2024 SchoolApp - Tous droits réservés
          </p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email de confirmation envoyé:', info.messageId);
    return info;
  } catch (error) {
    console.error('Erreur envoi email de confirmation:', error);
    throw error;
  }
};

// Envoyer un email de rejet
const sendDemandeRejet = async (email, nom, prenom, commentaire) => {
  const mailOptions = {
    from: `"SchoolApp" <${process.env.SMTP_USER || 'amerieninmazou@gmail.com'}>`,
    to: email,
    subject: 'Réponse à votre demande d\'inscription - SchoolApp',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px;">
        <div style="background: white; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: #fef2f2; border: 2px solid #ef4444; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
              <span style="color: #dc2626; font-size: 24px; font-weight: bold;">×</span>
            </div>
            <h1 style="color: #1e293b; margin: 0; font-size: 24px;">Demande non approuvée</h1>
            <p style="color: #64748b; margin: 5px 0 0 0;">Votre demande d'inscription n'a pas pu être acceptée</p>
          </div>

          <div style="margin-bottom: 30px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Bonjour <strong>${prenom} ${nom}</strong>,
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Nous avons examiné votre demande d'accès à l'espace parent de SchoolApp.
            </p>

            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Malheureusement, nous ne pouvons pas approuver votre demande pour le moment.
            </p>

            ${commentaire ? `
            <div style="background: #fef2f2; border: 2px solid #ef4444; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <h3 style="color: #dc2626; margin: 0 0 10px 0; font-size: 16px;">Raison :</h3>
              <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0;">${commentaire}</p>
            </div>
            ` : ''}

            <div style="background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px; padding: 20px;">
              <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 16px;">Que faire maintenant ?</h3>
              <ul style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Vérifiez que toutes vos informations sont correctes</li>
                <li>Assurez-vous que vos enfants sont bien inscrits dans l'établissement</li>
                <li>Vous pouvez soumettre une nouvelle demande si nécessaire</li>
                <li>Contactez l'établissement pour plus d'informations</li>
              </ul>
            </div>
          </div>

          <div style="text-align: center; margin-bottom: 25px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Pour toute question, n'hésitez pas à contacter l'établissement.
            </p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            © 2024 SchoolApp - Tous droits réservés
          </p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email de rejet envoyé:', info.messageId);
    return info;
  } catch (error) {
    console.error('Erreur envoi email de rejet:', error);
    throw error;
  }
};

module.exports = {
  sendParentCredentials,
  sendDemandeConfirmation,
  sendDemandeRejet
}; 