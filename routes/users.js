const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

router.post('/signup', usersController.signup);
router.post('/login', usersController.login);
router.post('/google-auth', usersController.googleAuth);

module.exports = router;
