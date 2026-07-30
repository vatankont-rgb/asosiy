const fs = require('fs');

let c = fs.readFileSync('app.jsx', 'utf8');

const oldPages = `pages: ["Bosh sahifa", "Siyosat", "Iqtisod", "Texnologiya", "Sport", "Madaniyat", "Aloqa"],`;
const newPages = `pages: ["Bosh sahifa", "Siyosat", "Iqtisodiyot", "Tarix", "Falsafa", "Adabiyot", "Aloqa"],`;

// We also need to update the categoryMap for uz and ru
// And the pageNotes, although maybe pageNotes are fine left as is or updated.
// Let's replace the category names in the translations and category map

c = c.replace(oldPages, newPages);

// Update uz translations
c = c.replace('"Siyosat": "Siyosat",', '"Siyosat": "Siyosat",'); // unchanged
c = c.replace('"Iqtisod": "Iqtisod",', '"Iqtisodiyot": "Iqtisodiyot",');
c = c.replace('"Texnologiya": "Texnologiya",', '"Tarix": "Tarix",');
c = c.replace('"Sport": "Sport",', '"Falsafa": "Falsafa",');
c = c.replace('"Madaniyat": "Madaniyat",', '"Adabiyot": "Adabiyot",');

// Update ru translations
c = c.replace('"Политика": "Siyosat",', '"Политика": "Siyosat",');
c = c.replace('"Экономика": "Iqtisod",', '"Экономика": "Iqtisodiyot",');
c = c.replace('"Технологии": "Texnologiya",', '"История": "Tarix",');
c = c.replace('"Спорт": "Sport",', '"Философия": "Falsafa",');
c = c.replace('"Культура": "Madaniyat",', '"Литература": "Adabiyot",');

// Also update the locales object for ru
const oldRuPages = `pages: ["Главная", "Политика", "Экономика", "Технологии", "Спорт", "Культура", "Контакты"],`;
const newRuPages = `pages: ["Главная", "Политика", "Экономика", "История", "Философия", "Литература", "Контакты"],`;
c = c.replace(oldRuPages, newRuPages);

// Also update the locales object for uzk
const oldUzkPages = `pages: ["Бош саҳифа", "Сиёсат", "Иқтисод", "Технология", "Спорт", "Маданият", "Алоқа"],`;
const newUzkPages = `pages: ["Бош саҳифа", "Сиёсат", "Иқтисодиёт", "Тарих", "Фалсафа", "Адабиёт", "Алоқа"],`;
c = c.replace(oldUzkPages, newUzkPages);

// And update the category map for uzk
c = c.replace('"Сиёсат": "Siyosat",', '"Сиёсат": "Siyosat",');
c = c.replace('"Иқтисод": "Iqtisod",', '"Иқтисодиёт": "Iqtisodiyot",');
c = c.replace('"Технология": "Texnologiya",', '"Тарих": "Tarix",');
c = c.replace('"Спорт": "Sport",', '"Фалсафа": "Falsafa",');
c = c.replace('"Маданият": "Madaniyat",', '"Адабиёт": "Adabiyot",');

fs.writeFileSync('app.jsx', c, 'utf8');
console.log("Categories updated.");
