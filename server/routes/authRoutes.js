const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { loginRules, validate } = require('../validators/rules');
const { loginLimiter } = require('../config/security');

router.post('/login', loginLimiter, loginRules, validate, authController.login);
router.post('/login/pin', loginLimiter, authController.verifyPin);
router.post('/logout', authController.logout);
router.get('/session', authenticate, authController.checkSession);
router.post('/password', authenticate, authController.changePassword);

router.get('/security/status', authenticate, authController.getSecurityStatus);
router.post('/security/pin', authenticate, authController.changePin);

module.exports = router;
