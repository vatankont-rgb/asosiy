const fs = require('fs');
let txt = fs.readFileSync('app.jsx', 'utf8');

txt = txt.replace(
  /const t = copy\[lang\] \|\| copy\.uz;/,
  `const baseCopy = copy.uz;
  const remoteCopy = uiStrings && uiStrings[lang] ? uiStrings[lang] : {};
  const t = { ...baseCopy, ...remoteCopy };`
);

txt = txt.replace(
  /if \(lang === "en"\) \{\n\s*const map = categoryMap\.en \|\| \{\};\n\s*const found = Object\.keys\(map\)\.find\(k => map\[k\] === catVal\);\n\s*if \(found\) displayCat = found;\n\s*\}/,
  `if (categories && categories.length > 0) {
      const catObj = categories.find(c => c.slug === catVal || c.names["uz"] === catVal || c.names["en"] === catVal);
      if(catObj) {
        displayCat = catObj.names[lang] || catObj.names["en"] || catObj.slug;
      }
    }`
);

// We should also look for hardcoded "Toshkent" mapping and remove the categoryMap thing if it's there
txt = txt.replace(/const categoryMap = \{[\s\S]*?\};\n/, '');

fs.writeFileSync('app.jsx', txt);
console.log('Translation mapping updated');
