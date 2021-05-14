const Sauce = require('../models/sauce.js'); // Récupération du modèle Sauce
const fs = require('fs'); // Importation de "file system" pour télécharget et modifier les images

// Récupération de toute les sauces de la bdd
exports.getAllSauces = (req, res, next) => {
    // Methode find pour récupérer toutes les sauces contenues dans la bdd
    Sauce.find()
        // On retourne un tableau avec toutes les données
        .then(sauces => res.status(200).json(sauces))
        // On retourne l'erreur
        .catch(error => res.status(400).json({ error }));
};

// Récupération d'une seule sauce
exports.getOneSauce = (req, res, next) => {
    // Méthode findOne + objet de comparaison : l'id de la sauce doit être le même que le paramètre de la requête
    Sauce.findOne({ _id: req.params.id })
        // On retourne l'objet
        .then(sauce => res.status(200).json(sauce))
        // On retourne l'erreur
        .catch(error => res.status(404).json({ error }));
};

exports.addNewSauce = (req, res, next) => {
    // On stocke les informations du front dans un objet js
    const sauce = JSON.parse(req.body.sauce)
    // Création d'une instance du modèle Sauce
    const newSauce = new Sauce ({
        // Opérateur spread ... pour copier les éléments de sauce
        ...sauce,
        // Modification de l'url de l'image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    // Sauvegarde de la sauce dans la bdd dans la collection "Sauces"
    newSauce.save()
        .then(() => res.status(200).json({ message: 'New sauce added !'}))
        // On retourne l'erreur
        .catch(error => res.status(400).json({ error }));
};

exports.updateOneSauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce updated !'}))
        // On retourne l'erreur
        .catch(error => res.status(400).json({ error }));
};

exports.deleteOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne ({ _id: req.params.id })
                    .then(() => res.status(200).json({ message : 'Sauce deleted !' }))
                    // On retourne l'erreur
                    .catch(error => res.status(400).json({ error }));
            })
        })
};

exports.rateSauce = (req, res, next) => {
    switch (req.body.like) {
        case 1:
            Sauce.findOne({ _id : req.params.id })
            .then (sauce => {
                if (sauce.usersLiked.includes(req.body.userId) || sauce.usersDisliked.includes(req.body.userId)) {
                    res.status(400).json({ 'error' : 'Sauce already liked / disliked !' })
                } else {
                    Sauce.updateOne({ _id : req.params.id }, {
                        $inc: { likes : 1 },
                        $push: { usersLiked : req.body.userId }
                    })
                    .then(() => { res.status(201).json({ message : 'Sauce liked !'}); })
                    // On retourne l'erreur
                    .catch((error) => { res.status(400).json({ error }); });
                }
            })
            .catch((error) => { res.status(404).json({ error }); });
            break;
        case -1:
            Sauce.findOne({ _id : req.params.id })
            .then (sauce => {
                if (sauce.usersLiked.includes(req.body.userId) || sauce.usersDisliked.includes(req.body.userId)) {
                    res.status(400).json({ 'error' : 'Sauce already liked / disliked !' })
                } else {
                    Sauce.updateOne({ _id : req.params.id }, {
                        $inc: { dislikes : 1 },
                        $push: { usersDisliked : req.body.userId }
                    })
                    .then(() => { res.status(201).json({ message : 'Sauce disliked !'}); })
                    // On retourne l'erreur
                    .catch((error) => { res.status(400).json({ error }); });
                }
            })
            .catch((error) => { res.status(404).json({ error }); });
            break;
        case 0:
            Sauce.findOne({ _id : req.params.id })
            .then (sauce => {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id : req.params.id }, {
                        $inc: { likes : -1 },
                        $pull: { usersLiked : req.body.userId }
                    })
                    .then(() => { res.status(201).json({ message : 'Like removed !'}); })
                    // On retourne l'erreur
                    .catch((error) => { res.status(400).json({ error }); });
                }
                if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id : req.params.id }, {
                        $inc: { dislikes : -1 },
                        $pull: { usersDisliked : req.body.userId }
                    })
                    .then(() => { res.status(201).json({ message : 'Dislike removed !'}); })
                    // On retourne l'erreur
                    .catch((error) => { res.status(400).json({ error }); });
                }
            })
            .catch((error) => { res.status(404).json({ error }); });
            break;
        default: console.error('bad request');
    }
};