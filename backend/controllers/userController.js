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