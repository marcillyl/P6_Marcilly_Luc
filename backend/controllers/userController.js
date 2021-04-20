const User = require('../models/User.js');

exports.signup = ((req, res, next) => {
    console.log(req.body);
    var user = new User({
        email: req.body.email,
        password: req.body.password
    })
    user.save()
    .then(() => {
        res.status(201).json({
            message: 'New user created !'
        })
    })
    .catch(err => {
        res.status(400).json({
            message: 'Error, please try again !',
            error: err
        })
    })
});

exports.login = ((req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Unknown user !' });
            }
            if (req.body.password === user.password)
                res.status(200).json({
                    userId: user._id,
                    token : 'TOKEN'
                })
            else {
                res.status(401).json({ message: 'Wrong password !' });
            }
        })
        .catch(error => res.status(500).json({ error }));
});