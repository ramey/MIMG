const express = require('express');
const router = express.Router();
const ctrlGame = require('../controllers/game');

router.get('/', ctrlGame.getQuestions);

module.exports = router;