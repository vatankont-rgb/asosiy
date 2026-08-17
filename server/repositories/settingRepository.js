const BaseRepository = require('./baseRepository');

class SettingRepository extends BaseRepository {
  constructor() {
    super('settings');
    this.seedDefaultSettings();
  }

  seedDefaultSettings() {
    const list = this.read();
    if (list.length === 0) {
      const defaults = {
        id: 'global-settings',
        siteName: 'Vatanuz.uz',
        maintenanceMode: false,
        theme: 'light',
        language: 'uz',
        socialLinks: {
          telegram: 'https://t.me/vatanuz',
          facebook: 'https://facebook.com/vatanuz',
          instagram: 'https://instagram.com/vatanuz'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.write([defaults]);
    }
  }

  async getSettings() {
    const list = this.read();
    return list[0] || null;
  }

  async updateSettings(updates) {
    const list = this.read();
    if (list.length === 0) {
      await this.seedDefaultSettings();
    }
    list[0] = { ...list[0], ...updates, updatedAt: new Date().toISOString() };
    this.write(list);
    return list[0];
  }
}

module.exports = new SettingRepository();
