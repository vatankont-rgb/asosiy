const fs = require('fs');
let txt = fs.readFileSync('app.jsx', 'utf8');

txt = txt.replace(/<span>© \{year\} Vatan\.uz\. Barcha huquqlar himoyalangan\.<\/span>/g, '<span>© {year} Vatan.uz. {lang === "en" ? "All rights reserved." : (lang === "uzk" ? "Барча ҳуқуқлар ҳимояланган." : "Barcha huquqlar himoyalangan.")}</span>');

fs.writeFileSync('app.jsx', txt);
console.log('Footer text translated.');
