const articleRepository = require('../repositories/articleRepository');
const logRepository = require('../repositories/logRepository');
const crypto = require('crypto');
const { sanitizeHtml } = require('../utils/sanitizer');

class ArticleController {
  async getPublicStories(req, res, next) {
    try {
      const db = await articleRepository.getAll();
      const now = new Date();
      const isPublic = (s) => s.status === 'published' && (!s.scheduledAt || new Date(s.scheduledAt) <= now);
      
      const published = {
        uz: (db.uz || []).filter(isPublic),
        uzk: (db.uzk || []).filter(isPublic),
        en: (db.en || []).filter(isPublic)
      };
      return res.status(200).json({ stories: published });
    } catch (err) {
      next(err);
    }
  }

  async getAdminStories(req, res, next) {
    try {
      const db = await articleRepository.getAll();
      return res.status(200).json({ stories: db });
    } catch (err) {
      next(err);
    }
  }

  async createStory(req, res, next) {
    try {
      if (req.user.role === 'Writer' && req.body.story.status === 'published') {
        return res.status(403).json({ error: "Yozuvchilar darhol nashr qila olmaydi" });
      }

      const { lang, story } = req.body;
      const targetLang = ['uz', 'uzk', 'en'].includes(lang) ? lang : 'uz';
      
      const normalized = {
        id: story.id || crypto.randomUUID(),
        category: String(story.category || "Siyosat").trim(),
        title: String(story.title || "").trim(),
        summary: String(story.summary || "").trim(),
        image: String(story.image || "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80").trim(),
        author: String(story.author || "Vatanuz.uz tahririyati").trim(),
        time: String(story.time || "Hozir").trim(),
        read: String(story.read || "3 daqiqa").trim(),
        body: sanitizeHtml(String(story.body || "")),
        status: story.status === "draft" ? "draft" : "published",
        isFeatured: !!story.isFeatured,
        isEditorChoice: !!story.isEditorChoice,
        isBreaking: !!story.isBreaking,
        scheduledAt: story.scheduledAt || null,
        createdAt: story.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: parseInt(story.views) || 0,
        videoUrl: String(story.videoUrl || "").trim(),
          tags: String(story.tags || "").trim()
      };

      await articleRepository.addStory(targetLang, normalized);
      
      await logRepository.addLog('CREATE_ARTICLE', 'Article', normalized.id, req.user.username, `Yangi maqola qo'shildi: ${normalized.title}`);

      // Notify via Telegram if published and sendToTelegram is requested
      if (normalized.status === 'published' && (!normalized.scheduledAt || new Date(normalized.scheduledAt) <= new Date())) {
        if (story.sendToTelegram) {
          const { sendTelegramMessage } = require('../utils/telegram');
          const message = `📰 <b>Yangi maqola qo'shildi!</b>\n\n<b>Sarlavha:</b> ${normalized.title}\n<b>Muallif:</b> ${normalized.author}\n<b>Bo'lim:</b> ${normalized.category}`;
          sendTelegramMessage(message).catch(console.error);
        }
        if (story.sendPushNotification) {
          const pushController = require('./pushController');
          const payload = {
            title: "Yangi maqola: " + normalized.title,
            body: normalized.summary || "Batafsil o'qish uchun saytga kiring.",
            url: `/?page=article&id=${normalized.id}`,
            icon: "/assets/images/logo.png"
          };
          pushController.sendPushNotification(payload).catch(console.error);
        }
      }

      const updatedDb = await articleRepository.getAll();
      return res.status(200).json({ story: normalized, stories: updatedDb });
    } catch (err) {
      next(err);
    }
  }

