const pageRepository = require('../repositories/pageRepository');
const { formatResponse } = require('../utils/helpers');
const { sanitizeHtml } = require('../utils/sanitizer');

class PageController {
  async getPages(req, res, next) {
    try {
      const list = await pageRepository.getAll();
      return res.json(formatResponse({ success: true, message: '', data: list }));
    } catch (err) {
      next(err);
    }
  }

  async createPage(req, res, next) {
    try {
      const { slug, title, body } = req.body;
      const sanitizedBody = typeof body === 'object'
        ? Object.fromEntries(Object.entries(body).map(([k, v]) => [k, sanitizeHtml(v)]))
        : sanitizeHtml(body);
      const newPage = await pageRepository.create({ slug, title, body: sanitizedBody });
      return res.json(formatResponse({ success: true, message: 'Саҳифа қўшилди', data: newPage }));
    } catch (err) {
      next(err);
    }
  }

  async updatePage(req, res, next) {
    try {
      const { id } = req.params;
      const { slug, title, body } = req.body;
      const sanitizedBody = typeof body === 'object'
        ? Object.fromEntries(Object.entries(body).map(([k, v]) => [k, sanitizeHtml(v)]))
        : sanitizeHtml(body);
      const updated = await pageRepository.update(id, { slug, title, body: sanitizedBody });
      if (!updated) {
        return res.status(404).json(formatResponse({ success: false, message: 'Саҳифа топилмади' }));
      }
      return res.json(formatResponse({ success: true, message: 'Саҳифа янгиланди', data: updated }));
    } catch (err) {
      next(err);
    }
  }

  async deletePage(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await pageRepository.delete(id);
      if (!deleted) {
        return res.status(404).json(formatResponse({ success: false, message: 'Саҳифа топилмади' }));
      }
      return res.json(formatResponse({ success: true, message: 'Саҳифа ўчирилди' }));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PageController();
