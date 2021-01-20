const express = require('express');
const authController = require('./auth.controller');

const verifyTokenMiddleware = require('../../middleware/verifyToken.middleware');

const router = express.Router();


router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);

router.post('/refresh_token', authController.refreshToken);

router.get('/whoami', verifyTokenMiddleware, authController.whoami);

module.exports = router;
