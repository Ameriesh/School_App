const mongoose = require('mongoose');
require('dotenv').config();

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school_app')
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur connexion MongoDB:', err));

// Modèle Classe
const Classe = require('./src/models/Classe');

async function checkClasses() {
  try {
    console.log('Vérification des classes dans la base de données...');
    
    const classes = await Classe.find().sort({ nomclass: 1 });
    
    console.log('Classes trouvées:', classes.length);
    
    if (classes.length === 0) {
      console.log('Aucune classe trouvée. Création de quelques classes de test...');
      
      const testClasses = [
        { nomclass: 'CP', capacite: 30, niveau: 'Primaire' },
        { nomclass: 'CE1', capacite: 30, niveau: 'Primaire' },
        { nomclass: 'CE2', capacite: 30, niveau: 'Primaire' },
        { nomclass: 'CM1', capacite: 30, niveau: 'Primaire' },
        { nomclass: 'CM2', capacite: 30, niveau: 'Primaire' },
        { nomclass: '6ème', capacite: 35, niveau: 'Collège' },
        { nomclass: '5ème', capacite: 35, niveau: 'Collège' },
        { nomclass: '4ème', capacite: 35, niveau: 'Collège' },
        { nomclass: '3ème', capacite: 35, niveau: 'Collège' }
      ];
      
      await Classe.insertMany(testClasses);
      console.log('Classes de test créées avec succès!');
      
      const newClasses = await Classe.find().sort({ nomclass: 1 });
      console.log('Nouvelles classes:', newClasses);
    } else {
      console.log('Classes existantes:');
      classes.forEach(classe => {
        console.log(`- ${classe.nomclass} (${classe.niveau}) - Capacité: ${classe.capacite}`);
      });
    }
    
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkClasses(); 