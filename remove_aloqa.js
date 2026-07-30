const fs = require('fs');
let c = fs.readFileSync('app.jsx', 'utf8');

c = c.replace('pages: ["Bosh sahifa", "Siyosat", "Iqtisodiyot", "Tarix", "Falsafa", "Adabiyot", "Aloqa"],', 'pages: ["Bosh sahifa", "Siyosat", "Iqtisodiyot", "Tarix", "Falsafa", "Adabiyot"],');
c = c.replace('pages: ["Главная", "Политика", "Экономика", "История", "Философия", "Литература", "Контакты"],', 'pages: ["Главная", "Политика", "Экономика", "История", "Философия", "Литература"],');
c = c.replace('pages: ["Бош саҳифа", "Сиёсат", "Иқтисодиёт", "Тарих", "Фалсафа", "Адабиёт", "Алоқа"],', 'pages: ["Бош саҳифа", "Сиёсат", "Иқтисодиёт", "Тарих", "Фалсафа", "Адабиёт"],');

// Replace pages[6] with a hardcoded string just to avoid undefined comparisons breaking anything
c = c.replaceAll('page === pages[6]', 'page === "Aloqa"');
c = c.replaceAll('page !== pages[6]', 'page !== "Aloqa"');

fs.writeFileSync('app.jsx', c, 'utf8');
console.log("Removed Aloqa from menus.");
