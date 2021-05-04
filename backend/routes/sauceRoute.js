const express = require('express');
const router = express.Router();
const auth = require('../middleware/authConfig.js');
const upload = require('../middleware/uploadConfig.js');
const sauceCtrl = require('../controllers/sauceController.js');

router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, upload, sauceCtrl.addNewSauce);
router.put('/:id', auth, upload, sauceCtrl.updateOneSauce);
router.delete('/:id', auth, sauceCtrl.deleteOneSauce);
router.post('/:id/like', auth, sauceCtrl.rateSauce);

module.exports = router;