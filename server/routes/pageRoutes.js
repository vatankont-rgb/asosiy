const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, pageRules } = require('../validators/rules');

// Public route
router.get('/pages', pageController.getPages);

// Admin routes
router.post('/pages', authenticate, authorize(['Super Admin', 'Admin', 'Editor']), pageRules, validate, pageController.createPage);
router.put('/pages/:id', authenticate, authorize(['Super Admin', 'Admin', 'Editor']), pageRules, validate, pageController.updatePage);
router.delete('/pages/:id', authenticate, authorize(['Super Admin', 'Admin']), pageController.deletePage);

module.exports = router;
