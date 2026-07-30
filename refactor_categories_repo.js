const fs = require('fs');
let repoTxt = fs.readFileSync('server/repositories/categoryRepository.js', 'utf8');

repoTxt = repoTxt.replace(
  /const defaults = \[\n([\s\S]*?)\];/,
  `const defaults = [
        { id: 'cat-1', names: { uz: 'Siyosat', uzk: 'Сиёсат', en: 'Politics' }, slug: 'siyosat', order: 1, parentId: null },
        { id: 'cat-2', names: { uz: 'Iqtisodiyot', uzk: 'Иқтисодиёт', en: 'Economy' }, slug: 'iqtisodiyot', order: 2, parentId: null },
        { id: 'cat-3', names: { uz: 'Texnologiya', uzk: 'Технология', en: 'Technology' }, slug: 'texnologiya', order: 3, parentId: null },
        { id: 'cat-4', names: { uz: 'Sport', uzk: 'Спорт', en: 'Sport' }, slug: 'sport', order: 4, parentId: null },
        { id: 'cat-5', names: { uz: 'Madaniyat', uzk: 'Маданият', en: 'Culture' }, slug: 'madaniyat', order: 5, parentId: null },
        { id: 'cat-6', names: { uz: 'Tahlil', uzk: 'Таҳлил', en: 'Analysis' }, slug: 'tahlil', order: 6, parentId: null }
      ];`
);

fs.writeFileSync('server/repositories/categoryRepository.js', repoTxt);

let catTxt = JSON.stringify([
        { id: 'cat-1', names: { uz: 'Siyosat', uzk: 'Сиёсат', en: 'Politics' }, slug: 'siyosat', order: 1, parentId: null },
        { id: 'cat-2', names: { uz: 'Iqtisodiyot', uzk: 'Иқтисодиёт', en: 'Economy' }, slug: 'iqtisodiyot', order: 2, parentId: null },
        { id: 'cat-3', names: { uz: 'Texnologiya', uzk: 'Технология', en: 'Technology' }, slug: 'texnologiya', order: 3, parentId: null },
        { id: 'cat-4', names: { uz: 'Sport', uzk: 'Спорт', en: 'Sport' }, slug: 'sport', order: 4, parentId: null },
        { id: 'cat-5', names: { uz: 'Madaniyat', uzk: 'Маданият', en: 'Culture' }, slug: 'madaniyat', order: 5, parentId: null },
        { id: 'cat-6', names: { uz: 'Tahlil', uzk: 'Таҳлил', en: 'Analysis' }, slug: 'tahlil', order: 6, parentId: null }
], null, 2);
fs.writeFileSync('server/storage/categories.json', catTxt);
console.log('Categories repository and DB updated.');
