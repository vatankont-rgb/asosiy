const fs = require('fs');
let code = fs.readFileSync('app.jsx', 'utf8');

// 1. Revert UZ categories
const uzNew = `    pages: ["Bosh sahifa", "Siyosat", "Iqtisodiyot", "Tarix", "Falsafa", "Adabiyot"],
    pageNotes: {
      "Bosh sahifa": "Asosiy xabarlar, trendlar va kunning eng muhim mavzulari.",
      "Siyosat": "Davlat boshqaruvi, parlament, mahalliy kengashlar va jamoatchilik muhokamalari.",
      "Iqtisodiyot": "Bozorlar, biznes, moliya, bandlik va tadbirkorlik muhiti.",
      "Tarix": "O'tmish sahifalari, tarixiy voqealar va shaxslar.",
      "Falsafa": "Falsafiy qarashlar, mutafakkirlar va dunyoqarash.",
      "Adabiyot": "She'riyat, nasr, kitobxonlik va adabiy tanqid.",
    },`;

const uzOld = `    pages: ["Bosh sahifa", "Siyosat", "Iqtisod", "Texnologiya", "Sport", "Madaniyat", "Aloqa"],
    pageNotes: {
      "Bosh sahifa": "Asosiy xabarlar, trendlar va kunning eng muhim mavzulari.",
      Siyosat: "Davlat boshqaruvi, parlament, mahalliy kengashlar va jamoatchilik muhokamalari.",
      Iqtisod: "Bozorlar, biznes, moliya, bandlik va tadbirkorlik muhiti.",
      Texnologiya: "Startaplar, sun'iy intellekt, raqamli xizmatlar va kiberxavfsizlik.",
      Sport: "Futbol, olimpiya sportlari, turnirlar va sportchilar hikoyalari.",
      Madaniyat: "Kino, teatr, kitob, musiqa va shahar hayotidagi madaniy voqealar.",
      Aloqa: "Tahririyat bilan bog'lanish, reklama va hamkorlik uchun ma'lumotlar.",
    },`;

// 2. Revert RU categories (it has Cyrillic so regex is safer for page array replacement)
// Actually we can just do a regex replace for the RU pages and pageNotes blocks
const ruPagesRegex = /pages:\s*\["Главная"[^\]]*\]/;
const ruOldPages = `pages: ["Главная", "Политика", "Экономика", "Технологии", "Спорт", "Культура", "Контакты"]`;

const ruNotesRegex = /pageNotes:\s*\{\s*"Главная"[^\}]*\}/;
const ruOldNotes = `pageNotes: {
      "Главная": "Главные материалы, тренды и ключевые темы дня.",
      "Политика": "Государственное управление, парламент и общественные обсуждения.",
      "Экономика": "Рынки, бизнес, финансы и предпринимательская среда.",
      "Технологии": "Стартапы, искусственный интеллект, цифровые сервисы и кибербезопасность.",
      "Спорт": "Футбол, олимпийские виды спорта, турниры и истории спортсменов.",
      "Культура": "Кино, театр, музыка, литература и культурное наследие.",
      "Контакты": "Связь с редакцией, реклама и сотрудничество.",
    }`;

// 3. Revert UZK categories
const uzkPagesRegex = /pages:\s*\["Бош саҳифа"[^\]]*\]/;
const uzkOldPages = `pages: ["Бош саҳифа", "Сиёсат", "Иқтисод", "Технология", "Спорт", "Маданият", "Алоқа"]`;

const uzkNotesRegex = /pageNotes:\s*\{\s*"Бош саҳифа"[^\}]*\}/;
const uzkOldNotes = `pageNotes: {
    "Бош саҳифа": "Асосий хабарлар, трендлар ва куннинг энг муҳим мавзулари.",
    "Сиёсат": "Давлат бошқаруви, парламент, маҳаллий кенгашлар ва жамоатчилик муҳокамалари.",
    "Иқтисод": "Бозорлар, бизнес, молия, бандлик ва тадбиркорлик муҳити.",
    "Технология": "Стартаплар, сунъий интеллект, рақамли хизматлар ва киберхавфсизлик.",
    "Спорт": "Футбол, олимпия спортлари, турнирлар ва спортчилар ҳикоялари.",
    "Маданият": "Кино, театр, китоб, мусиқа ва шаҳар ҳаётидаги маданий воқеалар.",
    "Алоқа": "Таҳририят билан боғланиш, реклама ва ҳамкорлик учун маълумотлар.",
  }`;

// 4. Revert categoryMap
const catMapNew = `const categoryMap = {
  uz: {
    
    Siyosat: "Siyosat",
    Iqtisodiyot: "Iqtisodiyot",
    Tarix: "Tarix",
    Falsafa: "Falsafa",
    Adabiyot: "Adabiyot",
  },
  ru: {
    "Главная": null,
    "Политика": "Siyosat",
    "Экономика": "Iqtisodiyot",
    "История": "Tarix",
    "Философия": "Falsafa",
    "Литература": "Adabiyot",
  },
};
categoryMap["uzk"] = {
  "Бош саҳифа": null,
  "Сиёсат": "Siyosat",
  "Иқтисодиёт": "Iqtisodiyot",
  "Тарих": "Tarix",
  "Фалсафа": "Falsafa",
  "Адабиёт": "Adabiyot",
};`;

const catMapOld = `const categoryMap = {
  uz: {
    "Bosh sahifa": null,
    "Siyosat": "Siyosat",
    "Iqtisod": "Iqtisod",
    "Texnologiya": "Texnologiya",
    "Sport": "Sport",
    "Madaniyat": "Madaniyat",
    "Aloqa": "Aloqa"
  },
  ru: {
    "Главная": null,
    "Политика": "Siyosat",
    "Экономика": "Iqtisod",
    "Технологии": "Texnologiya",
    "Спорт": "Sport",
    "Культура": "Madaniyat",
    "Контакты": "Aloqa"
  }
};
categoryMap["uzk"] = {
  "Бош саҳифа": null,
  "Сиёсат": "Siyosat",
  "Иқтисод": "Iqtisod",
  "Технология": "Texnologiya",
  "Спорт": "Sport",
  "Маданият": "Madaniyat",
  "Алоқа": "Aloqa"
};`;

code = code.replace(uzNew, uzOld);
code = code.replace(ruPagesRegex, ruOldPages);
code = code.replace(ruNotesRegex, ruOldNotes);
code = code.replace(uzkPagesRegex, uzkOldPages);
code = code.replace(uzkNotesRegex, uzkOldNotes);
code = code.replace(catMapNew, catMapOld);

// 5. Revert navbar mapping to pages.slice(1).map
code = code.replace('{pages.map((item) => (', '{pages.slice(1).map((item) => (');

fs.writeFileSync('app.jsx', code, 'utf8');
console.log("Restored categories!");
