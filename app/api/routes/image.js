const express = require('express');
const router = express.Router();
const ctrlImg = require('../controllers/image');

router.get('/', ctrlImg.getImgs);
router.get('/:imgid', ctrlImg.getImg);
router.post('/:imgid', ctrlImg.createImg);
router.put('/:imgid', ctrlImg.updateImg);
router.delete('/:imgid', ctrlImg.deleteImg);

module.exports = router;