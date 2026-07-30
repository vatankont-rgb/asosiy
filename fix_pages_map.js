const fs = require('fs');
let txt = fs.readFileSync('app.jsx', 'utf8');

// Fix drawer map
txt = txt.replace(
  /\{pages\.map\(\(item\) => \(\n\s*<button\n\s*key=\{item\}\n\s*className=\{\`drawer-link \$\{page === item \? "active" : ""\}\`\}\n\s*onClick=\{\(\) => \{\n\s*setPage\(item\);/g,
  `{pages.map((item) => (
            <button
              key={item.slug}
              className={\`drawer-link \${page === item.slug ? "active" : ""}\`}
              onClick={() => {
                setPage(item.slug);`
);

txt = txt.replace(
  /\{item\}\n\s*<\/button>\n\s*\)\)\}/g,
  `{item.name}
            </button>
          ))}`
);

// Fix footer map
txt = txt.replace(
  /\{pages\.map\(\(item\) => \(\n\s*<button key=\{item\} onClick=\{\(\) => setPage\(item\)\}>\n\s*\{item\}\n\s*<\/button>\n\s*\)\)\}/g,
  `{pages.map((item) => (
              <button key={item.slug} onClick={() => setPage(item.slug)}>
                {item.name}
              </button>
            ))}`
);

// Fix pages[0] usages
txt = txt.replace(/setPage\(pages\[0\]\)/g, `setPage("home")`);
txt = txt.replace(/page === pages\[0\]/g, `page === "home"`);
txt = txt.replace(/page !== pages\[0\]/g, `page !== "home"`);
txt = txt.replace(/\{page === "home" \? T\("Maqolalar"\) : page\}/g, `{page === "home" ? T("Maqolalar") : (pages.find(p => p.slug === page)?.name || page)}`);

fs.writeFileSync('app.jsx', txt);
console.log('Pages mapping fixed');
