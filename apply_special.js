const fs = require('fs');
let code = fs.readFileSync('app.jsx', 'utf8');

// 1. Update <Special t={t} dial={false} /> -> <Special t={t} dial={false} siteConfig={siteConfig} />
code = code.replace('<Special t={t} dial={false} />', '<Special t={t} dial={false} siteConfig={siteConfig} />');

// 2. Update function Special({ t }) { ... }
code = code.replace('function Special({ t }) {', 'function Special({ t, siteConfig }) {');

code = code.replace(
  `const kicker   = t.specialKicker || T(isUz ? "Maxsus loyiha" : "Special Project");`,
  `const kicker   = siteConfig?.specialProject?.kicker || t.specialKicker || T(isUz ? "Maxsus loyiha" : "Special Project");`
);
code = code.replace(
  `const title    = t.specialTitle || T(isUz ? "Ma'lumotga tayangan jurnalistika: voqeani shovqindan ajratamiz" : "Data journalism: separating events from noise");`,
  `const title    = siteConfig?.specialProject?.title || t.specialTitle || T(isUz ? "Ma'lumotga tayangan jurnalistika: voqeani shovqindan ajratamiz" : "Data journalism: separating events from noise");`
);
code = code.replace(
  `const text     = t.specialText || T(isUz ? "Vatan.uz tahririyati siyosat, iqtisod, texnologiya, sport va madaniyatdagi muhim jarayonlarni ravon tilda tushuntiradi." : "Vatan.uz explains important processes in clear language.");`,
  `const text     = siteConfig?.specialProject?.text || t.specialText || T(isUz ? "Vatan.uz tahririyati siyosat, iqtisod, texnologiya, sport va madaniyatdagi muhim jarayonlarni ravon tilda tushuntiradi." : "Vatan.uz explains important processes in clear language.");`
);
code = code.replace(
  `const badge    = t.specialBadge || T(isUz ? "Jonli tahririyat" : "Live Newsroom");`,
  `const badge    = siteConfig?.specialProject?.badge || t.specialBadge || T(isUz ? "Jonli tahririyat" : "Live Newsroom");`
);
code = code.replace(
  `const imgSrc   = images.newsroom;`,
  `const imgSrc   = siteConfig?.specialProject?.image || images.newsroom;`
);
code = code.replace(
  `const featuresStr = t.specialFeatures || (isUz ? "Tezkor yangiliklar, Mustaqil tahlil, Ikki tilda, Ishonchli manba" : "Fast news, Independent analysis, Bilingual, Reliable source");`,
  `const featuresStr = siteConfig?.specialProject?.features || t.specialFeatures || (isUz ? "Tezkor yangiliklar, Mustaqil tahlil, Ikki tilda, Ishonchli manba" : "Fast news, Independent analysis, Bilingual, Reliable source");`
);

code = code.replace(
  `  const stats = [\n    { num: t.stat1Num || "24/7", label: t.stat1Label || T(isUz ? "Monitoring" : "Monitoring") },\n    { num: t.stat2Num || "7",    label: t.stat2Label || T(isUz ? "Bo'lim" : "Sections") },\n    { num: t.stat3Num || "2",    label: t.stat3Label || T(isUz ? "Til" : "Languages") },\n    { num: t.stat4Num || "100+", label: t.stat4Label || T(isUz ? "Maqola" : "Articles") },\n  ];`,
  `  const stats = [
    { num: siteConfig?.specialProject?.stat1Num || t.stat1Num || "24/7", label: siteConfig?.specialProject?.stat1Label || t.stat1Label || T(isUz ? "Monitoring" : "Monitoring") },
    { num: siteConfig?.specialProject?.stat2Num || t.stat2Num || "7",    label: siteConfig?.specialProject?.stat2Label || t.stat2Label || T(isUz ? "Bo'lim" : "Sections") },
    { num: siteConfig?.specialProject?.stat3Num || t.stat3Num || "2",    label: siteConfig?.specialProject?.stat3Label || t.stat3Label || T(isUz ? "Til" : "Languages") },
    { num: siteConfig?.specialProject?.stat4Num || t.stat4Num || "100+", label: siteConfig?.specialProject?.stat4Label || t.stat4Label || T(isUz ? "Maqola" : "Articles") },
  ];`
);

