const express = require('express');
const path = require('path');
const router = express.Router();
// Importe les fonctions de logique métier
const signupController = require('../controllers/signup');


// Route page d'inscription
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'..' , 'public', 'signup.html'));
});


router.post('/' , signupController.addClient);
/*
// Route API pour l'inscription
router.post('/', (req, res) => {
  const { nom, prenom, contact, password } = req.body;
  
  console.log('Données d\'inscription reçues:', { nom, prenom, contact, password });
  
  // TODO: Ajoutez ici votre logique d'inscription
  // - Validation des données
  // - Vérification si l'utilisateur existe déjà
  // - Hashage du mot de passe
  // - Enregistrement dans la base de données
  
  // Exemple de réponse (à adapter selon vos besoins)

  res.json({ 
    success: true, 
    message: 'Inscription réussie',
    redirect: '/login' 
  });
});
*/
module.exports = router;