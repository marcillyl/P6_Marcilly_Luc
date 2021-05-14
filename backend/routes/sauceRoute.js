const express = require('express'); // Importation d'express
const router = express.Router(); // Création d'un routeur grâce à express
const auth = require('../middleware/authConfig.js'); // Importation du middleware auth pour sécuriser les routes
const multer = require('../middleware/multerConfig.js'); // Importation du middleware multer pour la gestion des images
const sauceCtrl = require('../controllers/sauceController.js'); // Importation du controller

// Création des différentes routes de l'API
// Le middleware auth est appliqué à toutes les routes pour les sécuriser
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.addNewSauce);
router.put('/:id', auth, multer, sauceCtrl.updateOneSauce);
router.delete('/:id', auth, sauceCtrl.deleteOneSauce);
router.post('/:id/like', auth, sauceCtrl.rateSauce);

module.exports = router;