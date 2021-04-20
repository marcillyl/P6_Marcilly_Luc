const multer = require('multer');

const MIME_TYPES = {
    'images/jpg': 'jpg',
    'images/jpeg': 'jpeg',
    'images/png': 'png',
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'image');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        callback(null, name + Date.now() + '.' + MIME_TYPES[file.mimetype]);
    }
});

module.exports = multer({
    storage: storage
}).single('image');