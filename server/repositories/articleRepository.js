const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const crypto = require('crypto');

class ArticleRepository {
  constructor() {
    this.filePath = path.join(config.storageDir, 'articles.json');
    this.ensureFile();
  }

  ensureFile() {
    if (!fs.existsSync(this.filePath)) {
      const seed = { uz: [], uzk: [], en: [] };
      fs.writeFileSync(this.filePath, JSON.stringify(seed, null, 2), 'utf8');
    }
  }

  createSeed(category, title, summary, author, image) {
    return {
      id: crypto.randomUUID(),
      category,
      title,
      summary,
      image,
      author,
      time: "Bugun",
      read: "4 daqiqa",
      body: `${summary} Tahririyat ushbu mavzuni kuzatishda davom etadi va yangi tafsilotlar paydo bo'lishi bilan materialni yangilaydi.`,
      status: "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  read() {
    this.ensureFile();
    return JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
  }

  write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  async getAll(includeDeleted = false) {
    const db = this.read();
    if (includeDeleted) return db;
    
    // Filter out soft-deleted stories
    const filteredDb = {};
    for (const lang in db) {
      filteredDb[lang] = db[lang].filter(s => !s.isDeleted);
    }
    return filteredDb;
  }

  async getPublished(lang) {
    const db = this.read();
    return (db[lang] || []).filter(s => s.status === 'published' && !s.isDeleted);
  }

  async addStory(lang, story) {
    const db = this.read();
    if (!db[lang]) db[lang] = [];
    db[lang].unshift(story);
    this.write(db);
    return story;
  }

  async updateStory(lang, id, story) {
    const db = this.read();
    if (!db[lang]) return null;
    const index = db[lang].findIndex(s => s.id === id);
    if (index === -1) return null;
    
    const oldStory = db[lang][index];
    const newHistory = Array.isArray(oldStory.history) ? [...oldStory.history] : [];
    
    // Save current state into history before updating
    newHistory.push({
      updatedAt: oldStory.updatedAt || oldStory.createdAt,
      title: oldStory.title,
      summary: oldStory.summary,
      body: oldStory.body,
      image: oldStory.image,
      tags: oldStory.tags
    });

    // Keep only last 10 versions to save space
    if (newHistory.length > 10) newHistory.shift();

    db[lang][index] = { ...oldStory, ...story, id, history: newHistory, updatedAt: new Date().toISOString() };
    this.write(db);
    return db[lang][index];
  }

  async deleteStory(lang, id) {
    const db = this.read();
    if (!db[lang]) return false;
    const index = db[lang].findIndex(s => s.id === id);
    if (index === -1) return false;
    
    db[lang][index].isDeleted = true;
    db[lang][index].deletedAt = new Date().toISOString();
    this.write(db);
    return true;
  }

  async getDeletedStories(lang) {
    const db = this.read();
    return (db[lang] || []).filter(s => s.isDeleted === true);
  }

  async restoreStory(lang, id) {
    const db = this.read();
    if (!db[lang]) return false;
    const index = db[lang].findIndex(s => s.id === id);
    if (index === -1) return false;
    
    delete db[lang][index].isDeleted;
    delete db[lang][index].deletedAt;
    db[lang][index].updatedAt = new Date().toISOString();
    this.write(db);
    return true;
  }

  async hardDeleteStory(lang, id) {
    const db = this.read();
    if (!db[lang]) return false;
    const filtered = db[lang].filter(s => s.id !== id);
    if (db[lang].length === filtered.length) return false;
    db[lang] = filtered;
    this.write(db);
    return true;
  }

  async resetStories() {
    fs.unlinkSync(this.filePath);
    this.ensureFile();
    return this.read();
  }
}

module.exports = new ArticleRepository();
