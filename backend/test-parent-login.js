const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Parent = require('./src/models/Parents');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/school_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function testParentLogin() {
  try {
    console.log('=== TEST CONNEXION PARENT ===');
    
    // 1. Vérifier les parents existants
    const parents = await Parent.find({});
    console.log(`Nombre de parents dans la base: ${parents.length}`);
    
    parents.forEach((parent, index) => {
      console.log(`\nParent ${index + 1}:`);
      console.log(`- ID: ${parent._id}`);
      console.log(`- Nom: ${parent.nom} ${parent.prenom}`);
      console.log(`- Email: ${parent.email}`);
      console.log(`- Compte actif: ${parent.compteActif}`);
      console.log(`- Mot de passe hashé: ${parent.motDePasse ? 'Oui' : 'Non'}`);
      console.log(`- Date activation: ${parent.dateActivation}`);
    });
    
    // 2. Tester la recherche par email
    if (parents.length > 0) {
      const testParent = parents[0];
      console.log(`\n=== TEST RECHERCHE PAR EMAIL ===`);
      console.log(`Email recherché: ${testParent.email}`);
      
      const foundParent = await Parent.findOne({
        $or: [
          { email: testParent.email },
          { email1: testParent.email },
          { email2: testParent.email }
        ]
      });
      
      if (foundParent) {
        console.log('✅ Parent trouvé par email');
        console.log(`- Nom: ${foundParent.nom} ${foundParent.prenom}`);
        console.log(`- Compte actif: ${foundParent.compteActif}`);
      } else {
        console.log('❌ Parent non trouvé par email');
      }
    }
    
    // 3. Créer un parent de test si aucun n'existe
    if (parents.length === 0) {
      console.log('\n=== CRÉATION PARENT DE TEST ===');
      
      const motDePasse = 'test123';
      const motDePasseHash = await bcrypt.hash(motDePasse, 10);
      
      const testParent = new Parent({
        nom: 'Test',
        prenom: 'Parent',
        email: 'test@parent.com',
        telephone: '0123456789',
        adresse: '123 Rue Test',
        motDePasse: motDePasseHash,
        compteActif: true,
        dateActivation: new Date()
      });
      
      await testParent.save();
      console.log('✅ Parent de test créé');
      console.log(`- Email: test@parent.com`);
      console.log(`- Mot de passe: ${motDePasse}`);
    }
    
  } catch (error) {
    console.error('Erreur lors du test:', error);
  } finally {
    mongoose.connection.close();
  }
}

testParentLogin(); 