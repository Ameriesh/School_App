const fetch = require('node-fetch');

async function testClassesRoute() {
  try {
    console.log('Test de la route /classes...');
    
    const response = await fetch('http://localhost:5000/api/demandes-inscription-enfants/classes');
    
    console.log('Status:', response.status);
    console.log('Headers:', response.headers.get('content-type'));
    
    if (response.ok) {
      const data = await response.json();
      console.log('Classes récupérées:', data);
      console.log('Nombre de classes:', data.length);
    } else {
      const error = await response.text();
      console.error('Erreur:', error);
    }
  } catch (error) {
    console.error('Erreur de connexion:', error.message);
  }
}

testClassesRoute(); 