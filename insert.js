const fs = require('fs');
let app = fs.readFileSync('app.jsx', 'utf8');

const comp = `
function AdminPhotos({ photos, setPhotos, lang, isUz }) {
  const [form, setForm] = React.useState({ title: '', meta: '', url: '', body: '' });
  const [editingId, setEditingId] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const ps = photos[lang] || [];

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': \`Bearer \${document.cookie.replace(/(?:(?:^|.*;\\s*)yk_session\\s*\\=\\s*([^;]*).*$)|^.*$/, "$1")}\`
          },
          body: JSON.stringify({ file: ev.target.result, type: file.type })
        });
        if (res.ok) {
          const data = await res.json();
          setForm({ ...form, url: data.url });
        } else {
          alert("Xatolik: " + res.statusText);
        }
      } catch (err) {
        alert("Xatolik yuz berdi");
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.url) {
      alert(isUz ? "Rasm yuklash majburiy!" : "Image upload required!");
      return;
    }
    setLoading(true);
    try {
      let res;
      if (editingId) {
        res = await fetch("/api/admin/photos/" + lang + "/" + editingId, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + document.cookie.replace(/(?:(?:^|.*;\\s*)yk_session\\s*\\=\\s*([^;]*).*$)|^.*$/, "$1") },
          body: JSON.stringify(form)
        });
      } else {
        res = await fetch("/api/admin/photos/" + lang, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + document.cookie.replace(/(?:(?:^|.*;\\s*)yk_session\\s*\\=\\s*([^;]*).*$)|^.*$/, "$1") },
          body: JSON.stringify(form)
        });
      }
      if (res.ok) {
        const fresh = await fetch("/api/photos").then(r => r.json());
        setPhotos(fresh);
        setForm({ title: "", meta: "", url: "", body: "" });
        setEditingId(null);
        alert(isUz ? "Foto saqlandi!" : "Photo saved!");
      } else {
        const err = await res.json();
        alert("Xatolik: " + err.message);
      }
    } catch (err) {
      alert("Xatolik: " + err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm(isUz ? "Rostdan ham o'chirasizmi?" : "Are you sure?")) return;
    try {
      const res = await fetch("/api/admin/photos/" + lang + "/" + id, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + document.cookie.replace(/(?:(?:^|.*;\\s*)yk_session\\s*\\=\\s*([^;]*).*$)|^.*$/, "$1") }
      });
      if (res.ok) {
        const fresh = await fetch("/api/photos").then(r => r.json());
        setPhotos(fresh);
      }
    } catch (err) {
      alert("Xatolik: " + err.message);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "var(--ink)" }}>📸 {isUz ? "Fotolar" : "Photos"}</h2>
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "12px", padding: "24px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>{editingId ? (isUz ? "Fotoni tahrirlash" : "Edit photo") : (isUz ? "Yangi foto qo'shish" : "Add new photo")}</h3>
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px", color: "var(--text)" }}>Rasm yuklash</label>
            <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "16px", border: "1.5px dashed var(--line)", borderRadius: "8px", background: "var(--fill)" }}>
              <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} style={{ cursor: "pointer" }} />
              {uploading && <span style={{ color: "var(--brand)", fontSize: 14, fontWeight: "600" }}>Yuklanmoqda...</span>}
            </div>
            {form.url && <img src={form.url} alt="Preview" style={{ height: 120, marginTop: 12, borderRadius: 6, objectFit: "cover", border: "1px solid var(--line)", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }} />}
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px", color: "var(--text)" }}>Sarlavha (Title) - {isUz ? "ixtiyoriy" : "optional"}</label>
            <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", fontSize: "15px" }} placeholder="Masalan: Fotoreportaj..." />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px", color: "var(--text)" }}>Rukn va vaqt (Meta) - {isUz ? "ixtiyoriy" : "optional"}</label>
            <input type="text" value={form.meta} onChange={e => setForm({...form, meta: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", fontSize: "15px" }} placeholder="Masalan: Dunyo | 12:15" />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px", color: "var(--text)" }}>{isUz ? "Matn (ixtiyoriy)" : "Text (optional)"}</label>
            <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "8px", overflow: "hidden" }}>
              <RichEditor value={form.body} onChange={(html) => setForm({...form, body: html})} />
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button type="submit" disabled={loading} style={{ padding: "12px 24px", background: "var(--brand)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>
              {loading ? "Saqlanmoqda..." : "Saqlash"}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm({title:"",meta:"",url:"",body:""}); }} style={{ padding: "12px 24px", background: "transparent", color: "var(--ink)", border: "1px solid var(--line)", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>
                Bekor qilish
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
        {ps.map(p => (
          <div key={p.id} style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ height: "180px", background: "#f5f5f5", position: "relative" }}>
               <img src={p.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={p.title} />
            </div>
            <div style={{ padding: "16px" }}>
              {p.title && <h4 style={{ margin: "0 0 8px 0", fontSize: "15px", fontWeight: "700", lineHeight: "1.4", height: "42px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{p.title}</h4>}
              {p.meta && <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "var(--muted)" }}>{p.meta}</p>}
              <div style={{ display: "flex", gap: "8px", marginTop: (!p.title && !p.meta) ? 0 : 16 }}>
                <button onClick={() => { setForm({ title: p.title || "", meta: p.meta || "", url: p.url, body: p.body || "" }); setEditingId(p.id); window.scrollTo({top:0, behavior:"smooth"}); }} style={{ flex: 1, padding: "8px", background: "var(--surface)", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Tahrirlash</button>
                <button onClick={() => handleDelete(p.id)} style={{ flex: 1, padding: "8px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>O'chirish</button>
              </div>
            </div>
          </div>
        ))}
        {ps.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)", gridColumn: "1 / -1", border: "1px dashed var(--line)", borderRadius: "12px" }}>
            Hozircha fotolar yo'q.
          </div>
        )}
      </div>
    </div>
  );
}
`;

app = app.replace('function AdminVideos', comp + '\nfunction AdminVideos');
fs.writeFileSync('app.jsx', app);
console.log('Injected AdminPhotos!');
