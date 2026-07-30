const categoryRepository = require('../repositories/categoryRepository');
const { formatResponse } = require('../utils/helpers');

class CategoryController {
  async getCategories(req, res, next) {
    try {
      const list = await categoryRepository.getAll();
      return res.status(200).json(formatResponse({ data: list }));
    } catch (err) {
      next(err);
    }
  }

  async createCategory(req, res, next) {
    try {
      const { names, slug, parentId } = req.body;
      const newCat = {
        id: `cat-${Date.now()}`,
        names,
        slug,
        parentId: parentId || null,
        order: Date.now()
      };
      await categoryRepository.create(newCat);
      return res.status(201).json(formatResponse({ message: 'Category created successfully', data: newCat }));
    } catch (err) {
      next(err);
    }
  }

  async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await categoryRepository.update(id, req.body);
      if (!updated) return res.status(404).json(formatResponse({ success: false, message: 'Category not found' }));
      return res.status(200).json(formatResponse({ message: 'Category updated successfully', data: updated }));
    } catch (err) {
      next(err);
    }
  }

  async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await categoryRepository.delete(id);
      if (!deleted) return res.status(404).json(formatResponse({ success: false, message: 'Category not found' }));
      return res.status(200).json(formatResponse({ message: 'Category deleted successfully' }));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CategoryController();
