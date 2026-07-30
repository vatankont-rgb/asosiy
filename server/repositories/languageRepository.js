const fs = require('fs');
const path = require('path');
const config = require('../config/config');

class LanguageRepository {
  constructor() {
    this.filePath = path.join(config.storageDir, 'languages.json');
    this.ensureFile();
  }

  ensureFile() {
    if (!fs.existsSync(this.filePath)) {
      const seed = [
        { id: "uz", name: "O'zbek (Lotin)", shortName: "Lotin", isActive: true, order: 1 },
        { id: "uzk", name: "Ўзбек (Кирилл)", shortName: "Кирилл", isActive: true, order: 2 },
        { id: "en", name: "English", shortName: "Eng", isActive: true, order: 3 }
      ];
      fs.writeFileSync(this.filePath, JSON.stringify(seed, null, 2), 'utf8');
    }
  }

  read() {
    this.ensureFile();
    return JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
  }

  write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  async getAll() {
    const data = this.read();
    return data.sort((a, b) => a.order - b.order);
  }

  async getActive() {
    const data = this.read();
    return data.filter(l => l.isActive).sort((a, b) => a.order - b.order);
  }

  async create(lang) {
    const data = this.read();
    if (data.find(l => l.id === lang.id)) {
      throw new Error("Language ID already exists");
    }
    data.push(lang);
    this.write(data);
    return lang;
  }

  async update(id, updates) {
    const data = this.read();
    const index = data.findIndex(l => l.id === id);
    if (index === -1) return null;
    
    data[index] = { ...data[index], ...updates };
    this.write(data);
    return data[index];
  }

  async delete(id) {
    const data = this.read();
    const filtered = data.filter(l => l.id !== id);
    if (data.length === filtered.length) return false;
    this.write(filtered);
    return true;
  }
}

module.exports = new LanguageRepository();
