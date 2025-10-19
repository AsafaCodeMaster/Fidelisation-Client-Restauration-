const express = require('express');
const path = require('path');
const router = express.Router();
// Importe les fonctions de logique métier
const loginController = require('../controllers/login');

// Route page de connexion
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
module.exports = router;

