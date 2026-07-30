const express = require('express');
const router = express.Router();
const languageController = require('../controllers/languageController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/languages', languageController.getLanguages);
router.post('/admin/languages', authenticate, authorize(['Super Admin', 'Admin']), languageController.createLanguage);
router.put('/admin/languages/:id', authenticate, authorize(['Super Admin', 'Admin']), languageController.updateLanguage);
router.delete('/admin/languages/:id', authenticate, authorize(['Super Admin', 'Admin']), languageController.deleteLanguage);

module.exports = router;
