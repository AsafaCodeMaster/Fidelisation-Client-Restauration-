const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const login = require('./routes/login');
const signup = require('./routes/signup');
const api = require('./routes/api');
const home = require('./routes/protected/home');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware pour parser les données de formulaire
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static('public'));
app.use('/login', login);
app.use('/signup', signup);
app.use('/api' , api);
app.use('/profile' , home);

// Route principale (page carrousel)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});




// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
