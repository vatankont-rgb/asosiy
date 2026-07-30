const fs=require('fs');
let c=fs.readFileSync('app.jsx','utf8');
const search = `pages: ["Р“Р»Р°РІРЅР°СЏ", "РџРѕР»РёС‚РёРєР°", "Р­РєРѕРЅРѕРјРёРєР°", "Р˜СЃС‚РѕСЂРёСЏ", "Р¤РёР»РѕСЃРѕС„РёСЏ", "Р›РёС‚РµСЂР°С‚СѓСЂР°"],`;
const replacement = `pages: ["Р“Р»Р°РІРЅР°СЏ", "РџРѕР»РёС‚РёРєР°", "Р­РєРѕРЅРѕРјРёРєР°", "РўРµС…РЅР0Р»РѕРіРёРё", "РЎРїРѕСЂС‚", "РљСѓР»СЊС‚СѓСЂР°", "РљРѕРЅС‚Р°РєС‚С‹"],`;
// wait, "РўРµС…РЅРѕР»РѕРіРёРё" was it? Let's just find the line and replace the whole line.
const lines = c.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('pages: [') && lines[i].includes('Р“Р»Р°РІРЅР°СЏ')) {
    lines[i] = `    pages: ["Р“Р»Р°РІРЅР°СЏ", "РџРѕР»РёС‚РёРєР°", "Р­РєРѕРЅРѕРјРёРєР°", "РўРµС…РЅРѕР»РѕРіРёРё", "РЎРїРѕСЂС‚", "РљСѓР»СЊС‚СѓСЂР°", "РљРѕРЅС‚Р°РєС‚С‹"],`;
  }
}
fs.writeFileSync('app.jsx', lines.join('\n'), 'utf8');
console.log('done');
