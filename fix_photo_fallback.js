const fs = require('fs');
let code = fs.readFileSync('app.jsx', 'utf8');

// Fix AdminPhotos fallback image (around line 6632)
const targetPhotoFallback = `) : form.url && <img src={form.url} alt="Preview" style={{ height: 100, marginTop: 12, borderRadius: 6, objectFit: "cover", border: "1px solid var(--line)", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }} />}`;
const replacementPhotoFallback = `) : form.url ? (
  <div style={{ position: "relative", display: "inline-block", marginTop: 12 }}>
    <img src={form.url} alt="Preview" style={{ height: 100, borderRadius: 6, objectFit: "cover", border: "1px solid var(--line)", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", display: "block" }} />
    <button type="button" onClick={() => setForm({...form, url: ""})} style={{ position: "absolute", top: -8, right: -8, background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>&times;</button>
  </div>
) : null}`;
code = code.replace(targetPhotoFallback, replacementPhotoFallback);

fs.writeFileSync('app.jsx', code);
console.log('Added delete button to Photo fallback!');
