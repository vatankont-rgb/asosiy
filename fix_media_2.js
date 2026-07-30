const fs = require('fs');

let c = fs.readFileSync('app.jsx', 'utf8');
const lines = c.split('\n');

for (let i = 0; i < lines.length; i++) {
  // Fix BreakingBanner typo from multi_replace_file_content hallucination
  if (lines[i].includes('РЎР РЎРћР§РќРћ')) {
    lines[i] = lines[i].replace('РЎР РЎРћР§РќРћ', 'РЎР РћР§РќРћ');
  }

  // Fix MediaBlock array destructuring
  if (lines[i].includes('<img src={featured[3]} alt="" />')) {
    lines[i] = lines[i].replace('featured[3]', 'featured.url');
  }
  if (lines[i].includes('<span>{featured[2]}</span>')) {
    lines[i] = lines[i].replace('featured[2]', 'featured.meta');
  }
  if (lines[i].includes('<strong>{featured[1]}</strong>')) {
    lines[i] = lines[i].replace('featured[1]', 'featured.title');
  }
  if (lines[i].includes('const [t, itemTitle, meta, image] = item;')) {
    lines[i] = lines[i].replace('const [t, itemTitle, meta, image] = item;', 'const { title: itemTitle, meta, url: image } = item;');
  }
}

fs.writeFileSync('app.jsx', lines.join('\n'), 'utf8');
console.log('Fixed array indexing in app.jsx');
