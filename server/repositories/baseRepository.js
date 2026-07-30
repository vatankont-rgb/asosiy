const fs = require('fs');
const path = require('path');
const config = require('../config/config');

class BaseRepository {
  constructor(collection) {
    this.filePath = path.join(config.storageDir, `${collection}.json`);
    this.ensureFile();
  }

  ensureFile() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), 'utf8');
    }
  }

  read() {
    this.ensureFile();
    const content = fs.readFileSync(this.filePath, 'utf8');
    try {
      return JSON.parse(content);
    } catch (e) {
      return [];
    }
  }

  write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  async getAll() {
    return this.read();
  }

  async getById(id) {
    const list = this.read();
    return list.find(item => item.id === id) || null;
  }

  async create(item) {
    const list = this.read();
    list.unshift(item);
    this.write(list);
    return item;
  }

  async update(id, updatedFields) {
    const list = this.read();
    const idx = list.findIndex(item => item.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updatedFields, updatedAt: new Date().toISOString() };
    this.write(list);
    return list[idx];
  }

  async delete(id) {
    const list = this.read();
    const filtered = list.filter(item => item.id !== id);
    if (list.length === filtered.length) return false;
    this.write(filtered);
    return true;
  }
}

module.exports = BaseRepository;
