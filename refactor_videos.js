const fs = require('fs');

let code = fs.readFileSync('app.jsx', 'utf8');

// AdminVideos replace
const startMarkerVideos = '        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>';
const endMarkerVideos = '        </form>\n      </div>\n\n      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>';

const startIdxV = code.lastIndexOf(startMarkerVideos);
const endIdxV = code.lastIndexOf(endMarkerVideos);

if(startIdxV !== -1 && endIdxV !== -1) {
  const newVideosForm = `        <form onSubmit={handleSave} className="adm-2col-layout">
          <div className="adm-col-main" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="adm-card">
              <h3 className="adm-card-header">Asosiy ma'lumotlar</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label className="adm-form-label">Sarlavha (Title)</label>
                  <input type="text" className="adm-form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="Masalan: Qora dengizdagi yangi kelishuv..." />
                </div>
                <div>
                  <label className="adm-form-label">Rukn va vaqt (Meta)</label>
                  <input type="text" className="adm-form-input" value={form.meta} onChange={e => setForm({...form, meta: e.target.value})} placeholder="Masalan: Dunyo | 12:15" />
                </div>
                <div>
                  <label className="adm-form-label">{isUz ? "Matn (ixtiyoriy)" : "Text (optional)"}</label>
                  <RichEditor value={form.body} onChange={(html) => setForm({...form, body: html})} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="adm-col-side" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
             <div className="adm-card">
               <h3 className="adm-card-header">Video manba</h3>
               <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                 <div>
                   <label className="adm-form-label">Video URL (YouTube yoki mp4)</label>
                   <input type="url" value={form.url} onChange={e => setForm({...form, url: e.target.value})} className="adm-form-input" required placeholder="https://youtube.com/watch?v=..." />
                 </div>
               </div>
             </div>
             
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
  code = code.substring(0, startIdxV) + newVideosForm + code.substring(endIdxV);
}

fs.writeFileSync('app.jsx', code);
console.log('Videos form replaced.');
