const languageRepository = require('../repositories/languageRepository');
const { formatResponse } = require('../utils/helpers');

class LanguageController {
  async getLanguages(req, res, next) {
    try {
      const list = await languageRepository.getAll();
      return res.status(200).json(formatResponse({ data: list }));
    } catch (err) {
      next(err);
    }
  }

  async createLanguage(req, res, next) {
    try {
      const { id, name, shortName, order, isActive } = req.body;
      const newLang = {
        id: String(id).toLowerCase(),
        name,
        shortName,
        isActive: isActive !== false,
        order: order || Date.now()
      };
      await languageRepository.create(newLang);
      return res.status(201).json(formatResponse({ message: 'Language created successfully', data: newLang }));
    } catch (err) {
      next(err);
    }
  }

  async updateLanguage(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await languageRepository.update(id, req.body);
      if (!updated) return res.status(404).json(formatResponse({ success: false, message: 'Language not found' }));
      return res.status(200).json(formatResponse({ message: 'Language updated successfully', data: updated }));
    } catch (err) {
      next(err);
    }
  }

  async deleteLanguage(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await languageRepository.delete(id);
      if (!deleted) return res.status(404).json(formatResponse({ success: false, message: 'Language not found' }));
      return res.status(200).json(formatResponse({ message: 'Language deleted successfully' }));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new LanguageController();
