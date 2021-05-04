require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./routes/userRoute.js');
const sauceRoute = require('./routes/sauceRoute.js');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs : 14 * 60 * 1000,
    max : 70
});

const app = express();

app.use(express.json());
app.use(limiter);
app.use(helmet());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

mongoose.connect(process.env.DB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoute);
app.use('/api/sauces', sauceRoute);

module.exports = app;