const adminSpecialCode = `
function AdminSpecial({ isUz, settings, setSettings, saveSettings }) {
  const special = settings.specialProject || {};

  const handleUpdate = (field, val) => {
    setSettings(prev => ({
      ...prev,
      specialProject: { ...prev.specialProject, [field]: val }
    }));
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if(data.url) handleUpdate("image", data.url);
    } catch(err) {
      console.error("Upload error", err);
    }
  };

  return (
    <div className="admin-special-container" style={{padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px'}}>
      <div className="admin-content-header" style={{marginBottom: '20px'}}>
        <h2 className="admin-content-title" style={{fontSize: '24px', fontWeight: 'bold', color: '#fff'}}>Maxsus Loyiha (Special Project)</h2>
        <p className="admin-content-desc" style={{color: '#94a3b8'}}>Bosh sahifadagi maxsus blokni tahrirlash</p>
      </div>
      <div className="admin-grid-layout" style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
        <div className="admin-form-group">
          <label className="admin-label" style={{display: 'block', marginBottom: '5px', color: '#cbd5e1'}}>Kicker (Yorliq)</label>
          <input className="admin-input" style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff'}} value={special.kicker || ""} onChange={e => handleUpdate("kicker", e.target.value)} placeholder="Masalan: Maxsus loyiha" />
        </div>
        <div className="admin-form-group">
          <label className="admin-label" style={{display: 'block', marginBottom: '5px', color: '#cbd5e1'}}>Sarlavha (Title)</label>
          <input className="admin-input" style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff'}} value={special.title || ""} onChange={e => handleUpdate("title", e.target.value)} placeholder="Masalan: Ma'lumotga tayangan jurnalistika..." />
        </div>
        <div className="admin-form-group">
          <label className="admin-label" style={{display: 'block', marginBottom: '5px', color: '#cbd5e1'}}>Matn (Description)</label>
          <textarea className="admin-input" style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff', minHeight: '100px'}} value={special.text || ""} onChange={e => handleUpdate("text", e.target.value)} rows={4} placeholder="Masalan: Vatan.uz tahririyati..." />
        </div>
        <div className="admin-form-group">
          <label className="admin-label" style={{display: 'block', marginBottom: '5px', color: '#cbd5e1'}}>Jonli tahririyat belgisi (Badge)</label>
          <input className="admin-input" style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff'}} value={special.badge || ""} onChange={e => handleUpdate("badge", e.target.value)} placeholder="Masalan: Jonli tahririyat" />
        </div>
        <div className="admin-form-group">
          <label className="admin-label" style={{display: 'block', marginBottom: '5px', color: '#cbd5e1'}}>Teglar (Vergul bilan ajrating)</label>
          <input className="admin-input" style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff'}} value={special.features || ""} onChange={e => handleUpdate("features", e.target.value)} placeholder="Tezkor yangiliklar, Mustaqil tahlil..." />
        </div>
        <div className="admin-form-group">
          <label className="admin-label" style={{display: 'block', marginBottom: '5px', color: '#cbd5e1'}}>Asosiy rasm (Image)</label>
          <input type="file" onChange={uploadImage} accept="image/*" style={{color: '#fff'}} />
          {special.image && <img src={special.image} alt="Preview" style={{marginTop: 10, maxWidth: 300, borderRadius: 10, display: 'block'}} />}
        </div>
        <div className="admin-form-group" style={{gridColumn: '1 / -1'}}>
          <label className="admin-label" style={{display: 'block', marginBottom: '5px', color: '#cbd5e1', fontWeight: 'bold'}}>Statistika (4 ta)</label>
          <div style={{display:'flex', gap:'10px', marginTop: 10}}>
            <input className="admin-input" placeholder="Raqam 1 (Masalan: 24/7)" value={special.stat1Num||""} onChange={e=>handleUpdate("stat1Num",e.target.value)} style={{flex:1, padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff'}}/>
            <input className="admin-input" placeholder="Matn 1 (Masalan: Monitoring)" value={special.stat1Label||""} onChange={e=>handleUpdate("stat1Label",e.target.value)} style={{flex:2, padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff'}}/>
          </div>
          <div style={{display:'flex', gap:'10px', marginTop: 10}}>
            <input className="admin-input" placeholder="Raqam 2 (Masalan: 7)" value={special.stat2Num||""} onChange={e=>handleUpdate("stat2Num",e.target.value)} style={{flex:1, padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff'}}/>
            <input className="admin-input" placeholder="Matn 2 (Masalan: Bo'lim)" value={special.stat2Label||""} onChange={e=>handleUpdate("stat2Label",e.target.value)} style={{flex:2, padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff'}}/>
          </div>
          <div style={{display:'flex', gap:'10px', marginTop: 10}}>
            <input className="admin-input" placeholder="Raqam 3 (Masalan: 2)" value={special.stat3Num||""} onChange={e=>handleUpdate("stat3Num",e.target.value)} style={{flex:1, padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff'}}/>
            <input className="admin-input" placeholder="Matn 3 (Masalan: Til)" value={special.stat3Label||""} onChange={e=>handleUpdate("stat3Label",e.target.value)} style={{flex:2, padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff'}}/>
          </div>
          <div style={{display:'flex', gap:'10px', marginTop: 10}}>
            <input className="admin-input" placeholder="Raqam 4 (Masalan: 100+)" value={special.stat4Num||""} onChange={e=>handleUpdate("stat4Num",e.target.value)} style={{flex:1, padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff'}}/>
            <input className="admin-input" placeholder="Matn 4 (Masalan: Maqola)" value={special.stat4Label||""} onChange={e=>handleUpdate("stat4Label",e.target.value)} style={{flex:2, padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff'}}/>
          </div>
        </div>
      </div>
      <div className="admin-form-actions" style={{marginTop: 20}}>
        <button className="admin-btn primary" onClick={saveSettings} style={{padding: '10px 20px', borderRadius: '6px', background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold'}}>
          <span className="icon">💾</span> Saqlash
        </button>
      </div>
    </div>
  );
}

function AdminPanel(`;

