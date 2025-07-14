const fetch = require('node-fetch');

async function testParentLoginAPI() {
  try {
    console.log('=== TEST API CONNEXION PARENT ===');
    
    // Test avec des identifiants de test
    const loginData = {
      email: 'test@parent.com',
      password: 'test123'
    };
    
    console.log('Tentative de connexion avec:', loginData);
    
    const response = await fetch('http://localhost:5000/api/parents/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ Connexion réussie !');
      console.log('Token reçu:', data.token ? 'Oui' : 'Non');
      console.log('Info parent:', data.parent ? 'Oui' : 'Non');
    } else {
      console.log('❌ Échec de la connexion');
    }
    
  } catch (error) {
    console.error('Erreur lors du test API:', error);
  }
}

testParentLoginAPI(); 