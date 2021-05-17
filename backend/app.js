require('dotenv').config();
const express = require('express'); // Important d'express -- famework node.js
const mongoose = require('mongoose'); // Importation de mongoose pour se connecter à la bdd

// Sécurisation : hsts (impose des connexions sécurisées), filtres de scripts XSS, noSniff, csp contre les attaques cross-site etc.
const helmet = require('helmet');

// Fixe un taux limite pour les requêtes
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs : 10 * 60 * 1000,
    max : 200
});

const app = express(); // Utilisation de l'application express

app.use(express.json());
app.use(limiter); // Limitation du nombre de requêtes à l'application
app.use(helmet()); // Sécurisation de l'application avec Helmet

// Headers permettant la communication entre localhost 3000 et 4200 en évitant les erreurs CORS (Cross Origin Ressource Sharing)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Connexion à MongoDB grace à l'URI stockée dans .env
mongoose.connect(process.env.DB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Gestion des ressources du dossier "images"
const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'images')));

// Importation et utilisation des routes user et sauce
const userRoute = require('./routes/userRoute.js');
const sauceRoute = require('./routes/sauceRoute.js');
app.use('/api/auth', userRoute);
app.use('/api/sauces', sauceRoute);

module.exports = app;