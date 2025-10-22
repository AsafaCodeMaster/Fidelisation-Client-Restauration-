const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const login = require('./routes/login');
const signup = require('./routes/signup');
const logout = require('./routes/logout');
const home = require('./routes/protected/home');
const profile = require('./routes/protected/profile');
const points = require('./routes/protected/points');
const orders = require('./routes/protected/orders');
const index = require('./routes/index');
const purchaseHistory = require('./routes/protected/purchaseHistory');
const rewardsHistory = require('./routes/protected/rewardsHistory');
const feedback = require('./routes/protected/feedback');
const changePassword = require('./routes/protected/changePassword');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cookieParser());

const allowedOrigins = [
    `http://localhost:${PORT}`,
    `http://127.0.0.1:${PORT}`,
    `http://192.168.88.5:${PORT}`,
    `http://192.168.1.100:${PORT}`
    // Ajoutez ici l'adresse IP locale si vous testez depuis un autre appareil (ex: http://192.168.x.x:3000)
];

app.use(cors({
    origin: (origin, callback) => {
        // Permet les requêtes sans 'origin' (par exemple, Postman ou Same-Origin)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true // ESSENTIEL pour envoyer/recevoir les cookies d'authentification
}));

// Middleware pour parser les données de formulaire
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir les fichiers statiques

app.use('/login', login);
app.use('/signup', signup);
app.use('/home' , home);
app.use('/points' , points);
app.use('/orders' , orders);
app.use('/purchase-History' , purchaseHistory);
app.use('/rewards-History' , rewardsHistory);
app.use('/feedback' , feedback);
app.use('/profile' , profile);
app.use('/change-password' , changePassword);
app.use('/logout' , logout);
app.use('/' , index);

// Route principale (page carrousel)

app.use(express.static('public'));



// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
