require('dotenv').config();
const path = require('path');

const root = path.join(__dirname, '..', '..');

module.exports = {
  port: Number(process.env.PORT || 5173),
  env: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'vatan-uz-jwt-access-secret-key-2026',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'vatan-uz-jwt-refresh-secret-key-2026',
  accessTokenExpiry: '7d',
  refreshTokenExpiry: '7d',
  cookieMaxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  uploadsDir: path.join(root, 'server', 'uploads'),
  storageDir: path.join(root, 'server', 'storage'),
  backupsDir: path.join(root, 'server', 'backups'),
  logsDir: path.join(root, 'server', 'logs'),
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: Number(process.env.SMTP_PORT || 2525),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'no-reply@vatanuz.uz',
  }
};
