const express = require('express'); // Importation d'express
const router = express.Router(); // Création d'un routeur grâce à express
const userCtrl = require('../controllers/userController.js'); // Importation du controller

// Fixe un nombre limite de tentatives de connexions possibles
const rateLimit = require('express-rate-limit');
const limiterLogin = rateLimit({
    windowMs : 10 * 60 * 1000,
    max : 10
});

// Création des routes Inscription et Connexion de l'API
router.post('/signup', userCtrl.signup); // Création d'un nouvel utilisateur
router.post('/login', limiterLogin, userCtrl.login); // Connexion d'un utilisateur

module.exports = router;