const fs = require('fs');
let txt = fs.readFileSync('app.jsx', 'utf8');

const tabsReplacement = `onClick={() => setActiveTab("articles")}
                  style={{ width: "100%", padding: "12px 16px", background: activeTab === "articles" ? "var(--accent)" : "transparent", color: activeTab === "articles" ? "#fff" : "var(--ink)", border: "none", borderRadius: "8px", textAlign: "left", cursor: "pointer", fontWeight: "600", fontSize: "15px", transition: "all 0.2s" }}
                >
                  📄 Maqolalar
                </button>
                <button 
                  onClick={() => setActiveTab("categories")}
                  style={{ width: "100%", padding: "12px 16px", background: activeTab === "categories" ? "var(--accent)" : "transparent", color: activeTab === "categories" ? "#fff" : "var(--ink)", border: "none", borderRadius: "8px", textAlign: "left", cursor: "pointer", fontWeight: "600", fontSize: "15px", transition: "all 0.2s" }}
                >
                  📁 Ruknlar
                </button>
                <button 
                  onClick={() => setActiveTab("languages")}
                  style={{ width: "100%", padding: "12px 16px", background: activeTab === "languages" ? "var(--accent)" : "transparent", color: activeTab === "languages" ? "#fff" : "var(--ink)", border: "none", borderRadius: "8px", textAlign: "left", cursor: "pointer", fontWeight: "600", fontSize: "15px", transition: "all 0.2s" }}
                >
                  🌐 Tillar
                </button>`;

txt = txt.replace(
  /onClick=\{\(\) => setActiveTab\("articles"\)\}\n\s*style=\{\{ width: "100%", padding: "12px 16px", background: activeTab === "articles" \? "var\(--accent\)" : "transparent", color: activeTab === "articles" \? "#fff" : "var\(--ink\)", border: "none", borderRadius: "8px", textAlign: "left", cursor: "pointer", fontWeight: "600", fontSize: "15px", transition: "all 0\.2s" \}\}\n\s*>\n\s*📄 Maqolalar\n\s*<\/button>/,
  tabsReplacement
);

fs.writeFileSync('app.jsx', txt);
console.log('Sidebar tabs added.');
