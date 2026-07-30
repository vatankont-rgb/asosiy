const fs = require('fs');

const codeToInsert = `
function AdminSeoAudit({ allStories }) {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const stories = React.useMemo(() => {
    return Object.values(allStories).flat();
  }, [allStories]);

  const stats = React.useMemo(() => {
    let total = stories.length;
    let missingImages = 0;
    let shortTitles = 0;
    let shortExcerpts = 0;
    let shortBody = 0;

    const latestStories = [...stories].sort((a, b) => new Date(b.time || b.createdAt) - new Date(a.time || a.createdAt)).slice(0, 10);

    const evaluatedStories = latestStories.map(s => {
      const hasImg = !!s.image;
      const hasGoodTitle = s.title && s.title.length >= 10;
      const hasGoodExcerpt = s.summary && s.summary.length >= 10;
      const bodyLen = s.body ? s.body.trim().replace(/<[^>]+>/g, '').length : 0;
      const hasGoodBody = bodyLen > 100;
      
      const score = [hasImg, hasGoodTitle, hasGoodExcerpt, hasGoodBody].filter(Boolean).length;
      return {
        ...s,
        hasImg, hasGoodTitle, hasGoodExcerpt, hasGoodBody,
        status: score >= 3 ? "A'LO" : "YAXSHILASH KERAK"
      };
    });

    stories.forEach(s => {
      if (!s.image) missingImages++;
      if (!s.title || s.title.length < 10) shortTitles++;
      if (!s.summary || s.summary.length < 10) shortExcerpts++;
      const bLen = s.body ? s.body.trim().replace(/<[^>]+>/g, '').length : 0;
      if (bLen < 100) shortBody++;
    });

    const perfectScore = total * 4;
    const currentScore = perfectScore - (missingImages + shortTitles + shortExcerpts + shortBody);
    const healthPercent = total > 0 ? Math.round((currentScore / perfectScore) * 100) : 0;

    return { total, missingImages, shortTitles, shortExcerpts, shortBody, healthPercent, evaluatedStories };
  }, [stories]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const getHealthColor = (p) => p > 80 ? "#10b981" : p > 50 ? "#f97316" : "#ef4444";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", animation: "fadeIn 0.4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: "800", color: "var(--ink)", margin: 0 }}>SEO Audit & Tahlil</h2>
          <p style={{ fontSize: "14px", color: "var(--muted)", margin: "4px 0 0 0" }}>Qidiruv tizimlari uchun optimallashtirish holati</p>
        </div>
        <button 
          onClick={handleRefresh}
          style={{ padding: "10px 20px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s", opacity: isRefreshing ? 0.7 : 1 }}
        >
          {isRefreshing ? "⏳ Yangilanmoqda..." : "🔍 Auditni yangilash"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
        <div style={{ background: "var(--surface)", padding: "32px", borderRadius: "16px", border: "1px solid var(--line)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "120px", height: "120px", borderRadius: "50%", background: \`conic-gradient(\${getHealthColor(stats.healthPercent)} \${stats.healthPercent}%, #f1f5f9 0)\`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
            <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "28px", fontWeight: "900", color: "var(--ink)" }}>{stats.healthPercent}%</span>
            </div>
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: "800", margin: 0 }}>SEO Salomatlik</h3>
          <p style={{ fontSize: "13px", color: "var(--muted)", margin: "4px 0 0 0" }}>O'rta daraja • Jami: {stats.total} ta maqola</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: "700", color: "var(--ink)" }}>Sarlavhalar to'liq</span>
            <span style={{ fontSize: "12px", fontWeight: "800", color: stats.shortTitles > 0 ? "#f97316" : "#10b981", textTransform: "uppercase" }}>{stats.shortTitles > 0 ? \`\${stats.shortTitles} TA MUAMMO\` : "A'LO"}</span>
          </div>
          <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: "700", color: "var(--ink)" }}>Qisqacha mazmun</span>
            <span style={{ fontSize: "12px", fontWeight: "800", color: stats.shortExcerpts > 0 ? "#f97316" : "#10b981", textTransform: "uppercase" }}>{stats.shortExcerpts > 0 ? \`\${stats.shortExcerpts} TA YO'Q\` : "A'LO"}</span>
          </div>
          <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: "700", color: "var(--ink)" }}>Asosiy rasmlar</span>
            <span style={{ fontSize: "12px", fontWeight: "800", color: stats.missingImages > 0 ? "#ef4444" : "#10b981", textTransform: "uppercase" }}>{stats.missingImages > 0 ? \`\${stats.missingImages} TA YO'Q\` : "A'LO"}</span>
          </div>
          <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: "700", color: "var(--ink)" }}>Maqola matni</span>
            <span style={{ fontSize: "12px", fontWeight: "800", color: stats.shortBody > 0 ? "#f97316" : "#10b981", textTransform: "uppercase" }}>{stats.shortBody > 0 ? \`\${stats.shortBody} TA QISQA\` : "YAXSHI"}</span>
          </div>
        </div>
      </div>

      <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "16px", border: "1px solid var(--line)" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "800", color: "var(--ink)", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#f97316" }}>ℹ️</span> SEO Muammolar ({(stats.shortTitles>0?1:0) + (stats.shortExcerpts>0?1:0) + (stats.missingImages>0?1:0) + (stats.shortBody>0?1:0)})
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {stats.shortTitles > 0 && (
            <div style={{ padding: "16px", background: "rgba(239, 68, 68, 0.05)", borderRadius: "8px", border: "1px solid rgba(239, 68, 68, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ color: "#ef4444" }}>⚠️</span>
                <span style={{ fontSize: "14px", color: "var(--ink)", fontWeight: "500" }}>{stats.shortTitles} ta maqolada sarlavha qisqa ({"<"}10 belgi)</span>
              </div>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#ef4444" }}>Yuqori</span>
            </div>
          )}
          {stats.shortExcerpts > 0 && (
            <div style={{ padding: "16px", background: "rgba(249, 115, 22, 0.05)", borderRadius: "8px", border: "1px solid rgba(249, 115, 22, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ color: "#f97316" }}>❕</span>
                <span style={{ fontSize: "14px", color: "var(--ink)", fontWeight: "500" }}>{stats.shortExcerpts} ta maqolada qisqacha mazmun yo'q yoki qisqa</span>
              </div>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#f97316" }}>O'rta</span>
            </div>
          )}
          {stats.missingImages > 0 && (
            <div style={{ padding: "16px", background: "rgba(239, 68, 68, 0.05)", borderRadius: "8px", border: "1px solid rgba(239, 68, 68, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ color: "#ef4444" }}>⚠️</span>
                <span style={{ fontSize: "14px", color: "var(--ink)", fontWeight: "500" }}>{stats.missingImages} ta maqolada asosiy rasm yuklanmagan</span>
              </div>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#ef4444" }}>Yuqori</span>
            </div>
          )}
          {stats.shortBody > 0 && (
            <div style={{ padding: "16px", background: "rgba(249, 115, 22, 0.05)", borderRadius: "8px", border: "1px solid rgba(249, 115, 22, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ color: "#f97316" }}>❕</span>
                <span style={{ fontSize: "14px", color: "var(--ink)", fontWeight: "500" }}>{stats.shortBody} ta maqola matni juda qisqa</span>
              </div>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#f97316" }}>O'rta</span>
            </div>
          )}
          {stats.shortTitles === 0 && stats.shortExcerpts === 0 && stats.missingImages === 0 && stats.shortBody === 0 && (
            <div style={{ padding: "16px", background: "rgba(16, 185, 129, 0.05)", borderRadius: "8px", border: "1px solid rgba(16, 185, 129, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ color: "#10b981" }}>✅</span>
                <span style={{ fontSize: "14px", color: "var(--ink)", fontWeight: "500" }}>Hech qanday SEO muammosi topilmadi! Barchasi a'lo darajada.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ background: "var(--surface)", borderRadius: "16px", border: "1px solid var(--line)", overflow: "hidden" }}>
        <div style={{ padding: "24px", borderBottom: "1px solid var(--line)" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "800", color: "var(--ink)", margin: 0 }}>📄 Maqolalar SEO holati (oxirgi 10 ta)</h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px", minWidth: "700px" }}>
            <thead>
              <tr style={{ background: "var(--fill)", color: "var(--muted)", textTransform: "uppercase", fontSize: "11px", letterSpacing: "1px" }}>
                <th style={{ padding: "16px 24px", fontWeight: "800", borderBottom: "1px solid var(--line)" }}>Sarlavha</th>
                <th style={{ padding: "16px 24px", fontWeight: "800", borderBottom: "1px solid var(--line)" }}>Kategoriya</th>
                <th style={{ padding: "16px 24px", fontWeight: "800", borderBottom: "1px solid var(--line)" }}>Excerpt</th>
                <th style={{ padding: "16px 24px", fontWeight: "800", borderBottom: "1px solid var(--line)" }}>Rasm</th>
                <th style={{ padding: "16px 24px", fontWeight: "800", borderBottom: "1px solid var(--line)" }}>Holat</th>
              </tr>
            </thead>
            <tbody>
              {stats.evaluatedStories.map((s, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "16px 24px", fontWeight: "700", color: "var(--ink)", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title || "Sarlavhasiz"}</td>
                  <td style={{ padding: "16px 24px", color: "var(--muted)" }}>{s.category || "-"}</td>
                  <td style={{ padding: "16px 24px", color: s.hasGoodExcerpt ? "#10b981" : "#ef4444", fontWeight: "700" }}>{s.hasGoodExcerpt ? "✓ Bor" : "✗ Yo'q"}</td>
                  <td style={{ padding: "16px 24px", color: s.hasImg ? "#10b981" : "#ef4444", fontWeight: "700" }}>{s.hasImg ? "✓ Bor" : "✗ Yo'q"}</td>
                  <td style={{ padding: "16px 24px" }}>
                    <span style={{ fontSize: "10px", fontWeight: "800", padding: "4px 8px", borderRadius: "4px", background: s.status === "A'LO" ? "rgba(16, 185, 129, 0.1)" : "rgba(249, 115, 22, 0.1)", color: s.status === "A'LO" ? "#10b981" : "#f97316" }}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
              {stats.evaluatedStories.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "24px", textAlign: "center", color: "var(--muted)" }}>Maqolalar topilmadi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
`;

