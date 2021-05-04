const Sauce = require('../models/Sauce.js');
const fs = require('fs');

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.addNewSauce = (req, res, next) => {
    const sauce = JSON.parse(req.body.sauce)
    const newSauce = new Sauce ({
        ...sauce,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    newSauce.save()
        .then(() => res.status(200).json({ message: 'New sauce added !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.updateOneSauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce updated !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne ({ _id: req.params.id })
                    .then(() => res.status(200).json({ message : 'Sauce deleted !' }))
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
                    .catch((error) => { res.status(400).json({ error }); });
                }
                if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id : req.params.id }, {
                        $inc: { dislikes : -1 },
                        $pull: { usersDisliked : req.body.userId }
                    })
                    .then(() => { res.status(201).json({ message : 'Dislike removed !'}); })
                    .catch((error) => { res.status(400).json({ error }); });
                }
            })
            .catch((error) => { res.status(404).json({ error }); });
            break;
        default: console.error('bad request');
    }
};