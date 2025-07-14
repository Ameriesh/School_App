const nodemailer = require('nodemailer');
require('dotenv').config();

// Test de la configuration email
async function testEmail() {
  console.log('🔧 Test de la configuration email...');
  
  // Vérifier les variables d'environnement
  console.log('Variables d\'environnement :');
  console.log('SMTP_HOST:', process.env.SMTP_HOST || 'Non défini');
  console.log('SMTP_PORT:', process.env.SMTP_PORT || 'Non défini');
  console.log('SMTP_USER:', process.env.SMTP_USER || 'Non défini');
  console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'Défini' : 'Non défini');
  
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('❌ Variables d\'environnement manquantes !');
    console.log('Veuillez créer un fichier .env avec la configuration SMTP');
    return;
  }

  // Créer le transporteur
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  try {
    // Tester la connexion
    console.log('🔍 Test de connexion SMTP...');
    await transporter.verify();
    console.log('✅ Connexion SMTP réussie !');
    
    // Envoyer un email de test
    console.log('📧 Envoi d\'un email de test...');
    const info = await transporter.sendMail({
      from: `"SchoolApp Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Envoyer à soi-même pour le test
      subject: 'Test de configuration - SchoolApp',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Test de configuration réussi !</h2>
          <p>La configuration email de SchoolApp fonctionne correctement.</p>
          <p>Date du test : ${new Date().toLocaleString()}</p>
        </div>
      `
    });
    
    console.log('✅ Email de test envoyé avec succès !');
    console.log('Message ID:', info.messageId);
    
  } catch (error) {
    console.error('❌ Erreur lors du test :', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('💡 Problème d\'authentification. Vérifiez :');
      console.log('   - Votre email et mot de passe');
      console.log('   - Si vous utilisez Gmail, utilisez un mot de passe d\'application');
    } else if (error.code === 'ECONNECTION') {
      console.log('💡 Problème de connexion. Vérifiez :');
      console.log('   - Votre connexion internet');
      console.log('   - Les paramètres SMTP (host, port)');
      console.log('   - Votre pare-feu');
    }
  }
}

// Exécuter le test
testEmail(); 