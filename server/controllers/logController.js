const logRepository = require('../repositories/logRepository');

class LogController {
  async getLogs(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const logs = await logRepository.getRecentLogs(limit);
      return res.status(200).json({ logs });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new LogController();
