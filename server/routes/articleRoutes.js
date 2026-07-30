const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const articleController = require('../controllers/articleController');
const { authenticate, authorize } = require('../middleware/auth');
const { articleRules, validate } = require('../validators/rules');

// Rate limit for view counter (max 30 views per IP per 15 min)
const viewLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, standardHeaders: false, legacyHeaders: false });

// Public routes
router.get('/stories', articleController.getPublicStories);
router.post('/:lang/:id/view', viewLimiter, articleController.incrementView);

// Admin routes
router.get('/admin/stories', authenticate, authorize(['Super Admin', 'Admin', 'Editor', 'Writer']), articleController.getAdminStories);
router.get('/admin/deleted', authenticate, authorize(['Super Admin', 'Admin', 'Editor']), articleController.getDeletedStories);
router.get('/admin/authors/kpi', authenticate, authorize(['Super Admin', 'Admin']), articleController.getAuthorsKpi);
router.post('/admin/stories', authenticate, authorize(['Super Admin', 'Admin', 'Editor', 'Writer']), articleRules, validate, articleController.createStory);
router.put('/admin/stories/:lang/:id', authenticate, authorize(['Super Admin', 'Admin', 'Editor', 'Writer']), articleRules, validate, articleController.updateStory);
router.delete('/admin/stories/:lang/:id', authenticate, authorize(['Super Admin', 'Admin', 'Editor']), articleController.deleteStory);
router.post('/admin/:lang/:id/restore', authenticate, authorize(['Super Admin', 'Admin', 'Editor']), articleController.restoreStory);
router.delete('/admin/:lang/:id/hard', authenticate, authorize(['Super Admin', 'Admin', 'Editor']), articleController.hardDeleteStory);
router.post('/admin/stories/reset', authenticate, authorize(['Super Admin']), articleController.resetStories);

module.exports = router;
