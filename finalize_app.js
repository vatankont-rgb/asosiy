const fs = require('fs');
let c = fs.readFileSync('app.jsx.fixed', 'utf8');

const replacements = [
  { bad: "в˜ЂпёЏ", good: "☀️" },
  { bad: "в˜ЃпёЏ", good: "☁️" },
  { bad: "в–¶", good: "▶" },
  { bad: "в—‰", good: "◉" },
  { bad: "в†’", good: "→" },
  { bad: "рџЊ‘", good: "🌒" },
  { bad: "рџЊћ", good: "🌞" },
  { bad: "рџ”—", good: "🔗" },
  { bad: "вњ€пёЏ", good: "✈️" },
  { bad: "вњ“", good: "✓" }
];

replacements.forEach(({bad, good}) => {
  // Replace all occurrences
  c = c.split(bad).join(good);
});

// Fix uz pages if they are still broken (sometimes the previous replace might have failed if it had whitespace differences)
const oldUzPages = `pages: ["Siyosat", "Iqtisodiyot", "Tarix", "Falsafa", "Adabiyot"],`;
const newUzPages = `pages: ["Bosh sahifa", "Siyosat", "Iqtisod", "Texnologiya", "Sport", "Madaniyat", "Aloqa"],`;
c = c.replace(oldUzPages, newUzPages);

// Also ru pages
const oldRuPages = `pages: ["Р“Р»Р°РІРЅР°СЏ", "РџРѕР»РёС‚РёРєР°", "Р­РєРѕРЅРѕРјРёРєР°", "Р˜СЃС‚РѕСЂРёСЏ", "Р¤РёР»РѕСЃРѕС„РёСЏ", "Р›РёС‚РµСЂР°С‚СѓСЂР°"],`;
const newRuPages = `pages: ["Главная", "Политика", "Экономика", "Технологии", "Спорт", "Культура", "Контакты"],`;
c = c.replace(oldRuPages, newRuPages); // Just in case it wasn't fixed

fs.writeFileSync('app.jsx', c, 'utf8');
console.log("Finalized!");
