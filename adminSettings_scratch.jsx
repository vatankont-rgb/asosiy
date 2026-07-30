function AdminSettings() {
  const [activeTab, setActiveTab] = React.useState("general");
  const [settings, setSettings] = React.useState({
    siteName: "",
    tagline: "",
    mainColor: "#1f2937",
    logoUrl: "",
    contact: {
      phone: "",
      email: "",
      address: ""
    },
    socialLinks: {
      telegram: "",
      facebook: "",
      instagram: "",
      youtube: ""
    }
  });
  const [loading, setLoading] = React.useState(true);
  const importFileRef = React.useRef(null);

  React.useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/admin/settings", {
        headers: {
          'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
        }
      });
      const data = await res.json();
      if (data.data) {
        // Merge with defaults
        setSettings(prev => ({
          ...prev,
          ...data.data,
          contact: { ...prev.contact, ...(data.data.contact || {}) },
          socialLinks: { ...prev.socialLinks, ...(data.data.socialLinks || {}) }
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        alert("Sozlamalar saqlandi!");
      }
    } catch (err) {
      console.error(err);
      alert("Xatolik yuz berdi");
    }
  }

  async function exportData() {
    try {
      const res = await fetch("/api/admin/backup/export", {
        method: "POST",
        headers: { 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` }
      });
      const data = await res.json();
      if (data.data && data.data.content) {
        const blob = new Blob([JSON.stringify(data.data.content, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = data.data.filename;
        a.click();
      }
    } catch (err) {
      console.error(err);
      alert("Zaxiralashda xatolik");
    }
  }

  async function importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target.result);
        const res = await fetch("/api/admin/backup/import", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
          },
          body: JSON.stringify(json)
        });
        if (res.ok) alert("Ma'lumotlar tiklandi!");
      } catch (err) {
        console.error(err);
        alert("Faylni o'qishda xatolik");
      }
    };
    reader.readAsText(file);
  }

  async function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
          },
          body: JSON.stringify({ dataUrl: reader.result }),
        });
        const data = await res.json();
        if (data.url) {
          setSettings({ ...settings, logoUrl: data.url });
        }
      } catch(err) {
        console.error(err);
      }
    };
    reader.readAsDataURL(file);
  }

  const tabs = [
    { id: "general", label: "⚙️ Умумий ва Дизайн" },
    { id: "integration", label: "🤖 Интеграция" },
    { id: "seo", label: "🔍 SEO & Медиа" },
    { id: "system", label: "🛡 Хавфсизлик & Тизим" },
  ];

  if (loading) return <div>Yuklanmoqda...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "var(--ink)", margin: "0 0 8px 0" }}>Созламалар</h2>
        <p style={{ color: "var(--muted)", margin: 0 }}>Сайтнинг глобал параметрлари ва хавфсизлик</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "24px", borderBottom: "1px solid var(--line)" }}>
        {tabs.map(t => (
          <button 
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{ 
              background: "transparent", 
              border: "none", 
              borderBottom: activeTab === t.id ? "2px solid var(--brand)" : "2px solid transparent",
              padding: "12px 0",
              color: activeTab === t.id ? "var(--brand)" : "var(--muted)",
              fontWeight: activeTab === t.id ? "700" : "500",
              cursor: "pointer",
              fontSize: "15px"
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ background: "var(--surface)", padding: "32px", borderRadius: "12px", border: "1px solid var(--line)" }}>
        {activeTab === "general" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", background: "var(--fill)", padding: "24px", borderRadius: "8px", border: "1px solid var(--line)" }}>
              {/* Design */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", borderRight: "1px solid var(--line)", paddingRight: "32px" }}>
                <h4 style={{ margin: 0, fontWeight: "700", color: "var(--ink)", display: "flex", alignItems: "center", gap: "8px" }}>🎨 Дизайн (Ранглар палитраси)</h4>
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <input 
                    type="color" 
                    value={settings.mainColor || "#1f2937"}
                    onChange={(e) => setSettings({...settings, mainColor: e.target.value})}
                    style={{ width: "48px", height: "48px", padding: 0, border: "none", borderRadius: "4px", cursor: "pointer", outline: "none" }}
                  />
                  <div>
                    <div style={{ fontWeight: "700", color: "var(--ink)", fontSize: "15px" }}>Асосий ранг</div>
                    <div style={{ color: "var(--muted)", fontSize: "13px" }}>Сайтнинг менюлари ва асосий тугмалари учун.</div>
                  </div>
                </div>
              </div>
              {/* Logo */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h4 style={{ margin: 0, fontWeight: "700", color: "var(--ink)", display: "flex", alignItems: "center", gap: "8px" }}>🖼 Логотип</h4>
                <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                  <div style={{ width: "160px", height: "60px", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", padding: "8px" }}>
                    {settings.logoUrl ? <img src={settings.logoUrl} alt="Logo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} /> : <span style={{ color: "var(--muted)", fontSize: "24px", fontWeight: "700", fontFamily: "serif", letterSpacing: "2px" }}>VATAN</span>}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ padding: "8px 16px", background: "#fff", border: "1px solid var(--line)", borderRadius: "6px", fontSize: "14px", fontWeight: "600", color: "var(--ink)", cursor: "pointer", textAlign: "center" }}>
                      Лого юклаш
                      <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: "none" }} />
                    </label>
                    <button type="button" onClick={() => setSettings({...settings, logoUrl: ""})} style={{ padding: "8px 16px", background: "rgba(255, 0, 0, 0.05)", border: "1px solid rgba(255, 0, 0, 0.1)", borderRadius: "6px", fontSize: "14px", fontWeight: "600", color: "#e11d48", cursor: "pointer" }}>
                      Логони ўчириш
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "14px", fontWeight: "700", color: "var(--ink)" }}>Сайт номи</label>
                <input type="text" value={settings.siteName || ""} onChange={e => setSettings({...settings, siteName: e.target.value})} style={{ padding: "12px", border: "1px solid var(--line)", borderRadius: "6px", background: "#fff", color: "var(--ink)" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "14px", fontWeight: "700", color: "var(--ink)" }}>Шиори (Tagline)</label>
                <input type="text" value={settings.tagline || ""} onChange={e => setSettings({...settings, tagline: e.target.value})} style={{ padding: "12px", border: "1px solid var(--line)", borderRadius: "6px", background: "#fff", color: "var(--ink)" }} />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h4 style={{ margin: 0, fontWeight: "700", color: "var(--ink)", borderBottom: "1px solid var(--line)", paddingBottom: "12px" }}>Алоқа маълумотлари</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "14px", fontWeight: "700", color: "var(--ink)" }}>Телефон</label>
                  <input type="text" value={settings.contact?.phone || ""} onChange={e => setSettings({...settings, contact: {...settings.contact, phone: e.target.value}})} style={{ padding: "12px", border: "1px solid var(--line)", borderRadius: "6px", background: "#fff", color: "var(--ink)" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "14px", fontWeight: "700", color: "var(--ink)" }}>Email</label>
                  <input type="email" value={settings.contact?.email || ""} onChange={e => setSettings({...settings, contact: {...settings.contact, email: e.target.value}})} style={{ padding: "12px", border: "1px solid var(--line)", borderRadius: "6px", background: "#fff", color: "var(--ink)" }} />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "14px", fontWeight: "700", color: "var(--ink)" }}>Манзил</label>
                <input type="text" value={settings.contact?.address || ""} onChange={e => setSettings({...settings, contact: {...settings.contact, address: e.target.value}})} style={{ padding: "12px", border: "1px solid var(--line)", borderRadius: "6px", background: "#fff", color: "var(--ink)" }} />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h4 style={{ margin: 0, fontWeight: "700", color: "var(--ink)", borderBottom: "1px solid var(--line)", paddingBottom: "12px" }}>Ижтимоий тармоқлар</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "14px", fontWeight: "700", color: "var(--ink)" }}>Telegram</label>
                  <input type="text" value={settings.socialLinks?.telegram || ""} onChange={e => setSettings({...settings, socialLinks: {...settings.socialLinks, telegram: e.target.value}})} style={{ padding: "12px", border: "1px solid var(--line)", borderRadius: "6px", background: "#fff", color: "var(--ink)" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "14px", fontWeight: "700", color: "var(--ink)" }}>Facebook</label>
                  <input type="text" value={settings.socialLinks?.facebook || ""} onChange={e => setSettings({...settings, socialLinks: {...settings.socialLinks, facebook: e.target.value}})} style={{ padding: "12px", border: "1px solid var(--line)", borderRadius: "6px", background: "#fff", color: "var(--ink)" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "14px", fontWeight: "700", color: "var(--ink)" }}>Instagram</label>
                  <input type="text" value={settings.socialLinks?.instagram || ""} onChange={e => setSettings({...settings, socialLinks: {...settings.socialLinks, instagram: e.target.value}})} style={{ padding: "12px", border: "1px solid var(--line)", borderRadius: "6px", background: "#fff", color: "var(--ink)" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "14px", fontWeight: "700", color: "var(--ink)" }}>Youtube</label>
                  <input type="text" value={settings.socialLinks?.youtube || ""} onChange={e => setSettings({...settings, socialLinks: {...settings.socialLinks, youtube: e.target.value}})} style={{ padding: "12px", border: "1px solid var(--line)", borderRadius: "6px", background: "#fff", color: "var(--ink)" }} />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
              <button onClick={saveSettings} style={{ padding: "12px 32px", background: "#1e3a8a", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "700", cursor: "pointer", fontSize: "15px" }}>
                Сақлаш
              </button>
            </div>
          </div>
        )}

        {activeTab === "integration" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <h4 style={{ margin: 0, fontWeight: "700", color: "var(--ink)" }}>Интеграция созламалари</h4>
            <p style={{ color: "var(--muted)" }}>Tez orada... (Google Analytics, Yandex Metrika, reCAPTCHA va h.k.)</p>
          </div>
        )}

        {activeTab === "seo" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <h4 style={{ margin: 0, fontWeight: "700", color: "var(--ink)" }}>SEO ва Медиа параметрлари</h4>
            <p style={{ color: "var(--muted)" }}>Tez orada... (Default OG image, Meta kalit so'zlar, Sitemaps)</p>
          </div>
        )}

        {activeTab === "system" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Backups Controls */}
              <div style={{ background: "var(--fill)", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)", display: "flex", flexDirection: "column", gap: "16px" }}>
                <h4 style={{ fontWeight: "800", color: "var(--ink)", margin: 0 }}>💾 Ma'lumotlar zaxirasi</h4>
                <p style={{ fontSize: "14px", color: "var(--muted)", margin: 0 }}>Barcha maqolalar va sozlamalarni JSON fayl sifatida saqlab oling yoki tiklang.</p>
                
                <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                  <button type="button" onClick={exportData} style={{ padding: "10px 20px", background: "var(--brand)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>
                    📤 Zaxiralash (Export)
                  </button>
                  
                  <button type="button" onClick={() => importFileRef.current.click()} style={{ padding: "10px 20px", background: "transparent", color: "var(--ink)", border: "1px solid var(--line)", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>
                    📥 Tiklash (Import)
                  </button>
                  <input 
                    type="file" 
                    ref={importFileRef} 
                    onChange={importData} 
                    accept=".json" 
                    style={{ display: "none" }} 
                  />
                </div>
              </div>

              {/* SMTP Email Configurations */}
              <div style={{ background: "var(--fill)", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)", display: "flex", flexDirection: "column", gap: "16px" }}>
                <h4 style={{ fontWeight: "800", color: "var(--ink)", margin: 0 }}>📧 SMTP Sozlamalari</h4>
                <p style={{ fontSize: "14px", color: "var(--muted)", margin: 0 }}>Tizimda xabarnomalarni yuborish uchun SMTP sozlamalarini boshqaring.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
                  <input type="text" placeholder="smtp.mailtrap.io" style={{ padding: "12px", borderRadius: "6px", border: "1px solid var(--line)", background: "#fff", color: "var(--ink)" }} disabled />
                  <input type="text" placeholder="Port: 2525" style={{ padding: "12px", borderRadius: "6px", border: "1px solid var(--line)", background: "#fff", color: "var(--ink)" }} disabled />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
