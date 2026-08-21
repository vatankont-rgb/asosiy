const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const config = require('../config/config');

const backupDir = path.join(__dirname, '..', '..', 'backups');

// Ensure backups directory exists
if (!fs.existsSync(backupDir)) {
  try {
    fs.mkdirSync(backupDir, { recursive: true });
  } catch (e) {}
}

/**
 * Creates an in-memory or on-disk AdmZip archive containing:
 * 1. storage/ (JSON databases)
 * 2. uploads/ (all images/media)
 */
function createBackupArchive() {
  const zip = new AdmZip();
  const rootDir = path.join(__dirname, '..', '..');

  // Add storage folder
  const storageDir = path.join(__dirname, '..', 'storage');
  if (fs.existsSync(storageDir)) {
    zip.addLocalFolder(storageDir, 'storage');
  }

  // Add uploads folder
  const uploadsDir = config.uploadsDir || path.join(rootDir, 'uploads');
  if (fs.existsSync(uploadsDir)) {
    zip.addLocalFolder(uploadsDir, 'uploads');
  }

  return zip;
}

/**
 * Performs daily backup, saves file and rotates older than 7 days
 */
async function performDailyBackup() {
  try {
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const fileName = `vatanuz-backup-${dateStr}.zip`;
    const filePath = path.join(backupDir, fileName);

    const zip = createBackupArchive();
    zip.writeZip(filePath);

    // Rotate backups: keep only last 7 days
    rotateOldBackups(7);

    return { success: true, fileName, filePath, date: dateStr };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Deletes backup files older than maxDays
 */
function rotateOldBackups(maxDays = 7) {
  try {
    if (!fs.existsSync(backupDir)) return;
    const files = fs.readdirSync(backupDir).filter(f => f.startsWith('vatanuz-backup-') && f.endsWith('.zip'));
    
    // Sort files newest first
    const fileStats = files.map(f => {
      const p = path.join(backupDir, f);
      const stat = fs.statSync(p);
      return { file: f, path: p, mtime: stat.mtimeMs };
    }).sort((a, b) => b.mtime - a.mtime);

    // If more than maxDays, remove oldest
    if (fileStats.length > maxDays) {
      const toDelete = fileStats.slice(maxDays);
      toDelete.forEach(item => {
        try {
          fs.unlinkSync(item.path);
        } catch (e) {}
      });
    }
  } catch (e) {}
}

/**
 * Lists available backup files on server
 */
function listBackups() {
  try {
    if (!fs.existsSync(backupDir)) return [];
    const files = fs.readdirSync(backupDir).filter(f => f.startsWith('vatanuz-backup-') && f.endsWith('.zip'));
    return files.map(f => {
      const p = path.join(backupDir, f);
      const stat = fs.statSync(p);
      return {
        fileName: f,
        sizeBytes: stat.size,
        sizeMb: (stat.size / (1024 * 1024)).toFixed(2) + ' MB',
        createdAt: stat.mtime.toISOString()
      };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (e) {
    return [];
  }
}

/**
 * Initializes automatic daily backup schedule (runs every 24 hours)
 */
function initBackupScheduler() {
  // Run once on startup if no backup today
  setTimeout(() => {
    performDailyBackup();
  }, 10000);

  // Schedule daily run (every 24 hours)
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  setInterval(() => {
    performDailyBackup();
  }, TWENTY_FOUR_HOURS);
}

/**
 * Restores all files from a ZIP buffer
 */
function restoreBackupZip(zipBuffer) {
  const zip = new AdmZip(zipBuffer);
  const rootDir = path.join(__dirname, '..', '..');
  const storageDir = path.join(__dirname, '..', 'storage');
  const uploadsDir = config.uploadsDir || path.join(rootDir, 'uploads');

  fs.mkdirSync(storageDir, { recursive: true });
  fs.mkdirSync(uploadsDir, { recursive: true });

  const entries = zip.getEntries();
  let count = 0;
  entries.forEach(entry => {
    if (entry.isDirectory) return;
    
    // If it is in storage/
    if (entry.entryName.startsWith('storage/')) {
      const relPath = entry.entryName.replace(/^storage\//, '');
      const targetPath = path.join(storageDir, relPath);
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.writeFileSync(targetPath, entry.getData());
      count++;
    }
    // If it is in uploads/
    else if (entry.entryName.startsWith('uploads/')) {
      const relPath = entry.entryName.replace(/^uploads\//, '');
      const targetPath = path.join(uploadsDir, relPath);
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.writeFileSync(targetPath, entry.getData());
      count++;
    }
  });

  return { success: true, filesRestored: count };
}

module.exports = {
  createBackupArchive,
  performDailyBackup,
  restoreBackupZip,
  listBackups,
  initBackupScheduler,
  backupDir
};
