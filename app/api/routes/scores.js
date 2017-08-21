const express = require('express');
const router = express.Router();
const ctrlScore = require('../controllers/score');

router.post('/', ctrlScore.createScore);
router.get('/:userid', ctrlScore.getScore);
router.put('/:userid', ctrlScore.updateScore);
router.delete('/:userid', ctrlScore.deleteScore);

module.exports = router;