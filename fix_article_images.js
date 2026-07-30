const fs = require('fs');
let code = fs.readFileSync('app.jsx', 'utf8');

// Fix AdminArticles featured image (around line 6030+)
const targetArticleImage = `{form.image && <img src={form.image} alt="Preview" style={{ height: 100, marginTop: 12, borderRadius: 6, objectFit: "cover", border: "1px solid var(--line)", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }} />}`;
const replacementArticleImage = `{form.image && (
  <div style={{ position: "relative", display: "inline-block", marginTop: 12 }}>
    <img src={form.image} alt="Preview" style={{ height: 100, borderRadius: 6, objectFit: "cover", border: "1px solid var(--line)", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", display: "block" }} />
    <button type="button" onClick={() => setForm({...form, image: ""})} style={{ position: "absolute", top: -8, right: -8, background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>&times;</button>
  </div>
)}`;
code = code.replace(targetArticleImage, replacementArticleImage);

// Fix Ads preview image (around line 5083)
const targetAdsImage = `{formData.image && <img src={formData.image} alt="Preview" style={{ height: 80, marginTop: 12, borderRadius: 6, objectFit: "cover", border: "1px solid var(--line)", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }} />}`;
const replacementAdsImage = `{formData.image && (
  <div style={{ position: "relative", display: "inline-block", marginTop: 12 }}>
    <img src={formData.image} alt="Preview" style={{ height: 80, borderRadius: 6, objectFit: "cover", border: "1px solid var(--line)", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", display: "block" }} />
    <button type="button" onClick={() => setFormData({...formData, image: ""})} style={{ position: "absolute", top: -8, right: -8, background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>&times;</button>
  </div>
)}`;
code = code.replace(targetAdsImage, replacementAdsImage);

fs.writeFileSync('app.jsx', code);
console.log('Added delete buttons to featured images!');
