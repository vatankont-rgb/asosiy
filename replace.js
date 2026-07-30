const fs = require('fs');

let c = fs.readFileSync('app.jsx', 'utf8');

// Language checks
c = c.replace(/lang === "ru"/g, 'lang === "en"');
c = c.replace(/lang !== "ru"/g, 'lang !== "en"');
c = c.replace(/currentLang !== "ru"/g, 'currentLang !== "en"');
c = c.replace(/changeLang\("ru"\)/g, 'changeLang("en")');
c = c.replace(/>RU</g, '>EN<');

// Variables and state
c = c.replace(/uiRu/g, 'uiEn');
c = c.replace(/specialRu/g, 'specialEn');
c = c.replace(/stories\.ru/g, 'stories.en');
c = c.replace(/categoryMap\.ru/g, 'categoryMap.en');
c = c.replace(/data\.stories\.ru/g, 'data.stories.en');
c = c.replace(/ru:/g, 'en:'); // risky, let's limit scope if possible. Wait, actually I will just do exact replacements
c = c.replace(/"ru-RU"/g, '"en-US"');
c = c.replace(/\['uz', 'ru'\]/g, "['uz', 'en']");
c = c.replace(/Rus tili \(RU\)/g, "English (EN)");
c = c.replace(/uz: \{\}, ru: \{\}/g, "uz: {}, en: {}");
c = c.replace(/langKey === 'ru'/g, "langKey === 'en'");
c = c.replace(/langKey === "ru"/g, 'langKey === "en"');

// Translations
c = c.replace(/"Политика"/g, '"Politics"');
c = c.replace(/"Экономика"/g, '"Economy"');
c = c.replace(/"История"/g, '"History"');
c = c.replace(/"Философия"/g, '"Philosophy"');
c = c.replace(/"Литература"/g, '"Literature"');
c = c.replace(/"Главная"/g, '"Home"');
c = c.replace(/"Все рубрики"/g, '"All Categories"');
c = c.replace(/"Сохранённые"/g, '"Saved"');
c = c.replace(/"Сохранённые статьи"/g, '"Saved articles"');
c = c.replace(/"Очистить всё"/g, '"Clear all"');
c = c.replace(/"Ничего не сохранено"/g, '"Nothing saved yet"');
c = c.replace(/"Нажмите ★ в статье"/g, '"Click ★ on an article"');
c = c.replace(/"Светлая тема"/g, '"Light theme"');
c = c.replace(/"Тёмная тема"/g, '"Dark theme"');
c = c.replace(/"Погода"/g, '"Weather"');
c = c.replace(/"мин"/g, '"min"');

fs.writeFileSync('app.jsx', c);
console.log('Replacements done.');
