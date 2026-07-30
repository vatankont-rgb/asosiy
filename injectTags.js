const fs = require('fs');
let code = fs.readFileSync('app.jsx', 'utf8');

const adminTagsCode = `
function AdminTags() {
  const [tags, setTags] = React.useState([]);
  const [newTag, setNewTag] = React.useState({ name: "" });
  const [editId, setEditId] = React.useState(null);
  const [showForm, setShowForm] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/tags')
      .then(res => res.json())
      .then(data => {
        if(data && data.data) setTags(data.data);
      })
      .catch(console.error);
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTag.name.trim()) return;
    try {
      const isEdit = !!editId;
      const url = isEdit ? \`/api/tags/\${editId}\` : "/api/tags";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", 'Authorization': \`Bearer \${document.cookie.replace(/(?:(?:^|.*;\\s*)yk_session\\s*\\=\\s*([^;]*).*$)|^.*$/, "$1")}\` },
        body: JSON.stringify(newTag)
      });
      if (res.ok) {
        const data = await res.json();
        if (isEdit) {
          setTags(tags.map(t => t.id === editId ? data.data : t));
        } else {
          setTags([...tags, data.data]);
        }
        setNewTag({ name: "" });
        setEditId(null);
        setShowForm(false);
      }
    } catch (err) {
      alert("Xatolik yuz berdi");
    }
  };

  const handleEdit = (tag) => {
    setEditId(tag.id);
    setNewTag({ name: tag.name });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Rostdan ham o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(\`/api/tags/\${id}\`, {
        method: "DELETE",
        headers: { 'Authorization': \`Bearer \${document.cookie.replace(/(?:(?:^|.*;\\s*)yk_session\\s*\\=\\s*([^;]*).*$)|^.*$/, "$1")}\` }
      });
      if (res.ok) {
        setTags(tags.filter(t => t.id !== id));
      }
    } catch (err) {
      alert("Xatolik yuz berdi");
    }
  };

  return (
    <div className="admin-categories">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "24px" }}>Теглар</h2>
          <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: "14px" }}>Мақолаларга тег бириктириш</p>
        </div>
        <button className="adm-btn primary" onClick={() => { setShowForm(!showForm); if(showForm){ setEditId(null); setNewTag({name:""}); } }}>
          {showForm ? "Yopish" : "+ Янги тег"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", marginBottom: "24px", border: "1px solid #eee" }}>
          <form onSubmit={handleAdd} style={{ display: "flex", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <label className="adm-label">Тег номи</label>
              <input 
                className="adm-input" 
                placeholder="Masalan: Sport"
                value={newTag.name}
                onChange={e => setNewTag({ ...newTag, name: e.target.value })}
                required
              />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button type="submit" className="adm-btn primary">Saqlash</button>
            </div>
          </form>
        </div>
      )}

      {tags.length === 0 && !showForm ? (
        <div style={{ background: "white", padding: "60px 20px", borderRadius: "12px", border: "1px solid #eee", textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "16px" }}>🏷️</div>
          <p style={{ color: "var(--muted)", marginBottom: "20px" }}>Теглар ҳали қўшилмаган</p>
          <button className="adm-btn primary" onClick={() => setShowForm(true)}>Биринчи тегни қўшиш</button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Nomi</th>
                <th style={{ width: "100px", textAlign: "right" }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {tags.map(tag => (
                <tr key={tag.id}>
                  <td>{tag.name}</td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                      <button className="adm-btn outline" onClick={() => handleEdit(tag)}>✎</button>
                      <button className="adm-btn outline" style={{ color: "var(--danger)", borderColor: "var(--danger)" }} onClick={() => handleDelete(tag.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
`;

if (!code.includes('function AdminTags')) {
  code = code.replace('function AdminPanel', adminTagsCode + '\nfunction AdminPanel');
}

// Add state for tags in AdminPanel
if (!code.includes('const [adminTags, setAdminTags] = useState([])')) {
  code = code.replace(
    'const [activeTab, setActiveTab] = useState("dashboard");',
    'const [activeTab, setActiveTab] = useState("dashboard");\n  const [adminTags, setAdminTags] = useState([]);\n  useEffect(() => { fetch("/api/tags").then(r=>r.json()).then(d=>{if(d&&d.data) setAdminTags(d.data)}).catch(console.error) }, []);'
  );
}

// Sidebar button for tags
const tagBtn = `        <button 
          onClick={() => setActiveTab("tags")} 
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", background: activeTab === "tags" ? "rgba(195, 25, 50, 0.08)" : "transparent", color: activeTab === "tags" ? "var(--primary)" : "var(--text)", textAlign: "left", fontWeight: activeTab === "tags" ? "600" : "500", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}
        >🏷️ Теглар</button>`;

if (!code.includes('setActiveTab("tags")')) {
  code = code.replace(
    '        <button \n          onClick={() => setActiveTab("comments")}',
    tagBtn + '\n        <button \n          onClick={() => setActiveTab("comments")}'
  );
}

// Render AdminTags
if (!code.includes('<AdminTags />')) {
  code = code.replace(
    '{activeTab === "comments" && <AdminComments />}',
    '{activeTab === "comments" && <AdminComments />}\n\n        {activeTab === "tags" && <AdminTags />}'
  );
}

fs.writeFileSync('app.jsx', code);
console.log('AdminTags added successfully!');
