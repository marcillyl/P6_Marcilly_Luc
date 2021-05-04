const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController.js');
const rateLimit = require('express-rate-limit');
const limiterLogin = rateLimit({
    windowMs : 10 * 60 * 1000,
    max : 10
});

router.post('/signup', userCtrl.signup);
router.post('/login', limiterLogin, userCtrl.login);

module.exports = router;