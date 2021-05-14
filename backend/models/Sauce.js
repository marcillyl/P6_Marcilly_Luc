const mongoose = require('mongoose'); // Importation de mongoose pour la création de schéma

// Création d'un schéma de données sauce
const sauceSchema = mongoose.Schema({
    userId : { type: String, required: true },
    name : { type: String, required: true },
    manufacturer : { type: String, required: true },
    description : { type: String, required: true },
    mainPepper : { type: String, required: true },
    imageUrl : { type: String, required: true },
    heat : { type: Number, required: true },
    likes : { type: Number, default: 0 },
    dislikes : { type: Number, default: 0 },
    usersLiked : { type: Array },
    usersDisliked : { type: Array }
});

// Exportation du schema sous forme de model
module.exports = mongoose.model('Sauce', sauceSchema);