code = code.replace('function AdminPanel(', adminSpecialCode);

const sidebarInjection = [
  '          <button className={`admin-sidebar-btn ${activeTab === "settings" ? "active" : ""}`} onClick={() => setActiveTab("settings")}>',
  '            <span className="icon">⚙️</span>',
  '            <span className="text">Sozlamalar</span>',
  '          </button>',
  '          <button className={`admin-sidebar-btn ${activeTab === "special" ? "active" : ""}`} onClick={() => setActiveTab("special")}>',
  '            <span className="icon">⭐</span>',
  '            <span className="text">Maxsus loyiha</span>',
  '          </button>'
].join('\\n');

code = code.replace(
  '<button className={`admin-sidebar-btn ${activeTab === "settings" ? "active" : ""}`} onClick={() => setActiveTab("settings")}>\\n            <span className="icon">⚙️</span>\\n            <span className="text">Sozlamalar</span>\\n          </button>',
  sidebarInjection
);
// Above regex with \\n might fail if whitespace differs, let's use a simpler replace
code = code.replace(
  '<button className={`admin-sidebar-btn ${activeTab === "settings" ? "active" : ""}`} onClick={() => setActiveTab("settings")}>',
  sidebarInjection.split('\\n')[0] + '\\n            <span className="icon">⚙️</span>\\n            <span className="text">Sozlamalar</span>\\n          </button>\\n          <button className={`admin-sidebar-btn ${activeTab === "special" ? "active" : ""}`} onClick={() => setActiveTab("special")}>\\n            <span className="icon">⭐</span>\\n            <span className="text">Maxsus loyiha</span>\\n          </button>'
);


const mainAreaInjection = '{activeTab === "settings" && <AdminSettings isUz={isUz} settings={settings} setSettings={setSettings} saveSettings={handleSettingsSave} />}\\n          {activeTab === "special" && <AdminSpecial isUz={isUz} settings={settings} setSettings={setSettings} saveSettings={handleSettingsSave} />}';

code = code.replace(
  '{activeTab === "settings" && <AdminSettings isUz={isUz} settings={settings} setSettings={setSettings} saveSettings={handleSettingsSave} />}',
  mainAreaInjection
);

fs.writeFileSync('app.jsx', code, 'utf8');
console.log('Script completed');
