const fs = require('fs');
let c = fs.readFileSync('app.jsx', 'utf8');

// Replace uz keys
c = c.replace('Iqtisod:', 'Iqtisodiyot:');
c = c.replace('Texnologiya:', 'Tarix:');
c = c.replace('Sport:', 'Falsafa:');
c = c.replace('Madaniyat:', 'Adabiyot:');

c = c.replace('"O\'tmish sahifalari, tarixiy voqealar va shaxslar."', '"O\'tmish sahifalari, tarixiy voqealar va shaxslar."');

// Replace uz values (optional, but good to have)
c = c.replace('"Startaplar, sun\'iy intellekt, raqamli xizmatlar va kiberxavfsizlik."', '"O\'tmish sahifalari, tarixiy voqealar va shaxslar."');
c = c.replace('"Futbol, olimpiya sportlari, turnirlar va sportchilar hikoyalari."', '"Falsafiy qarashlar, mutafakkirlar va dunyoqarash."');
c = c.replace('"Kino, teatr, kitob, musiqa va shahar hayotidagi madaniy voqealar."', '"She\'riyat, nasr, kitobxonlik va adabiy tanqid."');

// Replace uzk keys
c = c.replace('Иқтисод:', 'Иқтисодиёт:');
c = c.replace('Технология:', 'Тарих:');
c = c.replace('Спорт:', 'Фалсафа:');
c = c.replace('Маданият:', 'Адабиёт:');

// Replace uzk values
c = c.replace('"Стартаплар, сунъий интеллект, рақамли хизматлар ва киберхавфсизлик."', '"Ўтмиш саҳифалари, тарихий воқеалар ва шахслар."');
c = c.replace('"Футбол, олимпия спортлари, турнирлар ва спортчилар ҳикоялари."', '"Фалсафий қарашлар, мутафаккирлар ва дунёқараш."');
c = c.replace('"Кино, театр, китоб, мусиқа ва шаҳар ҳаётидаги маданий воқеалар."', '"Шеърият, наср, китобхонлик ва адабий танқид."');

// Replace ru keys
c = c.replace('Экономика:', 'Экономика:'); // kept same
c = c.replace('Технологии:', 'История:');
c = c.replace('Спорт:', 'Философия:');
c = c.replace('Культура:', 'Литература:');

// Replace ru values
c = c.replace('"Стартапы, искусственный интеллект, цифровые услуги и кибербезопасность."', '"Страницы прошлого, исторические события и личности."');
c = c.replace('"Футбол, олимпийские виды спорта, турниры и истории спортсменов."', '"Философские взгляды, мыслители и мировоззрение."');
c = c.replace('"Кино, театр, книги, музыка и культурные события города."', '"Поэзия, проза, чтение и литературная критика."');

fs.writeFileSync('app.jsx', c, 'utf8');
console.log("Updated page notes.");
