const fs = require('fs');
let txt = fs.readFileSync('app.jsx', 'utf8');

txt = txt.replace(/>Бошқарув панели</g, '>Dashboard<');
txt = txt.replace(/>⚙️ Zaxiralash ва Маълумотлар \(Backup\)</g, '>⚙️ Backup & Data<');
txt = txt.replace(/>Barcha maqolalar, sozlamalar va ruknlarni bitta JSON fayl holatida yukлаб олинг ёки тикланг\.</g, '>Download or restore all articles, settings, and sections as a single JSON file.<');
txt = txt.replace(/Редакция Vatan\.uz/g, 'Vatan.uz Editorial');
txt = txt.replace(/минуты/g, 'minutes');

fs.writeFileSync('app.jsx', txt);
console.log('Final fixes applied');
