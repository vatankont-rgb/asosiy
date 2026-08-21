const settingRepository = require('../repositories/settingRepository');
const articleRepository = require('../repositories/articleRepository');
const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const { formatResponse } = require('../utils/helpers');

class SettingController {
  async getSettings(req, res, next) {
    try {
      const settings = await settingRepository.getSettings();
      return res.status(200).json(formatResponse({ data: settings }));
    } catch (err) {
      next(err);
    }
  }

  async updateSettings(req, res, next) {
    try {
      const updated = await settingRepository.updateSettings(req.body);
      return res.status(200).json(formatResponse({ message: 'Settings updated successfully', data: updated }));
    } catch (err) {
      next(err);
    }
  }

  async downloadZipBackup(req, res, next) {
    try {
      const backupService = require('../services/backupService');
      const zip = backupService.createBackupArchive();
      const zipBuffer = zip.toBuffer();
      const dateStr = new Date().toISOString().slice(0, 10);
      const filename = `vatanuz-backup-${dateStr}.zip`;

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', zipBuffer.length);
      return res.send(zipBuffer);
    } catch (err) {
      next(err);
    }
  }

  async listBackups(req, res, next) {
    try {
      const backupService = require('../services/backupService');
      const backups = backupService.listBackups();
      return res.status(200).json(formatResponse({ data: backups }));
    } catch (err) {
      next(err);
    }
  }

  async createBackupNow(req, res, next) {
    try {
      const backupService = require('../services/backupService');
      const result = await backupService.performDailyBackup();
      return res.status(200).json(formatResponse({ message: 'Zaxira nusxasi muvaffaqiyatli yaratildi', data: result }));
    } catch (err) {
      next(err);
    }
  }

  async restoreZipBackup(req, res, next) {
    try {
      const backupService = require('../services/backupService');
      const { zipBase64 } = req.body;
      if (!zipBase64) {
        return res.status(400).json(formatResponse({ success: false, message: 'ZIP fayl taqdim etilmadi.' }));
      }
      const buffer = Buffer.from(zipBase64, 'base64');
      const result = backupService.restoreBackupZip(buffer);
      return res.status(200).json(formatResponse({ message: 'Zaxira nusxasi muvaffaqiyatli tiklandi!', data: result }));
    } catch (err) {
      next(err);
    }
  }

  async exportBackup(req, res, next) {
    try {
      const articles = await articleRepository.getAll();
      const settings = await settingRepository.getSettings();
      
      const backupData = {
        articles,
        settings,
        exportedAt: new Date().toISOString()
      };

      // Ensure backup directory
      fs.mkdirSync(config.backupsDir, { recursive: true });
      const backupFilename = `backup-${Date.now()}.json`;
      fs.writeFileSync(path.join(config.backupsDir, backupFilename), JSON.stringify(backupData, null, 2), 'utf8');

      return res.status(200).json(formatResponse({ 
        message: 'Backup exported successfully', 
        data: { filename: backupFilename, content: backupData } 
      }));
    } catch (err) {
      next(err);
    }
  }

  async importBackup(req, res, next) {
    try {
      const { articles, settings } = req.body;
      if (!articles || !settings) {
        return res.status(400).json(formatResponse({ success: false, message: 'Invalid backup structure.' }));
      }

      await articleRepository.write(articles);
      await settingRepository.updateSettings(settings);

      return res.status(200).json(formatResponse({ message: 'Backup restored successfully.' }));
    } catch (err) {
      next(err);
    }
  }

