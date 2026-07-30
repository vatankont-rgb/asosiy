const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');

const ADS_FILE = path.join(config.storageDir, 'ads.json');

class AdRepository {
  constructor() {
    this._ensureFileExists();
  }

  _ensureFileExists() {
    if (!fs.existsSync(ADS_FILE)) {
      fs.writeFileSync(ADS_FILE, JSON.stringify([], null, 2));
    }
  }

  async getAll() {
    try {
      const data = fs.readFileSync(ADS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (err) {

      return [];
    }
  }

  async saveAll(ads) {
    try {
      fs.writeFileSync(ADS_FILE, JSON.stringify(ads, null, 2));
    } catch (err) {

      throw err;
    }
  }

  async create(adData) {
    const ads = await this.getAll();
    const newAd = {
      id: uuidv4(),
      title: adData.title || '',
      subtitle: adData.subtitle || '',
      image: adData.image || '',
      link: adData.link || '',
      position: adData.position || 'inline',
      active: adData.active !== undefined ? adData.active : true,
      createdAt: new Date().toISOString()
    };
    ads.push(newAd);
    await this.saveAll(ads);
    return newAd;
  }

  async update(id, adData) {
    const ads = await this.getAll();
    const index = ads.findIndex(a => a.id === id);
    if (index === -1) return null;

    const updatedAd = { ...ads[index], ...adData, id, updatedAt: new Date().toISOString() };
    ads[index] = updatedAd;
    await this.saveAll(ads);
    return updatedAd;
  }

  async delete(id) {
    const ads = await this.getAll();
    const filteredAds = ads.filter(a => a.id !== id);
    if (ads.length === filteredAds.length) return false;
    await this.saveAll(filteredAds);
    return true;
  }
}

module.exports = new AdRepository();
