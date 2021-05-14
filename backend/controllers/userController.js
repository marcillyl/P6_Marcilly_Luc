const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/user.js'); // Récupération du modèle User

// Inscription d'un utilisateur
exports.signup = (req, res, next) => {
    // Vérification du format de l'email et de la solidité du mdp avec validator
    if (validator.isEmail(req.body.email) && validator.isStrongPassword(req.body.password)) {
        // Hash du mdp avec bcrypt
        bcrypt.hash(req.body.password, 10)
        // Récupération du hash et création d'un nouvel utilisateur
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // Sauvegarde de l'utilisateur dans la bdd
            user.save()
                .then(() => res.status(201).json({ message: 'New user created !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    } else {
        throw 'Invalid email and/or password !'
    }
};

// Connexion d'un utilisateur
exports.login = (req, res, next) => {
    // Recherche de l'email saisi par l'utilisateur dans la bdd
    User.findOne({ email: req.body.email })
        .then(user => {
            // Erreur 401 unauthorized si l'utilisateur est introuvable
            if (!user) {
                return res.status(401).json({ error: 'Unknown user !' });
            }
            // Bcrypt pour comparer les hashs des mdp utilisateur et bdd
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // Erreur 401 unauthorized si les hashs ne match pas
                    if (!valid) {
                        return res.status(401).json({ error: 'Wrong password !'});
                    }
                    // Si les hashs match : création d'un objet json avec userId et token
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            // Encodage du token avec la clef stockée dans .env
                            process.env.TOKEN,
                            { expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};