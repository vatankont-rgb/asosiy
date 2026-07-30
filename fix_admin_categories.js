const fs = require('fs');
const file = 'app.jsx';
let txt = fs.readFileSync(file, 'utf8');

const oldLangSelect = `onChange={(e) => setForm({ ...form, articleLang: e.target.value })}`;
const newLangSelect = `onChange={(e) => {
                    const newLang = e.target.value;
                    let newCat = "Siyosat";
                    if (newLang === "en") newCat = "Politics";
                    if (newLang === "uzk") newCat = "Сиёсат";
                    setForm({ ...form, articleLang: newLang, category: newCat });
                  }}`;

txt = txt.replace(oldLangSelect, newLangSelect);

const oldCatSelect = `<select 
                    value={form.category} 
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)" }}
                  >
                    <option value="Siyosat">{isUz ? "Siyosat" : "Politics"}</option>
                    <option value="Iqtisodiyot">{isUz ? "Iqtisodiyot" : "Economy"}</option>
                    <option value="Tarix">{isUz ? "Tarix" : "History"}</option>
                    <option value="Falsafa">{isUz ? "Falsafa" : "Philosophy"}</option>
                    <option value="Adabiyot">{isUz ? "Adabiyot" : "Literature"}</option>
                  </select>`;

const newCatSelect = `<select 
                    value={form.category} 
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)" }}
                  >
                    {form.articleLang === "en" ? (
                      <>
                        <option value="Politics">Politics</option>
                        <option value="Economy">Economy</option>
                        <option value="History">History</option>
                        <option value="Philosophy">Philosophy</option>
                        <option value="Literature">Literature</option>
                      </>
                    ) : form.articleLang === "uzk" ? (
                      <>
                        <option value="Сиёсат">Сиёсат</option>
                        <option value="Иқтисодиёт">Иқтисодиёт</option>
                        <option value="Тарих">Тарих</option>
                        <option value="Фалсафа">Фалсафа</option>
                        <option value="Адабиёт">Адабиёт</option>
                      </>
                    ) : (
                      <>
                        <option value="Siyosat">Siyosat</option>
                        <option value="Iqtisodiyot">Iqtisodiyot</option>
                        <option value="Tarix">Tarix</option>
                        <option value="Falsafa">Falsafa</option>
                        <option value="Adabiyot">Adabiyot</option>
                      </>
                    )}
                  </select>`;

txt = txt.replace(oldCatSelect, newCatSelect);

fs.writeFileSync(file, txt);
console.log('Category dropdown logic updated.');
