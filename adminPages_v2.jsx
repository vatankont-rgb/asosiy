function AdminPages({ staticPages, setStaticPages }) {
  const [editId, setEditId] = React.useState(null);
  const [form, setForm] = React.useState({ slug: "", title: { uz: "", uzk: "", en: "" }, body: { uz: "", uzk: "", en: "" } });
  
  // Tabs for language selection inside the editor
  const [activeLang, setActiveLang] = React.useState("uzk");

  React.useEffect(() => {
    if (staticPages.length > 0 && !editId && !form.slug) {
      handleSelect(staticPages[0]);
    }
  }, [staticPages]);

  const handleSelect = (page) => {
    setEditId(page.id);
    setForm({
      slug: page.slug,
      title: page.title || { uz: "", uzk: "", en: "" },
      body: page.body || { uz: "", uzk: "", en: "" }
    });
  };

  const handleNew = () => {
    setEditId(null);
    setForm({ slug: "", title: { uz: "", uzk: "", en: "" }, body: { uz: "", uzk: "", en: "" } });
  };

  const handleSave = async () => {
    if (!form.slug || (!form.title.uzk && !form.title.uz)) return alert("Slug va sarlavha kiritilishi shart");
    
    const isEdit = !!editId;
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit ? `/api/pages/${editId}` : `/api/pages`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        if (isEdit) {
          setStaticPages(staticPages.map(p => p.id === editId ? data.data : p));
        } else {
          setStaticPages([...staticPages, data.data]);
          setEditId(data.data.id);
        }
        alert("Saqlandi!");
      } else {
        alert(data.message || "Xatolik");
      }
    } catch (err) {
      console.error(err);
      alert("Tarmoq xatosi");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("O'chirilsinmi?")) return;
    try {
      const res = await fetch(`/api/pages/${id}`, { 
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` }
      });
      const data = await res.json();
      if (data.success) {
        const newPages = staticPages.filter(p => p.id !== id);
        setStaticPages(newPages);
        if (editId === id) {
          if (newPages.length > 0) handleSelect(newPages[0]);
          else handleNew();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "24px", margin: "0 0 4px 0", color: "var(--brand)" }}>Sahifalar</h2>
          <p style={{ margin: 0, fontSize: "14px", color: "var(--muted)" }}>Sayt sahifalarini tahrirlash</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px" }}>
          💾 Saqlash
        </button>
      </div>

      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
        {/* Left Sidebar */}
        <div style={{ width: "300px", flexShrink: 0, background: "var(--surface)", borderRadius: "12px", border: "1px solid var(--line)", padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3 style={{ fontSize: "16px", margin: 0, paddingBottom: "12px", borderBottom: "1px solid var(--line)", color: "var(--ink)" }}>Sahifalar</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {staticPages.map(p => {
              const isActive = editId === p.id;
              return (
                <div 
                  key={p.id} 
                  onClick={() => handleSelect(p)}
                  style={{ 
                    padding: "12px 16px", 
                    borderRadius: "8px", 
                    cursor: "pointer", 
                    background: isActive ? "var(--brand)" : "transparent",
                    color: isActive ? "#fff" : "var(--ink)",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ fontWeight: "700", fontSize: "15px", marginBottom: "4px" }}>{p.title.uzk || p.title.uz || p.title.en || "Nomsiz"}</div>
                  <div style={{ fontSize: "12px", opacity: isActive ? 0.8 : 0.5 }}>/{p.slug}</div>
                </div>
              );
            })}
          </div>

          <button 
            onClick={handleNew}
            style={{ 
              marginTop: "8px", padding: "12px", borderRadius: "8px", border: "1px dashed var(--line)", 
              background: "transparent", color: "var(--ink)", fontWeight: "600", cursor: "pointer" 
            }}
          >
            + Yangi sahifa qo'shish
          </button>
        </div>

        {/* Right Content */}
        <div style={{ flex: 1, background: "var(--surface)", borderRadius: "12px", border: "1px solid var(--line)", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "18px", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
              📄 {form.title.uzk || form.title.uz || "Yangi sahifa"}
            </h3>
            {editId && (
              <button 
                onClick={() => handleDelete(editId)}
                style={{ background: "transparent", border: "none", color: "var(--danger)", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}
              >
                O'chirish
              </button>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "600" }}>URL Slug (masalan: about, contact)</label>
              <input className="form-input" style={{ width: "100%", maxWidth: "400px" }} value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required />
            </div>

            {/* Language Tabs for Title and Body */}
            <div>
              <div style={{ display: "flex", gap: "10px", borderBottom: "1px solid var(--line)", paddingBottom: "12px", marginBottom: "16px" }}>
                <button 
                  onClick={() => setActiveLang("uzk")}
                  style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: activeLang === "uzk" ? "var(--brand)" : "var(--fill)", color: activeLang === "uzk" ? "#fff" : "var(--ink)", fontWeight: "600", cursor: "pointer" }}
                >
                  Kirillcha
                </button>
                <button 
                  onClick={() => setActiveLang("uz")}
                  style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: activeLang === "uz" ? "var(--brand)" : "var(--fill)", color: activeLang === "uz" ? "#fff" : "var(--ink)", fontWeight: "600", cursor: "pointer" }}
                >
                  Lotincha
                </button>
                <button 
                  onClick={() => setActiveLang("en")}
                  style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: activeLang === "en" ? "var(--brand)" : "var(--fill)", color: activeLang === "en" ? "#fff" : "var(--ink)", fontWeight: "600", cursor: "pointer" }}
                >
                  Inglizcha
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "600" }}>
                    Sarlavha ({activeLang === 'uzk' ? 'Kirill' : activeLang === 'uz' ? 'Lotin' : 'Ingliz'})
                  </label>
                  <input 
                    className="form-input" 
                    style={{ width: "100%" }} 
                    value={form.title[activeLang] || ""} 
                    onChange={e => setForm({ ...form, title: { ...form.title, [activeLang]: e.target.value } })} 
                  />
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "14px", fontWeight: "600" }}>Sahifa kontentini yozing...</label>
                  <RichEditor 
                    value={form.body[activeLang] || ""} 
                    onChange={html => setForm({ ...form, body: { ...form.body, [activeLang]: html } })} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
