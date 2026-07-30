const fs = require('fs');
const iconv = require('iconv-lite');

const c = fs.readFileSync('app.jsx', 'utf8');

let fixed = c.replace(/[^\x00-\x7F]+/g, (match) => {
  const buf = iconv.encode(match, 'windows-1251');
  
  try {
    const decoded = iconv.decode(buf, 'utf8');
    
    // Check for replacement character \uFFFD
    if (decoded.includes('\uFFFD')) return match; 
    
    if (decoded !== match && !decoded.includes('?')) {
        if (buf.includes(0x3f) && !match.includes('?')) {
            return match; 
        }
        return decoded;
    }
  } catch(e) {}
  return match;
});

// Also fix the uz pages array!
fixed = fixed.replace(
  'pages: ["Siyosat", "Iqtisodiyot", "Tarix", "Falsafa", "Adabiyot"],',
  'pages: ["Bosh sahifa", "Siyosat", "Iqtisod", "Texnologiya", "Sport", "Madaniyat", "Aloqa"],'
);

fs.writeFileSync('app.jsx.fixed', fixed, 'utf8');
console.log('Fixed saved to app.jsx.fixed');
