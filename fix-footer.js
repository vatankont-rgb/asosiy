const fs = require('fs');
let txt = fs.readFileSync('app.jsx', 'utf8');

txt = txt.replace(/<span>© \{year\} Vatan\.uz\. \{lang === "en" \? "All rights reserved\." : \(lang === "uzk" \? "Барча ҳуқуқлар ҳимояланган\." : "Barcha huquqlar himoyalangan\."\)\}<\/span>/g, '<span>© {year} Vatan.uz. {window.__currentLang === "en" ? "All rights reserved." : (window.__currentLang === "uzk" ? "Барча ҳуқуқлар ҳимояланган." : "Barcha huquqlar himoyalangan.")}</span>');

fs.writeFileSync('app.jsx', txt);
console.log('Footer error fixed.');
