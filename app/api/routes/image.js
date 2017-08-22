const express = require('express');
const router = express.Router();
const ctrlImg = require('../controllers/image');

router.post('/', ctrlImg.createImg);
router.get('/:imgid', ctrlImg.getImg);
router.put('/:imgid', ctrlImg.updateImg);
router.delete('/:imgid', ctrlImg.deleteImg);
router.get('/secondary/:priImage', ctrlImg.getSecondaryImgs);
module.exports = router;