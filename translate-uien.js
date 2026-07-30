const fs = require('fs');

let appJsx = fs.readFileSync('app.jsx', 'utf8');

const updatedUiEn = `const uiEn = {
  "Bosh sahifa": "Home",
  "Maqolalar": "Articles",
  "Siz uchun tavsiyalar": "Recommendations for you",
  "Ko'p o'qiysiz: ": "You read often: ",
  "Ko'proq yangiliklar": "More news",
  "Video": "Video",
  "Foto": "Photo",
  "Tomosha qilish →": "Watch →",
  "Ko'rish →": "Watch →",
  "Kunning eng muhim videolari": "Main videos of the day",
  "Fotoreportajlar va vizual materiallar": "Photo reports and visual materials",
  "Tezkor yangiliklar": "Fast news",
  "Mustaqil tahlil": "Independent analysis",
  "Ikki tilda": "Bilingual",
  "Ishonchli manba": "Reliable source",
  "Monitoring": "Monitoring",
  "Bo'lim": "Sections",
  "Til": "Languages",
  "Maqola": "Articles",
  "Bu bo'limda hozircha maqola yo'q.": "No articles in this section yet.",
  "Saqlash": "Save",
  "Saqlangandan olib tashlash": "Remove from saved",
  "★ Saqlangan": "★ Saved",
  "☆ Saqlash": "☆ Save",
  "Izohlar": "Comments",
  "Hozircha izoh yo'q. Birinchi bo'ling!": "No comments yet. Be the first!",
  "Vatan.uz tahririyati": "Vatan.uz Editorial",
  "Jonli tahririyat": "Live Newsroom"
};`;

appJsx = appJsx.replace(/const uiEn\s*=\s*\{([\s\S]*?)\};/, updatedUiEn);

fs.writeFileSync('app.jsx', appJsx);
console.log('uiEn dictionary translated to English in app.jsx');