  async updateStory(req, res, next) {
    try {
      const { lang, id } = req.params;
      const { story } = req.body;
      const targetLang = ['uz', 'uzk', 'en'].includes(lang) ? lang : 'uz';

      if (story && story.body) {
        story.body = sanitizeHtml(String(story.body));
      }

      const oldStory = (await articleRepository.getAll())[targetLang].find(s => s.id === id);
      const updated = await articleRepository.updateStory(targetLang, id, story);
      if (!updated) {
        return res.status(404).json({ error: "Maqola topilmadi" });
      }

      if (oldStory && oldStory.status !== 'published' && updated.status === 'published' && (!updated.scheduledAt || new Date(updated.scheduledAt) <= new Date())) {
        if (story.sendToTelegram) {
          const { sendTelegramMessage } = require('../utils/telegram');
          const message = `📰 <b>Yangi maqola qo'shildi!</b>\n\n<b>Sarlavha:</b> ${updated.title}\n<b>Muallif:</b> ${updated.author}\n<b>Bo'lim:</b> ${updated.category}`;
          sendTelegramMessage(message).catch(console.error);
        }
        if (story.sendPushNotification) {
          const pushController = require('./pushController');
          const payload = {
            title: "Yangi maqola: " + updated.title,
            body: updated.summary || "Batafsil o'qish uchun saytga kiring.",
            url: `/?page=article&id=${updated.id}`,
            icon: "/assets/images/logo.png"
          };
          pushController.sendPushNotification(payload).catch(console.error);
        }
      }

      await logRepository.addLog('UPDATE_ARTICLE', 'Article', id, req.user.username, `Maqola tahrirlandi: ${updated.title}`);

      const updatedDb = await articleRepository.getAll();
      return res.status(200).json({ story: updated, stories: updatedDb });
    } catch (err) {
      next(err);
    }
  }

  async deleteStory(req, res, next) {
    try {
      const { lang, id } = req.params;
      const targetLang = ['uz', 'uzk', 'en'].includes(lang) ? lang : 'uz';

      await articleRepository.deleteStory(targetLang, id);
      await logRepository.addLog('DELETE_ARTICLE', 'Article', id, req.user.username, `Maqola o'chirildi`);
      
      const updatedDb = await articleRepository.getAll();
      return res.status(200).json({ stories: updatedDb });
    } catch (err) {
      next(err);
    }
  }

  async getDeletedStories(req, res, next) {
    try {
      const db = await articleRepository.getAll(true); // include deleted
      const deleted = {
        uz: (db.uz || []).filter(s => s.isDeleted),
        uzk: (db.uzk || []).filter(s => s.isDeleted),
        en: (db.en || []).filter(s => s.isDeleted)
      };
      return res.status(200).json({ stories: deleted });
    } catch (err) {
      next(err);
    }
  }

  async restoreStory(req, res, next) {
    try {
      const { lang, id } = req.params;
      const targetLang = ['uz', 'uzk', 'en'].includes(lang) ? lang : 'uz';
      
      await articleRepository.restoreStory(targetLang, id);
      await logRepository.addLog('RESTORE_ARTICLE', 'Article', id, req.user.username, `Maqola tiklandi`);
      
      const updatedDb = await articleRepository.getAll();
      return res.status(200).json({ stories: updatedDb });
    } catch (err) {
      next(err);
    }
  }

  async hardDeleteStory(req, res, next) {
    try {
      const { lang, id } = req.params;
      const targetLang = ['uz', 'uzk', 'en'].includes(lang) ? lang : 'uz';
      
      await articleRepository.hardDeleteStory(targetLang, id);
      await logRepository.addLog('HARD_DELETE_ARTICLE', 'Article', id, req.user.username, `Maqola butunlay o'chirildi`);
      
      const updatedDb = await articleRepository.getAll();
      return res.status(200).json({ stories: updatedDb });
    } catch (err) {
      next(err);
    }
  }

  async incrementView(req, res, next) {
    try {
      const { lang, id } = req.params;
      const targetLang = ['uz', 'uzk', 'en'].includes(lang) ? lang : 'uz';
      
      const db = await articleRepository.getAll(true);
      if (db[targetLang]) {
        const index = db[targetLang].findIndex(s => s.id === id);
        if (index !== -1) {
          db[targetLang][index].views = (db[targetLang][index].views || 0) + 1;
          articleRepository.write(db);
        }
      }
      return res.status(200).json({ success: true });
    } catch (err) {
      next(err);
    }
  }

  async getAuthorsKpi(req, res, next) {
    try {
      const db = await articleRepository.getAll(false); // only non-deleted
      const authors = {};
      
      const allStories = [...(db.uz || []), ...(db.uzk || []), ...(db.en || [])];
      allStories.forEach(s => {
        const authorName = s.author || "Noma'lum";
        if (!authors[authorName]) {
          authors[authorName] = { author: authorName, count: 0, views: 0 };
        }
        authors[authorName].count++;
        authors[authorName].views += (s.views || 0);
      });
      
      const sortedAuthors = Object.values(authors).sort((a, b) => b.views - a.views);
      return res.status(200).json({ kpi: sortedAuthors });
    } catch (err) {
      next(err);
    }
  }

  async resetStories(req, res, next) {
    try {
      const stories = await articleRepository.resetStories();
      return res.status(200).json({ stories });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ArticleController();
