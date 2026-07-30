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
      const seed = {
        uz: [
          this.createSeed("Siyosat", "Hududlarda ochiq budjet muhokamalari yangi tartibda o'tkaziladi", "Mahalliy kengashlar fuqarolar takliflarini ko'rib chiqish uchun raqamli jadval e'lon qiladi.", "Dilnoza Karimova", "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80"),
          this.createSeed("Iqtisod", "Kichik biznes uchun eksport maslahat markazlari ishga tushmoqda", "Yangi xizmat mahsulot sertifikati, logistika va xorijiy bozor talablari bo'yicha yordam beradi.", "Akmal Saidov", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"),
          this.createSeed("Texnologiya", "Universitet laboratoriyasida mahalliy AI yordamchisi sinovdan o'tkazildi", "Loyiha o'zbek tilidagi savol-javob, hujjat tahlili va ta'lim jarayoniga moslashishga qaratilgan.", "Shahlo Nazarova", "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"),
          this.createSeed("Sport", "Milliy chempionatning bahorgi bosqichi kutilmagan natijalar bilan boshlandi", "Yosh futbolchilar asosiy tarkibda ko'proq maydonga tushmoqda, murabbiylar rotatsiyani oshirdi.", "Jasur Tursunov", "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80"),
          this.createSeed("Madaniyat", "Shahar teatrlarida yosh rejissyorlar haftaligi ochildi", "Dasturda eksperimental sahna asarlari, ochiq suhbatlar va mahorat darslari bor.", "Malika Qodirova", "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80"),
          this.createSeed("Tahlil", "Shahar transportida raqamli to'lovlar nega tez ommalashmoqda?", "Mutaxassislar qulaylik, monitoring va tarif siyosati o'rtasidagi bog'liqlikni izohlaydi.", "Zafar Jo'rayev", "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80"),
        ],
        en: [
          this.createSeed("Politics", "Open budget discussions in regions will be held under new rules", "Local councils will publish a digital schedule for reviewing citizens' proposals.", "Dilnoza Karimova", "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80"),
          this.createSeed("Economy", "Export consulting centers launched for small businesses", "The new service will assist with product certification, logistics, and foreign market requirements.", "Akmal Saidov", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"),
          this.createSeed("Technology", "Local AI assistant tested in university laboratory", "The project focuses on Q&A in Uzbek, document analysis, and adapting to the educational process.", "Shahlo Nazarova", "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"),
          this.createSeed("Sport", "Spring stage of the national championship begins with unexpected results", "Young players are entering the starting lineup more frequently, and coaches are increasing rotation.", "Jasur Tursunov", "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80"),
          this.createSeed("Culture", "Week of young directors opens in city theaters", "The program includes experimental stage works, open discussions, and master classes.", "Malika Qodirova", "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80"),
          this.createSeed("Analysis", "Why digital payments are rapidly gaining popularity in city transport", "Experts explain the connection between convenience, monitoring, and tariff policy.", "Zafar Jo'rayev", "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80"),
        ]
      };
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
