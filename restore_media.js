const fs = require('fs');

const mediaItems = {
  uzk: [
    { type: "video", title: "Дунёда нечта АЭС бор ва уларнинг биринчиси қаерда қурилган?", meta: "Дунё | 09:38", url: "https://picsum.photos/800/450?v1" },
    { type: "video", title: "Марғилонда янги туризм мажмуаси ва ўртача иш ҳақи", meta: "Ўзбекистон | 19:50", url: "https://picsum.photos/800/450?v2" },
    { type: "video", title: "Акциядорлардан қарздорлик ва компенсация", meta: "Ўзбекистон | 19:00", url: "https://picsum.photos/800/450?v3" },
    { type: "video", title: "LIVE: Вашингтондаги отишма ва Москвага борган Ароқчи", meta: "Дунё | 15:07", url: "https://picsum.photos/800/450?v4" },
    { type: "video", title: "Путин-Ароқчи учрашуви, Эрон таклифи ва кун дайжести", meta: "Дунё | 14:48", url: "https://picsum.photos/800/450?v5" },
    { type: "photo", title: "Инспектор формасидан фойдаланиб одамларни алдади", meta: "Ўзбекистон | 17:00", url: "https://picsum.photos/800/450?p1" },
    { type: "photo", title: "Империялар қабристони: нега Афғонистон бўйсундирилмади?", meta: "Дунё | 11:34", url: "https://picsum.photos/800/450?p2" },
    { type: "photo", title: "Самарқандда халқаро маданият фестивали", meta: "Маданият | 13:20", url: "https://picsum.photos/800/450?p3" },
    { type: "photo", title: "Тошкентнинг янги кўриниши: фоторепортаж", meta: "Ўзбекистон | 10:45", url: "https://picsum.photos/800/450?p4" },
    { type: "photo", title: "Тоғ ва табиат: Ўзбекистон манзаралари", meta: "Табиат | 08:30", url: "https://picsum.photos/800/450?p5" },
    { type: "photo", title: "Ёшлар форуми: иштирокчилар ва ғоялар", meta: "Жамият | 16:00", url: "https://picsum.photos/800/450?p6" },
    { type: "photo", title: "Хайрия акцияси: оилаларга ёрдам кўрсатилди", meta: "Жамият | 11:00", url: "https://picsum.photos/800/450?p7" },
    { type: "photo", title: "Миллий кийим куни: либослар намойиши", meta: "Маданият | 09:15", url: "https://picsum.photos/800/450?p8" }
  ],
  uz: [
    { type: "video", title: "Dunyoda nechta AES bor va ularning birinchisi qayerda qurilgan?", meta: "Dunyo | 09:38", url: "https://picsum.photos/800/450?v1" },
    { type: "video", title: "Marg'ilonda yangi turizm majmuasi va o'rtacha ish haqi", meta: "O'zbekiston | 19:50", url: "https://picsum.photos/800/450?v2" },
    { type: "video", title: "Aksiyadorlardan qarzdorlik va kompensatsiya", meta: "O'zbekiston | 19:00", url: "https://picsum.photos/800/450?v3" },
    { type: "video", title: "LIVE: Vashingtondagi otishma va Moskvaga borgan Aroqchi", meta: "Dunyo | 15:07", url: "https://picsum.photos/800/450?v4" },
    { type: "video", title: "Putin-Aroqchi uchrashuvi, Eron taklifi va kun dayjesti", meta: "Dunyo | 14:48", url: "https://picsum.photos/800/450?v5" },
    { type: "photo", title: "Inspektor formasidan foydalanib odamlarni aldadi", meta: "O'zbekiston | 17:00", url: "https://picsum.photos/800/450?p1" },
    { type: "photo", title: "Imperiyalar qabristoni: nega Afg'oniston bo'ysundirilmadi?", meta: "Dunyo | 11:34", url: "https://picsum.photos/800/450?p2" },
    { type: "photo", title: "Samarqandda xalqaro madaniyat festivali", meta: "Madaniyat | 13:20", url: "https://picsum.photos/800/450?p3" },
    { type: "photo", title: "Toshkentning yangi ko'rinishi: fotoreportaj", meta: "O'zbekiston | 10:45", url: "https://picsum.photos/800/450?p4" },
    { type: "photo", title: "Tog' va tabiat: O'zbekiston manzaralari", meta: "Tabiat | 08:30", url: "https://picsum.photos/800/450?p5" },
    { type: "photo", title: "Yoshlar forumi: ishtirokchilar va g'oyalar", meta: "Jamiyat | 16:00", url: "https://picsum.photos/800/450?p6" },
    { type: "photo", title: "Xayriya aksiyasi: oilalarga yordam ko'rsatildi", meta: "Jamiyat | 11:00", url: "https://picsum.photos/800/450?p7" },
    { type: "photo", title: "Milliy kiyim kuni: liboslar namoyishi", meta: "Madaniyat | 09:15", url: "https://picsum.photos/800/450?p8" }
  ],
  ru: [
    { type: "video", title: "Сколько АЭС в мире и где была построена первая?", meta: "Мир | 09:38", url: "https://picsum.photos/800/450?v1" },
    { type: "video", title: "Новый туристический комплекс в Маргилане и средняя зарплата", meta: "Узбекистан | 19:50", url: "https://picsum.photos/800/450?v2" },
    { type: "video", title: "Задолженность и компенсации акционерам", meta: "Узбекистан | 19:00", url: "https://picsum.photos/800/450?v3" },
    { type: "video", title: "LIVE: Стрельба в Вашингтоне и визит Аракчи в Москву", meta: "Мир | 15:07", url: "https://picsum.photos/800/450?v4" },
    { type: "video", title: "Встреча Путина и Аракчи, предложение Ирана и дайджест дня", meta: "Мир | 14:48", url: "https://picsum.photos/800/450?v5" },
    { type: "photo", title: "Обманывал людей, используя форму инспектора", meta: "Узбекистан | 17:00", url: "https://picsum.photos/800/450?p1" },
    { type: "photo", title: "Кладбище империй: почему Афганистан не был покорен?", meta: "Мир | 11:34", url: "https://picsum.photos/800/450?p2" },
    { type: "photo", title: "Международный фестиваль культуры в Самарканде", meta: "Культура | 13:20", url: "https://picsum.photos/800/450?p3" },
    { type: "photo", title: "Новый облик Ташкента: фоторепортаж", meta: "Узбекистан | 10:45", url: "https://picsum.photos/800/450?p4" },
    { type: "photo", title: "Горы и природа: пейзажи Узбекистана", meta: "Природа | 08:30", url: "https://picsum.photos/800/450?p5" },
    { type: "photo", title: "Молодежный форум: участники и идеи", meta: "Общество | 16:00", url: "https://picsum.photos/800/450?p6" },
    { type: "photo", title: "Благотворительная акция: помощь семьям", meta: "Общество | 11:00", url: "https://picsum.photos/800/450?p7" },
    { type: "photo", title: "День национальной одежды: показ мод", meta: "Культура | 09:15", url: "https://picsum.photos/800/450?p8" }
  ]
};

let c = fs.readFileSync('app.jsx', 'utf8');

// Replace the old mediaItems object
c = c.replace(/const mediaItems = \{[\s\S]*?\n\};\n/m, "const mediaItems = " + JSON.stringify(mediaItems, null, 2) + ";\n\n");

fs.writeFileSync('app.jsx', c, 'utf8');
console.log("Replaced mediaItems with full data.");
