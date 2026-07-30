const fs = require('fs');
let app = fs.readFileSync('app.jsx', 'utf8');

// Update AdminLanguages
let adminLang = `
function AdminLanguages({ languages, setLanguages }) {
  const [newLang, setNewLang] = React.useState({ id: "", name: "", shortName: "" });
  const [editId, setEditId] = React.useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const isEdit = !!editId;
      const url = isEdit ? \`/api/admin/languages/\${editId}\` : "/api/admin/languages";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", 'Authorization': \`Bearer \${document.cookie.replace(/(?:(?:^|.*;\\s*)yk_session\\s*\\=\\s*([^;]*).*$)|^.*$/, "$1")}\` },
        body: JSON.stringify(newLang)
      });
      if (res.ok) {
        const data = await res.json();
        if (isEdit) {
          setLanguages(languages.map(l => l.id === editId ? data.data : l));
        } else {
          setLanguages([...languages, data.data]);
        }
        setNewLang({ id: "", name: "", shortName: "" });
        setEditId(null);
        alert(isEdit ? "Til muvaffaqiyatli tahrirlandi!" : "Til muvaffaqiyatli qo'shildi!");
      }
    } catch (err) {
      alert("Xatolik yuz berdi");
    }
  };

  const handleEdit = (lang) => {
    setEditId(lang.id);
    setNewLang({ id: lang.id, name: lang.name, shortName: lang.shortName });
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Rostdan ham o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(\`/api/admin/languages/\${id}\`, {
        method: "DELETE",
        headers: { 'Authorization': \`Bearer \${document.cookie.replace(/(?:(?:^|.*;\\s*)yk_session\\s*\\=\\s*([^;]*).*$)|^.*$/, "$1")}\` }
      });
      if (res.ok) {
        setLanguages(languages.filter(l => l.id !== id));
      }
    } catch (err) {
      alert("Xatolik yuz berdi");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "800", color: "var(--ink)" }}>🌐 Tillar (Languages)</h2>
      
      <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>{editId ? "Tilni tahrirlash" : "Yangi til qo'shish"}</h3>
        <form onSubmit={handleAdd} style={{ display: "flex", gap: "16px", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
            <label style={{ fontSize: "14px", fontWeight: "700" }}>ID (masalan: ru, tr)</label>
            <input disabled={!!editId} required type="text" value={newLang.id} onChange={e => setNewLang({...newLang, id: e.target.value})} style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--fill)", color: "var(--ink)", opacity: editId ? 0.5 : 1 }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
            <label style={{ fontSize: "14px", fontWeight: "700" }}>To'liq nomi (masalan: Русский)</label>
            <input required type="text" value={newLang.name} onChange={e => setNewLang({...newLang, name: e.target.value})} style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--fill)", color: "var(--ink)" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
            <label style={{ fontSize: "14px", fontWeight: "700" }}>Qisqa nomi (masalan: Рус)</label>
            <input required type="text" value={newLang.shortName} onChange={e => setNewLang({...newLang, shortName: e.target.value})} style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--fill)", color: "var(--ink)" }} />
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button type="submit" style={{ padding: "10px 24px", background: "var(--brand)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", height: "42px" }}>{editId ? "Saqlash" : "Qo'shish"}</button>
            {editId && (
              <button type="button" onClick={() => {setEditId(null); setNewLang({id: "", name: "", shortName: ""})}} style={{ padding: "10px 24px", background: "var(--fill)", color: "var(--ink)", border: "1px solid var(--line)", borderRadius: "8px", fontWeight: "700", cursor: "pointer", height: "42px" }}>Bekor qilish</button>
            )}
          </div>
        </form>
      </div>

      <div style={{ background: "var(--surface)", borderRadius: "12px", border: "1px solid var(--line)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "var(--fill)", borderBottom: "1px solid var(--line)" }}>
              <th style={{ padding: "16px 24px" }}>ID</th>
              <th style={{ padding: "16px 24px" }}>To'liq Nomi</th>
              <th style={{ padding: "16px 24px" }}>Qisqa Nomi</th>
              <th style={{ padding: "16px 24px", textAlign: "right" }}>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {languages.map(l => (
              <tr key={l.id} style={{ borderBottom: "1px solid var(--line)" }}>
                <td style={{ padding: "16px 24px", fontWeight: "700" }}>{l.id}</td>
                <td style={{ padding: "16px 24px" }}>{l.name}</td>
                <td style={{ padding: "16px 24px" }}>{l.shortName}</td>
                <td style={{ padding: "16px 24px", textAlign: "right", display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                  <button onClick={() => handleEdit(l)} style={{ padding: "6px 12px", background: "rgba(37, 99, 235, 0.1)", color: "#2563eb", border: "none", borderRadius: "4px", cursor: "pointer" }}>Tahrirlash</button>
                  <button onClick={() => handleDelete(l.id)} style={{ padding: "6px 12px", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "none", borderRadius: "4px", cursor: "pointer" }}>O'chirish</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`;