  async getDashboardStats(req, res, next) {
    try {
      const os = require('os');
      const articleRepository = require('../repositories/articleRepository');
      const articles = await articleRepository.getAll();
      const uzArticles = articles.uz || [];
      const enArticles = articles.en || [];
      const uzkArticles = articles.uzk || [];
      const allArticles = [...uzArticles, ...enArticles, ...uzkArticles];

      const stats = {
        totalArticles: allArticles.length,
        publishedArticles: allArticles.filter(a => a.status === 'published').length,
        draftArticles: allArticles.filter(a => a.status === 'draft').length,
        scheduledArticles: allArticles.filter(a => a.status === 'scheduled').length,
        categories: [...new Set(allArticles.map(a => a.category))],
      };

      // Realtime OS metrics
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      const memUsage = ((usedMem / totalMem) * 100).toFixed(2);
      const cpus = os.cpus();
      const cpuModel = cpus[0] ? cpus[0].model : 'Unknown';
      const uptime = os.uptime();

      let diskTotalGB = "0.00";
      let diskFreeGB = "0.00";
      let diskUsagePercent = "0.00";
      let diskUsedGB = "0.00";
      try {
        const stats = fs.statfsSync(__dirname);
        const totalBytes = stats.blocks * stats.bsize;
        const freeBytes = stats.bavail * stats.bsize;
        const usedBytes = totalBytes - freeBytes;
        diskTotalGB = (totalBytes / 1024 / 1024 / 1024).toFixed(2);
        diskFreeGB = (freeBytes / 1024 / 1024 / 1024).toFixed(2);
        diskUsedGB = (usedBytes / 1024 / 1024 / 1024).toFixed(2);
        if (totalBytes > 0) {
          diskUsagePercent = ((usedBytes / totalBytes) * 100).toFixed(2);
        }
      } catch (e) {}

      const serverStatus = {
        memUsagePercent: memUsage,
        totalMemGB: (totalMem / 1024 / 1024 / 1024).toFixed(2),
        usedMemGB: (usedMem / 1024 / 1024 / 1024).toFixed(2),
        cpuModel,
        uptimeSeconds: uptime,
        diskTotalGB,
        diskFreeGB,
        diskUsedGB,
        diskUsagePercent
      };

      const daysStr = ['Yakshanba', 'Dush', 'Sesh', 'Chor', 'Pay', 'Juma', 'Shanba'];
      const weeklyViews = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        
        const articlesOnDate = allArticles.filter(a => {
           if (!a.createdAt) return false;
           try {
             return new Date(a.createdAt).toISOString().split('T')[0] === dateStr;
           } catch(e) { return false; }
        });

        const dayViews = articlesOnDate.reduce((sum, a) => sum + (parseInt(a.views) || 0), 0);
        
        weeklyViews.push({
          name: i === 0 ? 'Bugun' : daysStr[d.getDay()],
          views: dayViews,
          articles: articlesOnDate.length
        });
      }

      const catCount = {};
      let dbCategories = [];
      try {
        const catPath = require('path').join(__dirname, '../storage/categories.json');
        dbCategories = JSON.parse(fs.readFileSync(catPath, 'utf8'));
      } catch(e) {}
      
      const catMap = {};
      dbCategories.forEach(c => {
         const canon = c.names?.uz || c.slug;
         if (c.names) {
           Object.values(c.names).forEach(val => {
             if (val) catMap[val.toLowerCase().trim()] = canon;
           });
         }
      });

      allArticles.forEach(a => {
        if (!a.category) return;
        const canonCat = catMap[a.category.toLowerCase().trim()];
        if (canonCat) {
          catCount[canonCat] = (catCount[canonCat] || 0) + 1;
        }
      });
      const categoryData = Object.keys(catCount).map(c => ({ name: c, value: catCount[c] }));

      return res.status(200).json({ stats, serverStatus, weeklyViews, categoryData });
    } catch (err) {
      next(err);
    }
  }

  async getLogs(req, res, next) {
    try {
      const logType = req.query.type || 'combined'; // combined or error
      const logFile = path.join(config.logsDir, logType === 'error' ? 'error.log' : 'combined.log');
      let logs = [];
      if (fs.existsSync(logFile)) {
        const rawLogs = fs.readFileSync(logFile, 'utf8').split('\n').filter(Boolean).slice(-100);
        logs = rawLogs.reverse(); // Newest first
      } else {
        logs = [`Tizim loglari (${logType}) mavjud emas.`];
      }
      return res.status(200).json({ logs });
    } catch (err) {
      next(err);
    }
  }

  async getHealth(req, res, next) {
    try {
      const os = require('os');
      const filesToCheck = [
        'ads.json', 'articles.json', 'audit.json', 'categories.json', 'comments.json',
        'languages.json', 'pages.json', 'photos.json', 'settings.json', 'subscriptions.json',
        'tags.json', 'users.json', 'vapid.json', 'videos.json'
      ];
      
      const fileStatus = [];
      let totalStorageBytes = 0;
      let corruptCount = 0;

      filesToCheck.forEach(file => {
        const filePath = path.join(config.storageDir, file);
        const status = {
          name: file,
          exists: fs.existsSync(filePath),
          sizeBytes: 0,
          isValidJson: false,
          error: null
        };

        if (status.exists) {
          try {
            const stats = fs.statSync(filePath);
            status.sizeBytes = stats.size;
            totalStorageBytes += stats.size;

            const content = fs.readFileSync(filePath, 'utf8');
            JSON.parse(content);
            status.isValidJson = true;
          } catch (e) {
            status.isValidJson = false;
            status.error = e.message;
            corruptCount++;
          }
        } else {
          corruptCount++;
        }
        fileStatus.push(status);
      });

      let diskTotalGB = "0.00";
      let diskFreeGB = "0.00";
      try {
        const stats = fs.statfsSync(__dirname);
        const totalBytes = stats.blocks * stats.bsize;
        const freeBytes = stats.bavail * stats.bsize;
        diskTotalGB = (totalBytes / 1024 / 1024 / 1024).toFixed(2);
        diskFreeGB = (freeBytes / 1024 / 1024 / 1024).toFixed(2);
      } catch (e) {}

      const health = {
        status: corruptCount === 0 ? 'HEALTHY' : 'DEGRADED',
        os: {
          platform: os.platform(),
          release: os.release(),
          freeMemoryGB: (os.freemem() / 1024 / 1024 / 1024).toFixed(2),
          totalMemoryGB: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2),
          cpuCount: os.cpus().length,
          uptimeHours: (os.uptime() / 3600).toFixed(2),
          diskFreeGB,
          diskTotalGB
        },
        storage: {
          totalFilesChecked: filesToCheck.length,
          totalStorageBytes,
          corruptFilesCount: corruptCount,
          files: fileStatus
        }
      };

      return res.status(200).json({ success: true, health });
    } catch (err) {
      next(err);
    }
  }

  async repairDb(req, res, next) {
    try {
      const { filename } = req.body;
      if (!filename) {
        return res.status(400).json({ success: false, message: 'Fayl nomi kiritilmadi' });
      }

      const filePath = path.join(config.storageDir, filename);
      let defaultValue = '[]';
      
      // Determine appropriate default structure
      if (['settings.json', 'vapid.json'].includes(filename)) {
        defaultValue = '{}';
      } else if (filename === 'articles.json') {
        defaultValue = '{"uz":[],"uzk":[],"en":[]}';
      } else if (filename === 'photos.json' || filename === 'videos.json') {
        defaultValue = '{"uz":[],"uzk":[],"en":[]}';
      }

      // Check if backup directory has any backups to restore from
      let restoredFromBackup = false;
      if (fs.existsSync(config.backupsDir)) {
        const backups = fs.readdirSync(config.backupsDir).filter(f => f.endsWith('.json')).sort();
        if (backups.length > 0) {
          const latestBackup = backups[backups.length - 1];
          try {
            const backupData = JSON.parse(fs.readFileSync(path.join(config.backupsDir, latestBackup), 'utf8'));
            const key = filename.replace('.json', '');
            if (backupData.data && backupData.data[key]) {
              fs.writeFileSync(filePath, JSON.stringify(backupData.data[key], null, 2), 'utf8');
              restoredFromBackup = true;
            } else if (filename === 'articles.json' && backupData.articles) {
              fs.writeFileSync(filePath, JSON.stringify(backupData.articles, null, 2), 'utf8');
              restoredFromBackup = true;
            } else if (filename === 'settings.json' && backupData.settings) {
              fs.writeFileSync(filePath, JSON.stringify(backupData.settings, null, 2), 'utf8');
              restoredFromBackup = true;
            }
          } catch (e) {
            // Backup corrupt, skip
          }
        }
      }

      if (!restoredFromBackup) {
        fs.writeFileSync(filePath, defaultValue, 'utf8');
      }

      const logRepository = require('../repositories/logRepository');
      await logRepository.addLog('DB_REPAIR', 'System', filename, req.user.username, `Baza fayli tiklandi: ${filename} (Zaxiradan: ${restoredFromBackup ? 'Ha' : 'Yo\'q'})`);

      return res.status(200).json({ 
        success: true, 
        message: restoredFromBackup 
          ? `${filename} oxirgi zaxiradan muvaffaqiyatli tiklandi.` 
          : `${filename} bo'sh holatga keltirilib, qayta tiklandi.`
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SettingController();
