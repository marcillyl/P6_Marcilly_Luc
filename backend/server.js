const http = require('http'); // Import du package HTTP
const app = require('./app'); // Import de app pour utilisation de l'application sur le serveur

// Ajout du port de connexion, si aucun n'est déclaré dans .env on écoute sur le port 3000
const PORT = process.env.PORT;
app.set('port', PORT || 3000);

// Création d'une constante pour les appels serveur (requêtes et réponses)
const server = http.createServer(app);

// Le serveur écoute le port définis en amont
server.listen(PORT || 3000, () => {
    console.log(`App listening on port ${PORT || 3000}`);
});