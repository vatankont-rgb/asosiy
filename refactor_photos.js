const fs = require('fs');

let code = fs.readFileSync('app.jsx', 'utf8');

// AdminPhotos replace
const startMarkerPhotos = '        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>';
const endMarkerPhotos = '        </form>\n      </div>\n\n      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>';

const startIdxP = code.indexOf(startMarkerPhotos);
const endIdxP = code.indexOf(endMarkerPhotos);

if(startIdxP !== -1 && endIdxP !== -1) {
  const newPhotosForm = `        <form onSubmit={handleSave} className="adm-2col-layout">
          <div className="adm-col-main" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="adm-card">
              <h3 className="adm-card-header">Fotogalereya Yaratish</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label className="adm-form-label">Sarlavha (Title) - ixtiyoriy</label>
                  <input type="text" className="adm-form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Masalan: Fotoreportaj..." />
                </div>
                <div>
                  <label className="adm-form-label">Rukn va vaqt (Meta) - ixtiyoriy</label>
                  <input type="text" className="adm-form-input" value={form.meta} onChange={e => setForm({...form, meta: e.target.value})} placeholder="Masalan: Dunyo | 12:15" />
                </div>
                <div>
                  <label className="adm-form-label">Matn (ixtiyoriy)</label>
                  <RichEditor value={form.body} onChange={(html) => setForm({...form, body: html})} />
                </div>
              </div>
            </div>
            
            <div className="adm-card">
              <h3 className="adm-card-header">Rasmlar yuklash</h3>
              <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "32px 20px", border: "2px dashed #cbd5e1", borderRadius: "8px", background: "#f8fafc", justifyContent: "center" }}>
                <input type="file" accept="image/*" multiple onChange={handleUpload} disabled={uploading} style={{ cursor: "pointer", maxWidth: "250px" }} />
                {uploading && <span style={{ color: "#3b82f6", fontSize: 14, fontWeight: "600" }}>Yuklanmoqda...</span>}
              </div>
              {(form.images && form.images.length > 0) ? (
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px" }}>
                  {form.images.map((img, i) => (
                    <div key={i} style={{ position: "relative", width: 100, height: 100 }}>
                      <img src={img} alt="Preview" style={{ width: "100%", height: "100%", borderRadius: 6, objectFit: "cover", border: "1px solid var(--line)" }} />
                      <button type="button" onClick={() => {
                          const newImages = form.images.filter((_, idx) => idx !== i);
                          setForm({...form, images: newImages, url: newImages[0] || ''});
                      }} style={{ position: "absolute", top: -8, right: -8, background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>&times;</button>
                    </div>
                  ))}
                </div>
              ) : form.url ? (
                <div style={{ position: "relative", display: "inline-block", marginTop: 16 }}>
                  <img src={form.url} alt="Preview" style={{ height: 100, borderRadius: 6, objectFit: "cover", border: "1px solid var(--line)", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", display: "block" }} />
                  <button type="button" onClick={() => setForm({...form, url: ""})} style={{ position: "absolute", top: -8, right: -8, background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>&times;</button>
                </div>
              ) : null}
            </div>
          </div>
          
          <div className="adm-col-side" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
             <div className="adm-card">
               <h3 className="adm-card-header">Amallar</h3>
               <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                 <button type="submit" disabled={loading} style={{ padding: "12px 24px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", boxShadow: "0 2px 8px rgba(59, 130, 246, 0.4)" }}>
                   {loading ? "Saqlanmoqda..." : "Saqlash"}
                 </button>
                 {editingId && (
                   <button type="button" onClick={() => { setEditingId(null); setForm({title:"",meta:"",url:"",images:[],body:""}); }} style={{ padding: "12px 24px", background: "transparent", color: "var(--ink)", border: "1px solid var(--line)", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>
                     Bekor qilish
                   </button>
                 )}
               </div>
             </div>
          </div>
`;
  code = code.substring(0, startIdxP) + newPhotosForm + code.substring(endIdxP);
}

fs.writeFileSync('app.jsx', code);
console.log('Photos form replaced.');
