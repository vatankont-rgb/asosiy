const BaseRepository = require('./baseRepository');

class LogRepository extends BaseRepository {
  constructor() {
    super('audit');
  }

  async addLog(action, entity, entityId, userId, description) {
    const log = {
      id: require('crypto').randomUUID(),
      action, // e.g., 'CREATE_ARTICLE', 'LOGIN', 'UPDATE_SETTINGS'
      entity, // e.g., 'Article', 'User', 'Settings'
      entityId,
      userId,
      description,
      createdAt: new Date().toISOString()
    };
    return await this.create(log);
  }

  async getRecentLogs(limit = 100) {
    const list = this.read();
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, limit);
  }
}

module.exports = new LogRepository();
