const jwt = require('jsonwebtoken'); // Importation de jsonwebtoken

module.exports = (req, res, next) => {
    try {
        // Récupération du token dans le header de la requête
        const token = req.headers.authorization.split(' ')[1];
        // Décodage du token avec la clef stockée dans .env
        const decodedToken = jwt.verify(token, process.env.TOKEN);
        const userId = decodedToken.userId;
        // Comparaison du userId envoyé dans la requête et du userId encodé dans le token
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid userId !';
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: 'Authentification error !' })
    }
};