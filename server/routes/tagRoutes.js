const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, tagRules } = require('../validators/rules');

// Public route for fetching tags
router.get('/tags', tagController.getTags);

// Admin routes for tags
router.post('/tags', authenticate, authorize(['Super Admin', 'Admin', 'Editor']), tagRules, validate, tagController.createTag);
router.put('/tags/:id', authenticate, authorize(['Super Admin', 'Admin', 'Editor']), tagRules, validate, tagController.updateTag);
router.delete('/tags/:id', authenticate, authorize(['Super Admin', 'Admin']), tagController.deleteTag);

module.exports = router;
