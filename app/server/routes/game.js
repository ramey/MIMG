const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const ctrlGame = require('../controllers/game');

const auth = jwt({
    secret: 'mimgsecret',
    userProperty: 'payload'
});


router.get('/', auth, ctrlGame.game);
router.get('/images', auth, ctrlGame.images);

router.post('/images', auth, ctrlGame.submit);
module.exports = router;