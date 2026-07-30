function AdminPages({ staticPages, setStaticPages, languages }) {
  const [newPage, setNewPage] = React.useState({ slug: "", title: {}, body: {} });
  const [editId, setEditId] = React.useState(null);
  const [activeLang, setActiveLang] = React.useState("uz");

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const isEdit = !!editId;
      const url = isEdit ? `/api/pages/${editId}` : "/api/pages";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` },
        body: JSON.stringify(newPage)
      });
      if (res.ok) {
        const data = await res.json();
        if (isEdit) {
          setStaticPages(staticPages.map(p => p.id === editId ? data.data : p));
        } else {
          setStaticPages([...staticPages, data.data]);
        }
        setNewPage({ slug: "", title: {}, body: {} });
        setEditId(null);
      }
    } catch (err) {
      alert("Xatolik yuz berdi");
    }
  };

  const handleEdit = (page) => {
    setEditId(page.id);
    setNewPage({ slug: page.slug, title: page.title || {}, body: page.body || {} });
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Rostdan ham o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`/api/pages/${id}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` }
      });
      if (res.ok) {
        setStaticPages(staticPages.filter(p => p.id !== id));
      }
    } catch (err) {
      alert("Xatolik yuz berdi");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>{editId ? "Sahifani tahrirlash" : "Yangi sahifa qo'shish"}</h3>
        <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "14px", fontWeight: "700" }}>Sahifa URL Slug (masalan: about)</label>
            <input required type="text" value={newPage.slug} onChange={e => setNewPage({...newPage, slug: e.target.value})} style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--fill)", color: "var(--ink)" }} />
          </div>

          <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--line)", paddingBottom: "12px" }}>
            {languages.map(l => (
              <button 
                key={l.id} 
                type="button"
                onClick={() => setActiveLang(l.id)}
                style={{ 
                  padding: "6px 12px", borderRadius: "6px", fontSize: "14px", fontWeight: "600",
                  background: activeLang === l.id ? "var(--primary)" : "var(--fill)",
                  color: activeLang === l.id ? "#fff" : "var(--ink)",
                  border: "none", cursor: "pointer"
                }}
              >
                {l.name}
              </button>
            ))}
          </div>

          {languages.map(l => (
            <div key={l.id} style={{ display: activeLang === l.id ? "flex" : "none", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "14px", fontWeight: "700" }}>Sarlavha ({l.name})</label>
                <input 
                  type="text" 
                  value={newPage.title[l.id] || ""} 
                  onChange={e => setNewPage({ ...newPage, title: { ...newPage.title, [l.id]: e.target.value } })} 
                  style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--fill)", color: "var(--ink)" }} 
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "14px", fontWeight: "700" }}>Sahifa matni ({l.name})</label>
                <RichEditor 
                  value={newPage.body[l.id] || ""} 
                  onChange={html => setNewPage({ ...newPage, body: { ...newPage.body, [l.id]: html } })} 
                />
              </div>
            </div>
          ))}

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button type="submit" style={{ padding: "12px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>
              {editId ? "Saqlash" : "Qo'shish"}
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setNewPage({ slug: "", title: {}, body: {} }); }} style={{ padding: "12px 24px", background: "var(--fill)", color: "var(--ink)", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>
                Bekor qilish
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{ background: "var(--surface)", borderRadius: "12px", border: "1px solid var(--line)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "var(--fill)", borderBottom: "1px solid var(--line)" }}>
              <th style={{ padding: "14px 20px", fontSize: "13px", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase" }}>Slug</th>
              <th style={{ padding: "14px 20px", fontSize: "13px", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase" }}>Sarlavha</th>
              <th style={{ padding: "14px 20px", fontSize: "13px", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase", width: "120px" }}>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {staticPages.map(page => (
              <tr key={page.id} style={{ borderBottom: "1px solid var(--line)" }}>
                <td style={{ padding: "16px 20px", fontWeight: "600", color: "var(--ink)" }}>{page.slug}</td>
                <td style={{ padding: "16px 20px" }}>{page.title.uz || page.title.uzk || page.title.en}</td>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => handleEdit(page)} style={{ padding: "6px 12px", fontSize: "13px", borderRadius: "6px", background: "var(--primary)", color: "#fff", border: "none", cursor: "pointer", fontWeight: "600" }}>Tahrir</button>
                    <button onClick={() => handleDelete(page.id)} style={{ padding: "6px 12px", fontSize: "13px", borderRadius: "6px", background: "#ef4444", color: "#fff", border: "none", cursor: "pointer", fontWeight: "600" }}>O'chirish</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
