const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticate, authorize } = require('../middleware/auth');
const { commentRules, validate } = require('../validators/rules');

router.get('/admin/comments', authenticate, authorize(['Super Admin', 'Admin', 'Editor']), commentController.getAllComments);
router.get('/comments/:articleId', commentController.getCommentsByArticle);
router.post('/comments/:articleId', commentRules, validate, commentController.addComment);
router.put('/admin/comments/:id', authenticate, authorize(['Super Admin', 'Admin', 'Editor']), commentController.moderateComment);
router.delete('/admin/comments/:id', authenticate, authorize(['Super Admin', 'Admin', 'Editor']), commentController.deleteComment);

module.exports = router;
