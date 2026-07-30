const fs = require('fs');
let c = fs.readFileSync('app.jsx', 'utf8');

c = c.replaceAll('в˜ЂпёЏ', '☀️');
c = c.replaceAll('в˜ЃпёЏ', '☁️');
c = c.replaceAll('в–¶', '▶');
c = c.replaceAll('в—‰', '◉');
c = c.replaceAll('в†’', '→');
c = c.replaceAll('рџЊ‘', '🌒');
c = c.replaceAll('рџЊћ', '🌞');
c = c.replaceAll('рџ”—', '🔗');
c = c.replaceAll('вњ€пёЏ', '✈️');
c = c.replaceAll('вњ“', '✓');

fs.writeFileSync('app.jsx', c, 'utf8');
console.log("Replaced all remaining mojibakes!");
