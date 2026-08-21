const app = require('./server/app');
const config = require('./server/config/config');
const logger = require('./server/utils/logger');

const preferredPort = config.port;
const backupService = require('./server/services/backupService');

function listen(port, attemptsLeft = 20) {
  const server = app.listen(port, () => {
    logger.info(`Vatanuz.uz Server is running at http://localhost:${port}`);
    backupService.initBackupScheduler();
  });

  server.once('error', (error) => {
    if (error.code === 'EADDRINUSE' && attemptsLeft > 0) {
      logger.warn(`Port ${port} is occupied. Attempting port ${port + 1}...`);
      listen(port + 1, attemptsLeft - 1);
      return;
    }
    throw error;
  });
}

listen(preferredPort);
