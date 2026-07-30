const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const logger = require('./logger');

const filesToCheck = [
  'ads.json', 'articles.json', 'audit.json', 'categories.json', 'comments.json',
  'languages.json', 'pages.json', 'photos.json', 'settings.json', 'subscriptions.json',
  'tags.json', 'users.json', 'vapid.json', 'videos.json'
];

function performAutoRepair() {
  logger.info('Avtomatik tizim salomatligi tekshiruvi boshlandi...');
  let repairedCount = 0;

  filesToCheck.forEach(file => {
    const filePath = path.join(config.storageDir, file);
    let needsRepair = false;
    let errorMsg = '';

    if (!fs.existsSync(filePath)) {
      needsRepair = true;
      errorMsg = 'Fayl mavjud emas';
    } else {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        JSON.parse(content);
      } catch (e) {
        needsRepair = true;
        errorMsg = e.message;
      }
    }

    if (needsRepair) {
      logger.warn(`Baza fayli buziqligi aniqlandi: ${file} (${errorMsg}). Qayta tiklanmoqda...`);
      let defaultValue = '[]';
      if (['settings.json', 'vapid.json'].includes(file)) {
        defaultValue = '{}';
      } else if (['articles.json', 'photos.json', 'videos.json'].includes(file)) {
        defaultValue = '{"uz":[],"uzk":[],"en":[]}';
      }

      let restored = false;
      // Try restoring from backups
      if (fs.existsSync(config.backupsDir)) {
        try {
          const backups = fs.readdirSync(config.backupsDir).filter(f => f.endsWith('.json')).sort();
          if (backups.length > 0) {
            const latestBackup = backups[backups.length - 1];
            const backupData = JSON.parse(fs.readFileSync(path.join(config.backupsDir, latestBackup), 'utf8'));
            if (file === 'articles.json' && backupData.articles) {
              fs.writeFileSync(filePath, JSON.stringify(backupData.articles, null, 2), 'utf8');
              restored = true;
            } else if (file === 'settings.json' && backupData.settings) {
              fs.writeFileSync(filePath, JSON.stringify(backupData.settings, null, 2), 'utf8');
              restored = true;
            }
          }
        } catch (e) {
          logger.error(`Zaxiradan tiklashda xatolik (${file}): ${e.message}`);
        }
      }

      if (!restored) {
        fs.writeFileSync(filePath, defaultValue, 'utf8');
      }

      repairedCount++;
      logger.info(`Fayl muvaffaqiyatli tiklandi: ${file} (Zaxiradan: ${restored ? 'Ha' : 'Yo\'q'})`);
    }
  });

  if (repairedCount > 0) {
    logger.info(`Tizim salomatligi tekshiruvi tugadi. ${repairedCount} ta fayl tuzatildi.`);
  } else {
    logger.info('Tizim salomatligi tekshiruvi tugadi. Barcha fayllar holati yaxshi.');
  }
}

function startScheduler() {
  // Run immediately on server start
  setTimeout(performAutoRepair, 5000);

  // Run every 24 hours (86400000 ms)
  setInterval(performAutoRepair, 24 * 60 * 60 * 1000);
}

module.exports = { startScheduler, performAutoRepair };