// Update AdminCategories
let adminCat = `
function AdminCategories({ categories, setCategories, languages }) {
  const [newCat, setNewCat] = React.useState({ slug: "", names: {} });
  const [editId, setEditId] = React.useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const isEdit = !!editId;
      const url = isEdit ? \`/api/categories/\${editId}\` : "/api/categories";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", 'Authorization': \`Bearer \${document.cookie.replace(/(?:(?:^|.*;\\s*)yk_session\\s*\\=\\s*([^;]*).*$)|^.*$/, "$1")}\` },
        body: JSON.stringify(newCat)
      });
      if (res.ok) {
        const data = await res.json();
        if (isEdit) {
          setCategories(categories.map(c => c.id === editId ? data.data : c));
        } else {
          setCategories([...categories, data.data]);
        }
        setNewCat({ slug: "", names: {} });
        setEditId(null);
        alert(isEdit ? "Rukn muvaffaqiyatli tahrirlandi!" : "Rukn muvaffaqiyatli qo'shildi!");
      }
    } catch (err) {
      alert("Xatolik yuz berdi");
    }
  };

  const handleEdit = (cat) => {
    setEditId(cat.id);
    setNewCat({ slug: cat.slug, names: { ...cat.names } });
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Rostdan ham o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(\`/api/categories/\${id}\`, {
        method: "DELETE",
        headers: { 'Authorization': \`Bearer \${document.cookie.replace(/(?:(?:^|.*;\\s*)yk_session\\s*\\=\\s*([^;]*).*$)|^.*$/, "$1")}\` }
      });
      if (res.ok) {
        setCategories(categories.filter(c => c.id !== id));
      }
    } catch (err) {
      alert("Xatolik yuz berdi");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "800", color: "var(--ink)" }}>📁 Ruknlar (Categories)</h2>
      
      <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>{editId ? "Ruknni tahrirlash" : "Yangi rukn qo'shish"}</h3>
        <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "14px", fontWeight: "700" }}>Rukn Slug (URL uchun, masalan: jamiyat)</label>
            <input required type="text" value={newCat.slug} onChange={e => setNewCat({...newCat, slug: e.target.value})} style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--fill)", color: "var(--ink)" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
            {languages.map(l => (
              <div key={l.id} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "14px", fontWeight: "700" }}>Nomi ({l.name})</label>
                <input 
                  required 
                  type="text" 
                  value={newCat.names[l.id] || ""} 
                  onChange={e => setNewCat({ ...newCat, names: { ...newCat.names, [l.id]: e.target.value } })} 
                  style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--fill)", color: "var(--ink)" }} 
                />
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "8px", alignSelf: "flex-start" }}>
            <button type="submit" style={{ padding: "10px 24px", background: "var(--brand)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>{editId ? "Saqlash" : "Qo'shish"}</button>
            {editId && (
              <button type="button" onClick={() => {setEditId(null); setNewCat({ slug: "", names: {} })}} style={{ padding: "10px 24px", background: "var(--fill)", color: "var(--ink)", border: "1px solid var(--line)", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>Bekor qilish</button>
            )}
          </div>
        </form>
      </div>

      <div style={{ background: "var(--surface)", borderRadius: "12px", border: "1px solid var(--line)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "var(--fill)", borderBottom: "1px solid var(--line)" }}>
              <th style={{ padding: "16px 24px" }}>Slug</th>
              {languages.map(l => (
                <th key={l.id} style={{ padding: "16px 24px" }}>{l.shortName}</th>
              ))}
              <th style={{ padding: "16px 24px", textAlign: "right" }}>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id} style={{ borderBottom: "1px solid var(--line)" }}>
                <td style={{ padding: "16px 24px", fontWeight: "700" }}>{c.slug}</td>
                {languages.map(l => (
                  <td key={l.id} style={{ padding: "16px 24px" }}>{c.names[l.id] || ""}</td>
                ))}
                <td style={{ padding: "16px 24px", textAlign: "right", display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                  <button onClick={() => handleEdit(c)} style={{ padding: "6px 12px", background: "rgba(37, 99, 235, 0.1)", color: "#2563eb", border: "none", borderRadius: "4px", cursor: "pointer" }}>Tahrirlash</button>
                  <button onClick={() => handleDelete(c.id)} style={{ padding: "6px 12px", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "none", borderRadius: "4px", cursor: "pointer" }}>O'chirish</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`;

// Now replace both in app
const regexLang = /function AdminLanguages\(\{\s*languages,\s*setLanguages\s*\}\) \{[\s\S]*?\}\s*function AdminCategories/;
app = app.replace(regexLang, adminLang.trim() + '\n\nfunction AdminCategories');

const regexCat = /function AdminCategories\(\{\s*categories,\s*setCategories,\s*languages\s*\}\) \{[\s\S]*?\}\s*function AdminSettings/;
app = app.replace(regexCat, adminCat.trim() + '\n\nfunction AdminSettings');

fs.writeFileSync('app.jsx', app);
