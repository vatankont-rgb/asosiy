const fs = require('fs');
let app = fs.readFileSync('app.jsx', 'utf8');

const newMediaItems = `const mediaItems = {
  uz: [
    { type: "video", title: "Yangi loyiha taqdimoti", meta: "Video | 10:00", url: "https://picsum.photos/800/450?video1" },
    { type: "photo", title: "Fotogalereya: Shahar ko'chalari", meta: "Foto | Kecha", url: "https://picsum.photos/800/450?photo1" },
    { type: "video", title: "Intervyu: Yosh tadbirkorlar", meta: "Video | 2 kun oldin", url: "https://picsum.photos/800/450?video2" },
    { type: "video", title: "Tahliliy ko'rsatuv", meta: "Video | 1 hafta oldin", url: "https://picsum.photos/800/450?video3" }
  ],
  ru: [
    { type: "video", title: "Презентация нового проекта", meta: "Видео | 10:00", url: "https://picsum.photos/800/450?video1" },
    { type: "photo", title: "Фотогалерея: Улицы города", meta: "Фото | Вчера", url: "https://picsum.photos/800/450?photo1" },
    { type: "video", title: "Интервью: Молодые предприниматели", meta: "Видео | 2 дня назад", url: "https://picsum.photos/800/450?video2" },
    { type: "video", title: "Аналитическая программа", meta: "Видео | Неделю назад", url: "https://picsum.photos/800/450?video3" }
  ],
  uzk: [
    { type: "video", title: "Янги лойиҳа тақдимоти", meta: "Видео | 10:00", url: "https://picsum.photos/800/450?video1" },
    { type: "photo", title: "Фотогалерея: Шаҳар кўчалари", meta: "Фото | Кеча", url: "https://picsum.photos/800/450?photo1" },
    { type: "video", title: "Интервью: Ёш тадбиркорлар", meta: "Видео | 2 кун олдин", url: "https://picsum.photos/800/450?video2" },
    { type: "video", title: "Таҳлилий кўрсатув", meta: "Видео | 1 ҳафта олдин", url: "https://picsum.photos/800/450?video3" }
  ]
};`;

app = app.replace(/const mediaItems = \{[\s\S]*?\n\};\n/m, newMediaItems + '\n');
fs.writeFileSync('app.jsx', app, 'utf8');
console.log('Fixed mediaItems URLs');
