const fs = require('fs');

let code = fs.readFileSync('app.jsx', 'utf8');

// Replace in AdminPanel
code = code.replace(
  '<button type="submit" style={{ padding: "12px 16px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "700", cursor: "pointer", flex: 1, boxShadow: "0 2px 8px rgba(59, 130, 246, 0.4)" }}>',
  '<button type="button" onClick={(e) => { if(!form.title) { alert("Sarlavha kiritilishi shart!"); return; } handleSave(e); }} style={{ padding: "12px 16px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "700", cursor: "pointer", flex: 1, boxShadow: "0 2px 8px rgba(59, 130, 246, 0.4)" }}>'
);

// Replace in AdminPhotos
code = code.replace(
  '<button type="submit" disabled={loading} style={{ padding: "12px 24px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", boxShadow: "0 2px 8px rgba(59, 130, 246, 0.4)" }}>',
  '<button type="button" onClick={handleSave} disabled={loading} style={{ padding: "12px 24px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", boxShadow: "0 2px 8px rgba(59, 130, 246, 0.4)" }}>'
);

// Replace in AdminVideos
code = code.replace(
  '<button type="submit" disabled={loading} style={{ padding: "12px 24px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", boxShadow: "0 2px 8px rgba(59, 130, 246, 0.4)" }}>',
  '<button type="button" onClick={handleSave} disabled={loading} style={{ padding: "12px 24px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", boxShadow: "0 2px 8px rgba(59, 130, 246, 0.4)" }}>'
);

// Remove required attribute from title input in AdminPanel just in case it interferes
code = code.replace(
  'placeholder="Maqola sarlavhasi..."\n                    required\n                    className="adm-form-input"',
  'placeholder="Maqola sarlavhasi..."\n                    className="adm-form-input"'
);

fs.writeFileSync('app.jsx', code);
console.log('Fixed button click handler.');
