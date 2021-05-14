const mongoose = require('mongoose'); // Importation de mongoose pour la création de schéma
const uniqueValidator = require('mongoose-unique-validator'); // Module pour garantir un email unique
const encryption = require('mongoose-encryption'); // Module pour crypter l'email

// Création d'un schéma de données utilisateur
const userSchema = mongoose.Schema({
    email : { type: String, required: true, unique: true },
    password : { type: String, required: true }
});

// Déclaration des clefs de cryptage et décryptages stockées dans .env
var encKey = process.env.SOME_32BYTE_BASE64_STRING;
var sigKey = process.env.SOME_64BYTE_BASE64_STRING;

// Appel de la méthode plugin à qui on passe encryption
userSchema.plugin(encryption, { encryptionKey: encKey, signingKey: sigKey });
// Appel de la méthode plugin à qui on passe uniqueValidator
userSchema.plugin(uniqueValidator);

// Exportation du schema sous forme de model
module.exports = mongoose.model('User', userSchema);