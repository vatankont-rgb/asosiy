const fs = require('fs');
let txt = fs.readFileSync('app.jsx', 'utf8');

// 1. Remove categoryMap entirely (it's hardcoded and breaks dynamic categories)
txt = txt.replace(/const categoryMap = \{[\s\S]*?\};\n/, '');

// 2. Change page state initialization
txt = txt.replace(
  /const \[page, setPage\] = useState\(\n\s*window\.location\.hash === "#admin" \? "admin" : copy\.uz\.pages\[0\]\n\s*\);/,
  `const [page, setPage] = useState(window.location.hash === "#admin" ? "admin" : "home");`
);

// 3. Update 'pages' definition and 'selectedCategory'
txt = txt.replace(
  /const pages = t\.pages;\n\s*const selectedCategory = \(categoryMap\[lang\] \|\| categoryMap\.uz\)\[page\] \?\? null;/,
  `const pages = [{ slug: 'home', name: t.home || 'Bosh sahifa' }, ...categories.map(c => ({ slug: c.slug, name: c.names[lang] || c.names["en"] || c.slug }))];
  const selectedCategory = page === 'home' || page === 'admin' ? null : (categories.find(c => c.slug === page)?.names[lang] || categories.find(c => c.slug === page)?.names["en"] || page);`
);

// 4. Update changeLang
txt = txt.replace(
  /const currentIndex = Math\.max\(0, pages\.indexOf\(page\)\);\n\s*const nextCopy = copy\[nextLang\] \|\| copy\.uz;\n\s*const nextPages = nextCopy\.pages \|\| copy\.uz\.pages;\n\s*setLang\(nextLang\);\n\s*setPage\(nextPages\[currentIndex\] \|\| nextPages\[0\]\);/,
  `setLang(nextLang);`
);

// 5. Update header navigation rendering
// We need to find the nav mapping. It's usually `t.pages.map(p => ...)` or `pages.map`
txt = txt.replace(
  /\{t\.pages\.map\(\(p, i\) => \(\n\s*<a \n\s*key=\{i\}\n\s*href=\{\`#\$\{i === 0 \? "" : p\}\`\}\n\s*onClick=\{([^}]*)\}\n\s*className=\{page === p \? "active" : ""\}\n\s*>\n\s*\{p\}\n\s*<\/a>\n\s*\)\)\}/,
  `{pages.map((p, i) => (
                    <a 
                      key={p.slug}
                      href={\`#\${p.slug === 'home' ? "" : p.slug}\`}
                      onClick={(e) => { e.preventDefault(); setPage(p.slug); setMenuOpen(false); window.history.pushState(null, '', \`#\${p.slug === 'home' ? "" : p.slug}\`); }}
                      className={page === p.slug ? "active" : ""}
                    >
                      {p.name}
                    </a>
                  ))}`
);

// 6. Update section titles that used t.pages[0]
txt = txt.replace(/\{t\.pages\[0\]\}/g, `{pages[0]?.name}`);
txt = txt.replace(/\{page === copy\.uz\.pages\[0\]/g, `{page === "home"`);

fs.writeFileSync('app.jsx', txt);
console.log('Pages and navigation routing updated.');
