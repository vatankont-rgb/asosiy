const fs = require('fs');
const lines = fs.readFileSync('app.jsx', 'utf8').split('\n');

const newSettingsBlock = '        {activeTab === "settings" && <AdminSettings />}';
const sIndex = 4470;
const eIndex = 4510;
lines.splice(sIndex, eIndex - sIndex + 1, newSettingsBlock);

const pIndex = lines.findIndex(l => l.includes('function AdminPanel'));
const settingsComponent = fs.readFileSync('adminSettings_scratch.jsx', 'utf8');

lines.splice(pIndex, 0, settingsComponent + '\n');
fs.writeFileSync('app.jsx', lines.join('\n'));
console.log('Injected successfully');
