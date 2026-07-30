const fs = require('fs');
let txt = fs.readFileSync('app.jsx', 'utf8');

txt = txt.replace(
  /const langKey = lang === "en" \? "ru" : lang === "uzk" \? "uzk" : "uz";/g,
  'const langKey = lang === "en" ? "en" : lang === "uzk" ? "uzk" : "uz";'
);

txt = txt.replace(
  /<span className="weather-city">Toshkent<\/span>/g,
  '<span className="weather-city">{lang === "en" ? "Tashkent" : lang === "uzk" ? "Тошкент" : "Toshkent"}</span>'
);

fs.writeFileSync('app.jsx', txt);
console.log('Weather widget fixed.');
