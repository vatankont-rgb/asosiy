const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const logger = require('./logger');

const filesToCheck = [
  'ads.json', 'articles.json', 'audit.json', 'categories.json', 'comments.json',
  'languages.json', 'pages.json', 'photos.json', 'settings.json', 'subscriptions.json',
  'tags.json', 'users.json', 'vapid.json', 'videos.json'
];

function performDailyBackup() {
  try {
    if (!fs.existsSync(config.backupsDir)) {
      fs.mkdirSync(config.backupsDir, { recursive: true });
    }

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const backupFilename = `backup-${dateStr}.json`;
    const backupFilePath = path.join(config.backupsDir, backupFilename);

    const snapshot = {
      timestamp: now.toISOString(),
      date: dateStr,
      data: {}
    };

    filesToCheck.forEach(file => {
      const key = file.replace('.json', '');
      const filePath = path.join(config.storageDir, file);
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          snapshot.data[key] = JSON.parse(content);
        } catch (e) {
          logger.warn(`Zaxiraga olishda faylni o'qishda ogohlantirish (${file}): ${e.message}`);
        }
      }
    });

    // Support direct backward compatibility with { articles, settings }
    if (snapshot.data.articles) snapshot.articles = snapshot.data.articles;
    if (snapshot.data.settings) snapshot.settings = snapshot.data.settings;

    fs.writeFileSync(backupFilePath, JSON.stringify(snapshot, null, 2), 'utf8');
    
    // Also save latest pointer
    fs.writeFileSync(path.join(config.backupsDir, 'backup-latest.json'), JSON.stringify(snapshot, null, 2), 'utf8');

    const sizeKB = (fs.statSync(backupFilePath).size / 1024).toFixed(1);
    logger.info(`💾 [ZAXIRA] Avtomatik kunlik zaxira muvaffaqiyatli saqlandi: ${backupFilename} (${sizeKB} KB)`);

    // Clean up backups older than 30 days (Auto-rotation to save disk space)
    const allBackups = fs.readdirSync(config.backupsDir)
      .filter(f => f.startsWith('backup-') && f.endsWith('.json') && f !== 'backup-latest.json')
      .sort();

    if (allBackups.length > 30) {
      const toDelete = allBackups.slice(0, allBackups.length - 30);
      toDelete.forEach(oldFile => {
        try {
          fs.unlinkSync(path.join(config.backupsDir, oldFile));
          logger.info(`🧹 [ROTATSIYA] Eski zaxira o'chirildi (30 kundan ortiq): ${oldFile}`);
        } catch (_) {}
      });
    }
  } catch (err) {
    logger.error(`❌ Kunlik zaxira yaratishda xatolik: ${err.message}`);
  }
}

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
            const key = file.replace('.json', '');
            
            if (backupData.data && backupData.data[key]) {
              fs.writeFileSync(filePath, JSON.stringify(backupData.data[key], null, 2), 'utf8');
              restored = true;
            } else if (file === 'articles.json' && backupData.articles) {
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
  // Run check & initial daily backup on server start
  setTimeout(() => {
    performAutoRepair();
    performDailyBackup();
  }, 5000);

  // Run auto repair and backup every 24 hours (86400000 ms)
  setInterval(() => {
    performAutoRepair();
    performDailyBackup();
  }, 24 * 60 * 60 * 1000);
}

module.exports = { startScheduler, performAutoRepair, performDailyBackup };
