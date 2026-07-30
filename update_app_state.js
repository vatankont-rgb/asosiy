const fs = require('fs');
let txt = fs.readFileSync('app.jsx', 'utf8');

// 1. Add state variables for languages and categories
txt = txt.replace(
  /const \[lang, setLang\] = useState\("uz"\);\n\s*const \[uiStrings, setUiStrings\] = useState\(\{([^}]*)\}\);/,
  `const [lang, setLang] = useState("uz");
  const [uiStrings, setUiStrings] = useState({});
  const [languages, setLanguages] = useState([]);
  const [categories, setCategories] = useState([]);`
);

// 2. Fetch languages and categories on mount
txt = txt.replace(
  /fetch\('\/api\/translations'\)\n\s*\.then\(res => res\.json\(\)\)\n\s*\.then\(data => \{\n\s*if \(data\.translations\) \{\n\s*setUiStrings\(data\.translations\);\n\s*\}\n\s*\}\)\n\s*\.catch\(console\.error\);/,
  `Promise.all([
      fetch('/api/translations').then(r => r.json()),
      fetch('/api/languages').then(r => r.json()),
      fetch('/api/categories').then(r => r.json())
    ]).then(([transData, langData, catData]) => {
      if (transData.translations) setUiStrings(transData.translations);
      if (langData.data) setLanguages(langData.data);
      if (catData.data) setCategories(catData.data);
    }).catch(console.error);`
);

// 3. Update top bar language selector
const oldLangSelector = `<div className="language-selector">
                    <button className={lang === "uz" ? "active" : ""} onClick={() => toggleLang("uz")}>Lotin</button>
                    <button className={lang === "uzk" ? "active" : ""} onClick={() => toggleLang("uzk")}>Кирилл</button>
                    <button className={lang === "en" ? "active" : ""} onClick={() => toggleLang("en")}>Eng</button>
                  </div>`;
const newLangSelector = `<div className="language-selector">
                    {languages.filter(l => l.isActive).map(l => (
                      <button key={l.id} className={lang === l.id ? "active" : ""} onClick={() => toggleLang(l.id)}>
                        {l.shortName}
                      </button>
                    ))}
                  </div>`;
txt = txt.replace(oldLangSelector, newLangSelector);

// 4. Pass languages and categories to AdminPanel
txt = txt.replace(
  /<AdminPanel \n\s*lang=\{lang\}\n\s*setLang=\{setLang\}/,
  `<AdminPanel \n                lang={lang}\n                setLang={setLang}\n                languages={languages}\n                categories={categories}\n                setLanguages={setLanguages}\n                setCategories={setCategories}`
);

fs.writeFileSync('app.jsx', txt);
console.log('App.jsx state updated.');
