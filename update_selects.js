const fs = require('fs');
let txt = fs.readFileSync('app.jsx', 'utf8');

// 1. Language selector in editor
const oldLangSelect = `<select 
                  value={form.articleLang || "uz"} 
                  onChange={(e) => {
                    const newLang = e.target.value;
                    let newCat = "Siyosat";
                    if (newLang === "en") newCat = "Politics";
                    if (newLang === "uzk") newCat = "Сиёсат";
                    setForm({ ...form, articleLang: newLang, category: newCat });
                  }}
                  style={{ padding: "14px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)", fontSize: "16px", fontWeight: "700" }}
                >
                  <option value="uz">O'zbek (Lotin)</option>
                  <option value="uzk">Ўзбек (Кирилл)</option>
                  <option value="en">English</option>
                </select>`;

const newLangSelect = `<select 
                  value={form.articleLang || "uz"} 
                  onChange={(e) => {
                    const newLang = e.target.value;
                    let newCat = "";
                    if(categories && categories.length > 0) {
                       newCat = categories[0].names[newLang] || categories[0].names["en"] || categories[0].slug;
                    }
                    setForm({ ...form, articleLang: newLang, category: newCat });
                  }}
                  style={{ padding: "14px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)", fontSize: "16px", fontWeight: "700" }}
                >
                  {languages.map(l => (
                     <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>`;

txt = txt.replace(oldLangSelect, newLangSelect);

// 2. Category selector in editor
const oldCatSelectRegex = /<select \n\s*value=\{form\.category\}[\s\S]*?<\/select>/;

const newCatSelect = `<select 
                    value={form.category} 
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)" }}
                  >
                    {categories.map(c => {
                       const catName = c.names[form.articleLang || "uz"] || c.names["en"] || c.slug;
                       return <option key={c.id} value={catName}>{catName}</option>;
                    })}
                  </select>`;

// Match only the second select (Category) in the form area
let parts = txt.split('label>Kategoriya</label>');
if(parts.length > 1) {
    let subParts = parts[1].split('</select>');
    subParts[0] = '\n                  ' + newCatSelect + '\n                ';
    parts[1] = subParts.join('');
    txt = parts.join('label>Kategoriya</label>');
}


// 3. Category selector in articles dashboard filter
const oldFilterCatRegex = /<select \n\s*value=\{selectedCategory\}[\s\S]*?<\/select>/;

const newFilterCat = `<select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)" }}
              >
                <option value="all">{isUz ? "Barcha ruknlar" : "All Categories"}</option>
                {categories.map(c => {
                   const catName = c.names[lang] || c.names["en"] || c.slug;
                   return <option key={c.id} value={catName}>{catName}</option>;
                })}
              </select>`;

// Find the first instance of selectedCategory
let filterParts = txt.split('value={selectedCategory}');
if(filterParts.length > 1) {
    // Look backwards to find <select
    let prefix = filterParts[0].substring(0, filterParts[0].lastIndexOf('<select'));
    let suffix = filterParts[1].substring(filterParts[1].indexOf('</select>') + 9);
    txt = prefix + newFilterCat + suffix;
}

fs.writeFileSync('app.jsx', txt);
console.log('Selects updated in app.jsx');
