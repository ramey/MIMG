/**
 * @file - routes for scores API
 */
const express = require('express');
const router = express.Router();
const ctrlScore = require('../controllers/scores');

router.post('/', ctrlScore.createScore);
router.get('/:username', ctrlScore.getScore);
router.put('/:username', ctrlScore.updateScore);
router.delete('/:username', ctrlScore.deleteScore);

module.exports = router;