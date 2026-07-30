const fs = require('fs');
const file = 'server/controllers/articleController.js';
let txt = fs.readFileSync(file, 'utf8');

// Fix getPublicStories
txt = txt.replace(
  /uz: \(db\.uz \|\| \[\]\)\.filter\(s => s\.status === 'published'\),\s*en: \(db\.en \|\| \[\]\)\.filter\(s => s\.status === 'published'\)/g,
  "uz: (db.uz || []).filter(s => s.status === 'published'),\n        uzk: (db.uzk || []).filter(s => s.status === 'published'),\n        en: (db.en || []).filter(s => s.status === 'published')"
);

// Fix targetLang
txt = txt.replace(/const targetLang = lang === 'en' \? 'en' : 'uz';/g, "const targetLang = ['uz', 'uzk', 'en'].includes(lang) ? lang : 'uz';");

fs.writeFileSync(file, txt);
console.log('Backend updated for uzk support.');
