/**
 * @file - routes for main game
 */
const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const ctrlGame = require('../controllers/game');

/**
 * middleware for authorization
 */
const auth = jwt({
    secret: 'mimgsecret',
    userProperty: 'payload'
});


router.get('/images', auth, ctrlGame.images);

router.post('/images', auth, ctrlGame.submit);
module.exports = router;