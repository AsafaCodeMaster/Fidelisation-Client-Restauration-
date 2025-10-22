const express = require('express');
const path = require('path');
const router = express.Router();
// Importe les fonctions de logique métier
const loginController = require('../controllers/login');
const preventUnprotectedAccess = require('../middleware/preventUnprotectedAccess');

// Route page de connexion
router.get('/',preventUnprotectedAccess.preventAuthenticatedAccess, (req, res) => {
  res.render('login' , { });
});


router.post('/' , loginController.connectClient);
// Route API pour la connexion
/* router.post('/', (req, res) => {
  const { contact, password } = req.body;
  
  console.log('Données de connexion reçues:', { contact, password });
  
  // TODO: Ajoutez ici votre logique de connexion
  // - Validation des données
  // - Vérification des identifiants
  // - Création de session
  // - Génération de token JWT (optionnel)
  
  // Exemple de réponse (à adapter selon vos besoins)
  res.json({ 
    success: true, 
    message: 'Connexion réussie',
    redirect: '/dashboard' 
  });
}); */

module.exports = router;