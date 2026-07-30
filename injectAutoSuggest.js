const fs = require('fs');
let code = fs.readFileSync('app.jsx', 'utf8');

const autoSuggestBtn = `
                <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
                  <button type="button" onClick={() => {
                    const textToAnalyze = (form.title + " " + form.body).toLowerCase();
                    let suggestedTags = form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
                    let added = 0;
                    adminTags.forEach(t => {
                      if (textToAnalyze.includes(t.name.toLowerCase()) && !suggestedTags.includes(t.name)) {
                        suggestedTags.push(t.name);
                        added++;
                      }
                    });
                    if(added > 0) {
                      setForm({...form, tags: suggestedTags.join(", ")});
                    } else {
                      alert("Mos tag topilmadi!");
                    }
                  }} style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--brand)", background: "rgba(195, 25, 50, 0.1)", color: "var(--brand)", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}>
                    ✨ Mavzuga qarab teg qo'yish
                  </button>
                  {adminTags.length > 0 && adminTags.map(tag => {
                    const currentTags = form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
                    const isSelected = currentTags.includes(tag.name);
                    if(isSelected) return null;
                    return (
                      <button type="button" key={tag.id} onClick={() => {
                        const newTags = [...currentTags, tag.name].join(", ");
                        setForm({...form, tags: newTags});
                      }} style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--line)", background: "var(--surface)", color: "var(--text)", cursor: "pointer", fontSize: "13px" }}>
                        + {tag.name}
                      </button>
                    )
                  })}
                </div>
`;

if (!code.includes('Mavzuga qarab teg')) {
  code = code.replace(
    'placeholder="Yangi kalit so\'z yozib Enter bosing..."\n                  style={{ padding: "10px", borderRadius: "6px", border: "1px solid var(--line)", background: "var(--fill)", color: "var(--ink)" }}\n                />',
    'placeholder="Yangi kalit so\'z yozib Enter bosing..."\n                  style={{ padding: "10px", borderRadius: "6px", border: "1px solid var(--line)", background: "var(--fill)", color: "var(--ink)" }}\n                />\n' + autoSuggestBtn
  );
}

fs.writeFileSync('app.jsx', code);
console.log('AutoSuggest button added successfully!');
