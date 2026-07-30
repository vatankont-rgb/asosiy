const tagRepository = require('../repositories/tagRepository');
const { formatResponse } = require('../utils/helpers');

class TagController {
  async getTags(req, res, next) {
    try {
      const list = await tagRepository.getAll();
      return res.status(200).json(formatResponse({ data: list }));
    } catch (err) {
      next(err);
    }
  }

  async createTag(req, res, next) {
    try {
      const { name } = req.body;
      const newTag = {
        id: `tag-${Date.now()}`,
        name,
        createdAt: new Date().toISOString()
      };
      await tagRepository.create(newTag);
      return res.status(201).json(formatResponse({ message: 'Tag created successfully', data: newTag }));
    } catch (err) {
      next(err);
    }
  }

  async updateTag(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await tagRepository.update(id, req.body);
      if (!updated) return res.status(404).json(formatResponse({ success: false, message: 'Tag not found' }));
      return res.status(200).json(formatResponse({ message: 'Tag updated successfully', data: updated }));
    } catch (err) {
      next(err);
    }
  }

  async deleteTag(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await tagRepository.delete(id);
      if (!deleted) return res.status(404).json(formatResponse({ success: false, message: 'Tag not found' }));
      return res.status(200).json(formatResponse({ message: 'Tag deleted successfully' }));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TagController();
