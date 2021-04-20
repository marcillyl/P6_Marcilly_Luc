const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauceController.js');
const upload = require('../middleware/uploadConfig.js');

router.get('/', sauceCtrl.getAllSauces);
router.get('/:id', sauceCtrl.getOneSauce);
router.post('/', upload, sauceCtrl.addNewSauce);
router.put('/:id', upload, sauceCtrl.updateOneSauce);
router.delete('/:id', sauceCtrl.deleteOneSauce);

module.exports = router;