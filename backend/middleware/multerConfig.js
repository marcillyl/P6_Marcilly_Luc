const multer = require('multer'); // Importation de multer pour gérer les fichiers entrants dans les requêtes http

// Dictionnaire MIME_TYPES pour ajouter une extention aux fichiers
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png',
}

// Objet de configuration pour indiquer à multer où et sous quel nom enregistrer les fichiers
const storage = multer.diskStorage({
    // Destination = dossier 'images'
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    // Nouveau nom à partir du nom d'origine + underscores + timestamp + format
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        callback(null, name + Date.now() + '.' + MIME_TYPES[file.mimetype]);
    }
});

module.exports = multer({
    // On passe l'objet storage au module qu'on exporte
    storage: storage
    // Fichier unique de type image
}).single('image');