let content = fs.readFileSync('app.jsx', 'utf8');

const adminPanelIndex = content.indexOf('function AdminPanel(');
if (adminPanelIndex !== -1 && !content.includes('function AdminSeoAudit')) {
  content = content.slice(0, adminPanelIndex) + codeToInsert + content.slice(adminPanelIndex);
}

const mediaButtonStr = '>🖼️ Media Kutubxona</button>';
if (content.includes(mediaButtonStr) && !content.includes('onClick={() => setActiveTab("seo-audit")}')) {
  const seoAuditBtn = `

        <button 
          onClick={() => setActiveTab("seo-audit")} 
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", background: activeTab === "seo-audit" ? "rgba(195, 25, 50, 0.08)" : "transparent", color: activeTab === "seo-audit" ? "var(--brand)" : "var(--ink)", fontWeight: "700", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}
        >📈 SEO Audit</button>`;
        
  content = content.replace(mediaButtonStr, mediaButtonStr + seoAuditBtn);
}

const dashboardRenderStr = '{activeTab === "dashboard" && <AdminDashboard />}';
if (content.includes(dashboardRenderStr) && !content.includes('activeTab === "seo-audit"')) {
  const seoAuditRender = `
          {activeTab === "seo-audit" && <AdminSeoAudit allStories={allStories} />}`;
  content = content.replace(dashboardRenderStr, dashboardRenderStr + seoAuditRender);
}

fs.writeFileSync('app.jsx', content, 'utf8');
console.log('Successfully injected AdminSeoAudit into app.jsx');
