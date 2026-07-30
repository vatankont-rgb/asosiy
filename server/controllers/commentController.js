const commentRepository = require('../repositories/commentRepository');
const { formatResponse } = require('../utils/helpers');

// Simple HTML escape to prevent XSS in plain text fields
const escapeHtml = (str) => String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');

class CommentController {
  async getAllComments(req, res, next) {
    try {
      const list = await commentRepository.getAll();
      return res.status(200).json(formatResponse({ data: list }));
    } catch (err) {
      next(err);
    }
  }

  async getCommentsByArticle(req, res, next) {
    try {
      const { articleId } = req.params;
      const list = await commentRepository.getByArticleId(articleId);
      // Filter out rejected or spam comments for public view
      const active = list.filter(c => c.status !== 'rejected' && c.status !== 'spam');
      return res.status(200).json(formatResponse({ data: active }));
    } catch (err) {
      next(err);
    }
  }

  async addComment(req, res, next) {
    try {
      const { articleId } = req.params;
      const { name, text } = req.body;
      const newComment = {
        id: `comment-${Date.now()}`,
        articleId,
        name: escapeHtml(name ? name.trim() : 'Mehmon'),
        text: escapeHtml(text.trim()),
        status: 'approved', // Auto-approved by default in current setup, but ready for moderation queue
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await commentRepository.create(newComment);
      return res.status(201).json(formatResponse({ message: 'Comment added successfully', data: newComment }));
    } catch (err) {
      next(err);
    }
  }

  async moderateComment(req, res, next) {
    try {
      const { id } = req.params;
      const { status, pinned } = req.body;
      
      const updates = {};
      if (status) updates.status = status; // approved, rejected, spam
      if (typeof pinned !== 'undefined') updates.pinned = pinned;

      const updated = await commentRepository.update(id, updates);
      if (!updated) return res.status(404).json(formatResponse({ success: false, message: 'Comment not found' }));

      return res.status(200).json(formatResponse({ message: 'Comment moderated successfully', data: updated }));
    } catch (err) {
      next(err);
    }
  }

  async deleteComment(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await commentRepository.delete(id);
      if (!deleted) return res.status(404).json(formatResponse({ success: false, message: 'Comment not found' }));
      return res.status(200).json(formatResponse({ message: 'Comment deleted successfully' }));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CommentController();
