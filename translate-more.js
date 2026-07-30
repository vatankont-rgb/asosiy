const fs = require('fs');
let txt = fs.readFileSync('app.jsx', 'utf8');

// 1. Translate siteConfig specifically in the fallback
txt = txt.replace(/kicker: "Спецпроект"/g, 'kicker: "Special Project"');
txt = txt.replace(/title: "Журналистика на основе данных: отделяем события от шума"/g, 'title: "Data journalism: separating events from noise"');
txt = txt.replace(/text: "Редакция Vatan\.uz понятным языком объясняет важные процессы в политике, экономике, технологиях, спорте и культуре\."/g, 'text: "Vatan.uz explains important processes in politics, economics, technology, sports and culture in clear language."');

// 2. Fix inline translation remainders
txt = txt.replace(/\`\$\{mins\} мин\`/g, '`${mins} min`');
txt = txt.replace(/"Исмингиз \(ихтиёрий\)" : "Ваше имя \(необязательно\)"/g, '"Исмингиз (ихтиёрий)" : "Your name (optional)"');
txt = txt.replace(/"Подтверждаете удаление\?"/g, '"Confirm deletion?"');
txt = txt.replace(/"☀️ Светлая тема"/g, '"☀️ Light theme"');
txt = txt.replace(/"🌙 Тёмная тема"/g, '"🌙 Dark theme"');
txt = txt.replace(/"Нажмите в˜… в статье"/g, '"Click ★ in article"');
txt = txt.replace(/Показать ещё \(осталось/g, 'Show more (left');
txt = txt.replace(/en:\s*\{\s*0:"Ясно",\s*1:"Преимущественно ясно",[\s\S]*?99:"Град"\s*\}/g, 'en: { 0:"Clear", 1:"Mostly clear", 2:"Partly cloudy", 3:"Overcast", 45:"Fog", 48:"Fog", 51:"Light rain", 53:"Rain", 55:"Heavy rain", 61:"Rain", 63:"Rain", 65:"Heavy rain", 71:"Snow", 73:"Snow", 75:"Heavy snow", 80:"Rain", 81:"Rain", 82:"Thunderstorm", 95:"Thunderstorm", 96:"Hail", 99:"Hail" }');


// 3. Translate mediaItems.en (which might be currently named ru or en, but contains Russian strings)
// Since there's a lot of mediaItems, let's just do a regex replace on the title and meta if they are Cyrillic inside en.
// Actually, let's overwrite the 'en' array entirely in mediaItems if it exists.

const enMedia = `en: [
    { type: "video", title: "How many nuclear power plants in the world and where was the first built?", meta: "World | 09:38", url: "https://picsum.photos/800/450?v1" },
    { type: "video", title: "New tourism complex and average salary in Margilan", meta: "Uzbekistan | 19:50", url: "https://picsum.photos/800/450?v2" },
    { type: "video", title: "Shareholder debt and compensation", meta: "Uzbekistan | 19:00", url: "https://picsum.photos/800/450?v3" },
    { type: "video", title: "LIVE: Shooting in Washington and Araqchi in Moscow", meta: "World | 15:07", url: "https://picsum.photos/800/450?v4" },
    { type: "video", title: "Putin-Araqchi meeting, Iran's proposal and daily digest", meta: "World | 14:48", url: "https://picsum.photos/800/450?v5" },
    { type: "video", title: "New agreement in Black Sea: will export routes change?", meta: "World | 12:15", url: "https://picsum.photos/800/450?v6" },
    { type: "photo", title: "Deceiving people using an inspector's uniform", meta: "Uzbekistan | 17:00", url: "https://picsum.photos/800/600?p1" },
    { type: "photo", title: "Graveyard of Empires: why wasn't Afghanistan conquered?", meta: "World | 11:34", url: "https://picsum.photos/800/600?p2" },
    { type: "photo", title: "International cultural festival in Samarkand", meta: "Culture | 13:20", url: "https://picsum.photos/800/600?p3" },
    { type: "photo", title: "New look of Tashkent: photo report", meta: "Uzbekistan | 10:45", url: "https://picsum.photos/800/600?p4" },
    { type: "photo", title: "Mountains and nature: landscapes of Uzbekistan", meta: "Nature | 08:30", url: "https://picsum.photos/800/600?p5" },
    { type: "photo", title: "Youth forum: participants and ideas", meta: "Society | 16:00", url: "https://picsum.photos/800/600?p6" },
    { type: "photo", title: "Charity event: helping families", meta: "Society | 11:00", url: "https://picsum.photos/800/600?p7" },
    { type: "photo", title: "National dress day: fashion show", meta: "Culture | 09:15", url: "https://picsum.photos/800/600?p8" },
    { type: "photo", title: "Ancient streets of Bukhara: historical photo report", meta: "Uzbekistan | 15:40", url: "https://picsum.photos/800/600?p9" },
    { type: "photo", title: "Uzbek national food festival", meta: "Culture | 12:00", url: "https://picsum.photos/800/600?p10" },
    { type: "photo", title: "Presentation of the New Tashkent project", meta: "Uzbekistan | 09:30", url: "https://picsum.photos/800/600?p11" }
  ]`;

// Let's replace the `en: [...]` array inside mediaItems.
txt = txt.replace(/ru:\s*\[[\s\S]*?\]/g, enMedia); // In case it's still named ru:
txt = txt.replace(/en:\s*\[[\s\S]*?\]/, enMedia); // Replace the first match of en: array (assuming it's in mediaItems)

fs.writeFileSync('app.jsx', txt);
console.log('Finished updating app.jsx with full English texts.');
