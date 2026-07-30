const express = require('express');
const router = express.Router();
const translationController = require('../controllers/translationController');
const { authenticate } = require('../middleware/auth');

router.get('/translations', translationController.getTranslations);
router.put('/translations', authenticate, translationController.updateTranslations);

module.exports = router;
