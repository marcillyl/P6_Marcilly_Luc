const Sauce = require('../models/Sauce.js');
const fs = require('fs');

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne ({
        _id: req.params.id
    })
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