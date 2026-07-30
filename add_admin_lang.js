const fs = require('fs');
let txt = fs.readFileSync('app.jsx', 'utf8');

// 1. Update form initial state
txt = txt.replace(
  /const \[form, setForm\] = useState\(\{/,
  `const [form, setForm] = useState({\n    articleLang: lang === "en" ? "en" : lang === "uzk" ? "uzk" : "uz",`
);

// 2. Update handleSave
txt = txt.replace(
  /const langKey = lang === "en" \? "ru" : "uz";/g,
  'const langKey = form.articleLang || (lang === "en" ? "en" : lang === "uzk" ? "uzk" : "uz");'
);

// 3. Update setForm in handleSave
txt = txt.replace(
  /setForm\(\{\n\s*title: "",/,
  `setForm({\n          articleLang: lang === "en" ? "en" : lang === "uzk" ? "uzk" : "uz",\n          title: "",`
);

// 4. Update handleEdit
txt = txt.replace(
  /const handleEdit = \(story\) => \{\n\s*setEditingStory\(story\);\n\s*setForm\(\{/,
  `const handleEdit = (story) => {\n    setEditingStory(story);\n    setForm({\n      articleLang: lang === "en" ? "en" : lang === "uzk" ? "uzk" : "uz",`
);

// 5. Add Language select UI right before Title input
const titleInputHtml = `              {/* Title input */}`;
const languageSelectHtml = `              {/* Language selection */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "14px", fontWeight: "700" }}>Maqola tili (Language)</label>
                <select 
                  value={form.articleLang || "uz"} 
                  onChange={(e) => setForm({ ...form, articleLang: e.target.value })}
                  style={{ padding: "14px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)", fontSize: "16px", fontWeight: "700" }}
                >
                  <option value="uz">O'zbek (Lotin)</option>
                  <option value="uzk">Ўзбек (Кирилл)</option>
                  <option value="en">English</option>
                </select>
              </div>

              {/* Title input */}`;

txt = txt.replace(titleInputHtml, languageSelectHtml);

fs.writeFileSync('app.jsx', txt);
console.log('Admin language selection added.');
