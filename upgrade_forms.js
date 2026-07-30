const fs = require('fs');
let code = fs.readFileSync('app.jsx', 'utf8');

// Replace labels
code = code.replace(/<label style=\{\{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px", color: "var\(--text\)" \}\}>/g, '<label className="adm-form-label">');
code = code.replace(/<label style=\{\{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px", color: "var\(--text\)" \}\}/g, '<label className="adm-form-label"');

// Replace inputs
code = code.replace(/<input type="text" value=\{form\.title\} onChange=\{e => setForm\(\{\.\.\.form, title: e\.target\.value\}\)\} style=\{\{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var\(--line\)", fontSize: "15px" \}\}/g, '<input type="text" className="adm-form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})}');
code = code.replace(/<input type="text" value=\{form\.meta\} onChange=\{e => setForm\(\{\.\.\.form, meta: e\.target\.value\}\)\} style=\{\{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var\(--line\)", fontSize: "15px" \}\}/g, '<input type="text" className="adm-form-input" value={form.meta} onChange={e => setForm({...form, meta: e.target.value})}');

code = code.replace(/<input type="text" value=\{form\.url\} onChange=\{e => setForm\(\{\.\.\.form, url: e\.target\.value\}\)\} style=\{\{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var\(--line\)", fontSize: "15px" \}\}/g, '<input type="text" className="adm-form-input" value={form.url} onChange={e => setForm({...form, url: e.target.value})}');

// Also update AdminArticles form inside AdminPanel (lines ~5900-6100)
// It has: <input type="text" value={form.title[activeLang] || ""} onChange={...} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)" }} />
code = code.replace(/style=\{\{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var\(--line\)" \}\}/g, 'className="adm-form-input"');
code = code.replace(/style=\{\{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var\(--line\)", fontSize: "15px" \}\}/g, 'className="adm-form-input"');
code = code.replace(/<label style=\{\{ fontSize: "14px", fontWeight: "700" \}\}>/g, '<label className="adm-form-label">');
code = code.replace(/<label style=\{\{ fontSize: "14px", fontWeight: "600" \}\}>/g, '<label className="adm-form-label">');

fs.writeFileSync('app.jsx', code);
console.log('Done upgrading forms');
