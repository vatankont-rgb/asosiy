const fs = require('fs');

let app = fs.readFileSync('app.jsx', 'utf8');

// 1. Update Ads initialization
const oldAdsInit = `  const [ads, setAds] = useState(() => {
    localStorage.removeItem("yk-ads");
    return [];
  });

  useEffect(() => {
    localStorage.setItem("yk-ads", JSON.stringify(ads));
  }, [ads]);`;

const newAdsInit = `  const [ads, setAds] = useState([]);`;
app = app.replace(oldAdsInit, newAdsInit);

// 2. Fetch Ads
const oldRefreshEffect = `  useEffect(() => {
    refreshPublicStories();
  }, []);`;

const newRefreshEffect = `  useEffect(() => {
    refreshPublicStories();
    fetchAds();
  }, []);

  async function fetchAds() {
    try {
      const res = await fetch("/api/ads");
      if (res.ok) {
        const data = await res.json();
        setAds(data.ads || []);
      }
    } catch(err) {
      console.error("Failed to fetch ads", err);
    }
  }`;

app = app.replace(oldRefreshEffect, newRefreshEffect);

// 3. Inject AdminAds component at the top of file or end of file before ReactDOM.render?
// Let's create AdminAds as a separate file and require it or just append it before `App`
// Wait, `app.jsx` is transpiled entirely. It's better to put AdminAds component inside `app.jsx`.
// Let's inject it right before `AdminPanel` definition.

const adminAdsComp = `
function AdminAds({ ads, setAds, uploadFile }) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [formData, setFormData] = React.useState({ title: "", link: "", position: "inline", image: "" });

  async function handleCreate(e) {
    e.preventDefault();
    if (!formData.image && !formData.title) return alert("Rasm yoki sarlavha kiritilishi shart!");
    
    try {
      const res = await fetch("/api/admin/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const data = await res.json();
        setAds(prev => [...prev, data.ad]);
        setFormData({ title: "", link: "", position: "inline", image: "" });
        alert("Reklama qo'shildi!");
      }
    } catch (err) {
      alert("Xatolik yuz berdi");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Rostdan ham o'chirasizmi?")) return;
    try {
      const res = await fetch(\`/api/admin/ads/\${id}\`, { method: "DELETE" });
      if (res.ok) {
        setAds(prev => prev.filter(a => a.id !== id));
      }
    } catch (err) {}
  }

  async function toggleActive(ad) {
    try {
      const res = await fetch(\`/api/admin/ads/\${ad.id}\`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !ad.active })
      });
      if (res.ok) {
        const data = await res.json();
        setAds(prev => prev.map(a => a.id === ad.id ? data.ad : a));
      }
    } catch(err) {}
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if(!file) return;
    setIsUploading(true);
    const url = await uploadFile(file);
    setIsUploading(false);
    if(url) {
      setFormData(prev => ({ ...prev, image: url }));
    }
  }

  return (
    <div className="admin-section" style={{animation: "fadeIn 0.3s ease"}}>
      <h2 style={{color: "var(--brand)", marginBottom: 16}}>Reklamalar (Banners)</h2>
      
      <div style={{ background: "var(--surface)", padding: 24, borderRadius: 12, marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <h3>Yangi reklama qo'shish</h3>
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{display:"block", marginBottom:4, fontSize:14, fontWeight:"600"}}>Sarlavha (Ixtiyoriy)</label>
              <input className="input" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} placeholder="Reklama nomi" />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{display:"block", marginBottom:4, fontSize:14, fontWeight:"600"}}>Link (Havola)</label>
              <input className="input" type="url" value={formData.link} onChange={e=>setFormData({...formData, link: e.target.value})} placeholder="https://..." />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{display:"block", marginBottom:4, fontSize:14, fontWeight:"600"}}>Joylashuvi</label>
              <select className="input" value={formData.position} onChange={e=>setFormData({...formData, position: e.target.value})}>
                <option value="top">Tepa (Header tagida)</option>
                <option value="bottom">Past (Footer tepasida)</option>
                <option value="inline">Maqolalar orasida</option>
                <option value="sidebar">Yon tomonda (Sidebar)</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{display:"block", marginBottom:4, fontSize:14, fontWeight:"600"}}>Rasm yuklash</label>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <input type="file" accept="image/*" onChange={handleUpload} disabled={isUploading} />
              {isUploading && <span>Yuklanmoqda...</span>}
            </div>
            {formData.image && <img src={formData.image} alt="Preview" style={{ height: 60, marginTop: 8, borderRadius: 4, objectFit: "cover" }} />}
          </div>
          <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>Qo'shish</button>
        </form>
      </div>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
        {ads.map(ad => (
          <div key={ad.id} style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {ad.image ? (
              <img src={ad.image} alt="Ad" style={{ width: "100%", height: 120, objectFit: "cover", background: "#f0f0f0" }} />
            ) : (
              <div style={{ width: "100%", height: 120, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}>Rasm yo'q</div>
            )}
            <div style={{ padding: 12, flex: 1 }}>
              <h4 style={{ margin: "0 0 8px 0" }}>{ad.title || "Sarlavhasiz"}</h4>
              <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 8px 0" }}><strong>Joylashuv:</strong> {ad.position}</p>
              <a href={ad.link} target="_blank" style={{ fontSize: 13, color: "var(--brand)", wordBreak: "break-all" }}>{ad.link}</a>
            </div>
            <div style={{ padding: 12, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafafa" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 }}>
                <input type="checkbox" checked={ad.active} onChange={() => toggleActive(ad)} /> Faol
              </label>
              <button onClick={() => handleDelete(ad.id)} style={{ background: "transparent", border: "none", color: "var(--brand)", cursor: "pointer", fontSize: 18 }} title="O'chirish">🗑</button>
            </div>
          </div>
        ))}
        {ads.length === 0 && <p style={{ color: "var(--muted)" }}>Hozircha reklamalar yo'q.</p>}
      </div>
    </div>
  );
}

function AdminPanel(`;

app = app.replace("function AdminPanel(", adminAdsComp);

// 4. Inject into AdminPanel Sidebar
const oldAdsSidebar = `>🖼️ Media Kutubxona</button>

        <button 
          onClick={() => setActiveTab("seo-audit")}`;

const newAdsSidebar = `>🖼️ Media Kutubxona</button>

        <button 
          onClick={() => setActiveTab("ads")} 
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", background: activeTab === "ads" ? "rgba(195, 25, 50, 0.08)" : "transparent", color: activeTab === "ads" ? "var(--brand)" : "var(--ink)", fontWeight: "700", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}
        >💰 Reklamalar</button>

        <button 
          onClick={() => setActiveTab("seo-audit")}`;

app = app.replace(oldAdsSidebar, newAdsSidebar);

// 5. Inject AdminAds rendering
const oldAdsTabContent = `{activeTab === "seo-audit" && <AdminSeoAudit allStories={allStories} />}`;
const newAdsTabContent = `{activeTab === "seo-audit" && <AdminSeoAudit allStories={allStories} />}
{activeTab === "ads" && <AdminAds ads={ads} setAds={setAds} uploadFile={uploadFile} />}`;

app = app.replace(oldAdsTabContent, newAdsTabContent);

// Add uploadFile method to AdminPanel so we can pass it down
// Actually, uploadFile is defined inside AdminPanel:
// const uploadFile = async (file) => { ... }
// This exists in AdminPanel.

fs.writeFileSync('app.jsx', app);
console.log('Modified app.jsx successfully.');
