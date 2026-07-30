const fs = require('fs');
let app = fs.readFileSync('app.jsx', 'utf8');
const search = /<span className="media-photo-icon">[\s\S]*?<\/span>/g;
const replacement = '<span className="media-photo-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg></span>';
app = app.replace(search, replacement);
fs.writeFileSync('app.jsx', app);
console.log('Icon replaced successfully!');
