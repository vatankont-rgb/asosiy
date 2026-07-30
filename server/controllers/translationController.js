const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../data/translations.json');

class TranslationController {
  async getTranslations(req, res, next) {
    try {
      if (!fs.existsSync(filePath)) {
        return res.status(200).json({ translations: { uz: {}, en: {} } });
      }
      const data = fs.readFileSync(filePath, 'utf8');
      return res.status(200).json({ translations: JSON.parse(data) });
    } catch (err) {
      next(err);
    }
  }

  async updateTranslations(req, res, next) {
    try {
      const { translations } = req.body;
      if (!translations) {
        return res.status(400).json({ error: "No translations provided" });
      }
      fs.writeFileSync(filePath, JSON.stringify(translations, null, 2));
      return res.status(200).json({ ok: true, translations });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TranslationController();
