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
    let sauceObject = { };
    // Si la modification de la sauce inclut un changement d'image
    req.file ? (
        Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            // Récupération de l'url du fichier, split autour de la chaine de caractères
            const filename = sauce.imageUrl.split('/images/')[1];
            // Appel de la méthode unlinkSync pour supprimer l'image actuelle
            fs.unlinkSync(`images/${filename}`)
        }), sauceObject = {
            // Ajout de la nouvelle image
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }) : (sauceObject = { ...req.body }); // Poursuite de la modification de la sauce avec la méthode UpdateOne
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce updated !'}))
        // On retourne l'erreur
        .catch(error => res.status(400).json({ error }));
};

exports.deleteOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        // Suppression de l'image de la bdd avant de supprimer la sauce
        .then(sauce => {
            // Récupération de l'url du fichier, split autour de la chaine de caractères
            const filename = sauce.imageUrl.split('/images/')[1];
            // Appel de la méthode unlink pour supprimer le fichier
            fs.unlink(`images/${filename}`, () => {
                // Suppression de la sauce de la bdd avec deleteOne
                Sauce.deleteOne ({ _id: req.params.id })
                    .then(() => res.status(200).json({ message : 'Sauce deleted !' }))
                    // On retourne l'erreur
                    .catch(error => res.status(400).json({ error }));
            })
        })
};

exports.rateSauce = (req, res, next) => {
    switch (req.body.like) {
        // Scénario ajout d'un like
        case 1:
            Sauce.findOne({ _id : req.params.id })
            .then (sauce => {
                // Si l'utilisateur a déjà noté la sauce, en renvoit une erreur
                if (sauce.usersLiked.includes(req.body.userId) || sauce.usersDisliked.includes(req.body.userId)) {
                    res.status(400).json({ 'error' : 'Sauce already liked / disliked !' })
                } else {
                    // Si l'utilisateur n'a pas déjà noté la sauce, on incrémente likes et ajoute son userId à usersLiked
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
        // Scénario ajout d'un dislike
        case -1:
            Sauce.findOne({ _id : req.params.id })
            .then (sauce => {
                // Si l'utilisateur a déjà noté la sauce, en renvoit une erreur
                if (sauce.usersLiked.includes(req.body.userId) || sauce.usersDisliked.includes(req.body.userId)) {
                    res.status(400).json({ 'error' : 'Sauce already liked / disliked !' })
                } else {
                    // Si l'utilisateur n'a pas déjà noté la sauce, on incrémente dislikes et ajoute son userId à usersDisliked
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
        // Scénario suppression d'un like ou dislike
        case 0:
            Sauce.findOne({ _id : req.params.id })
            .then (sauce => {
                // Si l'utilisateur a déjà like la sauce, on enlève son like et retire son userId de usersLiked
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id : req.params.id }, {
                        $inc: { likes : -1 },
                        $pull: { usersLiked : req.body.userId }
                    })
                    .then(() => { res.status(201).json({ message : 'Like removed !'}); })
                    // On retourne l'erreur
                    .catch((error) => { res.status(400).json({ error }); });
                }
                // Si l'utilisateur a déjà dislike la sauce, on enlève son dislike et retire son userId de usersDisliked
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
            // Si l'utilisateur n'a pas déjà noté la sauce, on renvoit une erreur
            .catch((error) => { res.status(404).json({ error }); });
            break;
        default: console.error('bad request');
    }
};