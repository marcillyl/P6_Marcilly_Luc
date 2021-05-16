const mongoose = require('mongoose'); // Importation de mongoose pour la création de schéma
const uniqueValidator = require('mongoose-unique-validator'); // Module pour garantir un email unique

// Création d'un schéma de données utilisateur
const userSchema = mongoose.Schema({
    email : { type: String, required: true, unique: true },
    password : { type: String, required: true }
});

// Appel de la méthode plugin à qui on passe uniqueValidator
userSchema.plugin(uniqueValidator);

// Exportation du schema sous forme de model
module.exports = mongoose.model('User', userSchema);