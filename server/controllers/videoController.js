const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const { sanitizeHtml } = require('../utils/sanitizer');

const storagePath = path.join(__dirname, '../storage/videos.json');

const readVideos = () => {
  try {
    if (fs.existsSync(storagePath)) {
      const data = fs.readFileSync(storagePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    logger.error('Error reading videos JSON', err);
  }
  return { uz: [], uzk: [], en: [] };
};

const writeVideos = (data) => {
  try {
    fs.writeFileSync(storagePath, JSON.stringify(data, null, 2));
  } catch (err) {
    logger.error('Error writing videos JSON', err);
  }
};

const videoController = {
  getAll: (req, res, next) => {
    try {
      const db = readVideos();
      res.json(db);
    } catch (err) {
      next(err);
    }
  },

  create: (req, res, next) => {
    try {
      const { lang } = req.params;
      const db = readVideos();
      if (!db[lang]) db[lang] = [];

      const newVideo = {
        id: uuidv4(),
        type: 'video',
        title: req.body.title || '',
        meta: req.body.meta || '',
        url: req.body.url || '',
        thumbnail: req.body.thumbnail || '',
        body: sanitizeHtml(req.body.body || ''),
        createdAt: new Date().toISOString()
      };

      db[lang].unshift(newVideo);
      writeVideos(db);

      res.status(201).json({ success: true, data: newVideo });
    } catch (err) {
      next(err);
    }
  },

  update: (req, res, next) => {
    try {
      const { lang, id } = req.params;
      const db = readVideos();
      if (!db[lang]) db[lang] = [];

      const index = db[lang].findIndex(v => v.id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Video topilmadi' });
      }

      db[lang][index] = {
        ...db[lang][index],
        title: req.body.title !== undefined ? req.body.title : db[lang][index].title,
        meta: req.body.meta !== undefined ? req.body.meta : db[lang][index].meta,
        url: req.body.url !== undefined ? req.body.url : db[lang][index].url,
        thumbnail: req.body.thumbnail !== undefined ? req.body.thumbnail : db[lang][index].thumbnail,
        body: req.body.body !== undefined ? sanitizeHtml(req.body.body) : db[lang][index].body,
      };

      writeVideos(db);
      res.status(200).json({ success: true, data: db[lang][index] });
    } catch (err) {
      next(err);
    }
  },

  delete: (req, res, next) => {
    try {
      const { lang, id } = req.params;
      const db = readVideos();
      if (db[lang]) {
        db[lang] = db[lang].filter(v => v.id !== id);
        writeVideos(db);
      }
      res.status(200).json({ success: true, message: 'Deleted' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = videoController;
