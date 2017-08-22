/**
 * @file - route file for user routes like login, register
 */
const express = require('express');
const router = express.Router();
const ctrlAuth = require('./../controllers/users');

router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
module.exports = router;
