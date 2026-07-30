const fs = require('fs');

let code = fs.readFileSync('app.jsx', 'utf8');

const startMarker = '{/* Tab 3: Text Editor and Live SEO Optimizer */}';
const endMarker = '{/* Tab: Comments */}';

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error("Markers not found");
  process.exit(1);
}

const newEditorBlock = `{/* Tab 3: Text Editor and Live SEO Optimizer */}
        {activeTab === "editor" && (
          <form onSubmit={handleSave} className="adm-2col-layout">
            
            {/* Main Column (Left) */}
            <div className="adm-col-main" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div className="adm-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h2 style={{ fontSize: "20px", fontWeight: "800", color: "var(--ink)", margin: 0 }}>
                    ✍️ {editingStory ? "Maqolani Tahrirlash" : "Yangi Maqola Qo'shish"}
                  </h2>
                  <button type="button" onClick={loadDraft} style={{ padding: "6px 12px", background: "var(--fill)", color: "var(--ink)", border: "1px solid var(--line)", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }}>
                    💾 Qoralamani tiklash
                  </button>
                </div>

                {/* Language selection */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                  <label className="adm-form-label">Maqola tili</label>
                  <select 
                    value={form.articleLang || "uzk"} 
                    onChange={(e) => {
                      const newLang = e.target.value;
                      let newCat = "";
                      if(categories && categories.length > 0) {
                         newCat = categories[0].names[newLang] || categories[0].names["en"] || categories[0].slug;
                      }
                      setForm({ ...form, articleLang: newLang, category: newCat });
                    }}
                    className="adm-form-input"
                  >
                    {languages.map(l => (
                       <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>

                {/* Title input */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                  <label className="adm-form-label">Sarlavha *</label>
                  <input 
                    type="text" 
                    value={form.title} 
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Maqola sarlavhasi..."
                    required
                    className="adm-form-input"
                    style={{ fontSize: "16px", fontWeight: "700" }}
                  />
                </div>

                {/* Summary / Lead */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                  <label className="adm-form-label">Qisqacha mazmun (Подзаголовок)</label>
                  <textarea 
                    rows="3" 
                    value={form.summary}
                    onChange={(e) => setForm({ ...form, summary: e.target.value })}
                    placeholder="Maqolaning qisqacha tavsifi..."
                    className="adm-form-input"
                    style={{ resize: "vertical" }}
                  />
                </div>

                {/* Main Body Editor */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label className="adm-form-label">Matn</label>
                  <RichEditor 
                    value={form.body}
                    onChange={(html) => setForm({ ...form, body: html })}
                  />
                  <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "var(--muted)", marginTop: "8px", fontWeight: "600" }}>
                    <span>📝 {form.body ? form.body.trim().split(/\\s+/).filter(Boolean).length : 0} ta so'z</span>
                    <span>🔤 {form.body ? form.body.length : 0} ta belgi</span>
                    <span>⏱️ ~{Math.ceil((form.body ? form.body.trim().split(/\\s+/).filter(Boolean).length : 0) / 200) || 1} daqiqa o'qish</span>
                  </div>
                </div>
              </div>

              {/* SEO Block */}
              <div className="adm-card">
                <h3 className="adm-card-header">SEO teglar va so'zlar</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                  <label className="adm-form-label">Focus Keyword (Asosiy so'z)</label>
                  <input 
                    type="text" 
                    value={form.focusKeyword}
                    onChange={(e) => setForm({ ...form, focusKeyword: e.target.value })}
                    placeholder="Masalan: eksport"
                    className="adm-form-input"
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label className="adm-form-label">Kalit so'zlar (Tags)</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                    {(form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : []).map((tag, i) => (
                      <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", background: "#f1f5f9", color: "var(--ink)", borderRadius: "16px", fontSize: "12px", fontWeight: "600", border: "1px solid var(--line)" }}>
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)} style={{ background: "transparent", border: "none", color: "var(--muted)", cursor: "pointer", fontWeight: "bold", padding: 0, fontSize: "14px" }}>&times;</button>
                      </span>
                    ))}
                  </div>
                  <input 
                    type="text" 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Yangi kalit so'z yozib Enter bosing..."
                    className="adm-form-input"
                  />
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
                      }
                    }} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "#f8fafc", color: "var(--ink)", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>
                      ✨ Avto taglash
                    </button>
                  </div>
                </div>

                {/* SEO Score Feedback */}
                <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--line)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: seoScore > 70 ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", display: "flex", justifyContent: "center", alignItems: "center", border: \`2px solid \${seoScore > 70 ? "#10b981" : "#ef4444"}\` }}>
                      <strong style={{ fontSize: "14px", color: seoScore > 70 ? "#10b981" : "#ef4444" }}>{seoScore}</strong>
                    </div>
                    <div>
                      <h4 style={{ fontWeight: "700", fontSize: "13px", color: "var(--ink)", margin: 0 }}>SEO Sifat</h4>
                      <p style={{ fontSize: "11px", color: "var(--muted)", margin: 0 }}>Real-vaqt hisob-kitobi</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {seoSuggestions.map((sug, idx) => (
                      <div key={idx} style={{ fontSize: "12px", color: "#ef4444", display: "flex", gap: "6px" }}>
                        <span>⚠️</span> <span>{sug}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cover Image Block */}
              <div className="adm-card">
                <h3 className="adm-card-header">Rasm Muqovasi (Cover Image)</h3>
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleImageUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  style={{ border: "2px dashed #cbd5e1", padding: "32px 20px", borderRadius: "8px", textAlign: "center", background: "#f8fafc", cursor: "pointer", transition: "0.2s" }}
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = (e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageUpload(e.target.files[0]);
                      }
                    };
                    input.click();
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = "#94a3b8"}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = "#cbd5e1"}
                >
                  {imageUploading ? (
                    <div style={{ color: "#3b82f6", fontWeight: "600", fontSize: "14px" }}>Yuklanmoqda...</div>
                  ) : form.image ? (
                    <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", display: "inline-block" }}>
                      <img src={form.image} alt="Cover preview" style={{ maxHeight: "120px", borderRadius: "6px", display: "block", margin: "0 auto", border: "1px solid var(--line)" }} />
                      <button type="button" onClick={() => setForm({...form, image: ""})} style={{ position: "absolute", top: -8, right: -8, background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>&times;</button>
                    </div>
                  ) : (
                    <div style={{ color: "var(--muted)", fontSize: "14px" }}>
                      <div style={{ fontSize: "24px", marginBottom: "8px" }}>📁</div>
                      <strong>Drop files here to upload</strong><br/>
                      <span style={{ fontSize: "12px" }}>Yoki yuklash uchun bosing</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Sidebar Column (Right) */}
            <div className="adm-col-side" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div className="adm-card">
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label className="adm-form-label">Kategoriya</label>
                    <select 
                      value={form.category} 
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="adm-form-input"
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
                    </select>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label className="adm-form-label">Video URL (ixtiyoriy)</label>
                    <input 
                      type="text" 
                      value={form.videoUrl || ""} 
                      onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                      placeholder="https://youtube.com/..."
                      className="adm-form-input"
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label className="adm-form-label">Ko'rishlar (Prosmotr)</label>
                    <input 
                      type="number" 
                      value={form.views || 0} 
                      onChange={(e) => setForm({ ...form, views: parseInt(e.target.value) || 0 })}
                      className="adm-form-input"
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label className="adm-form-label">Holati (Status)</label>
                    <select 
                      value={form.status || "published"} 
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="adm-form-input"
                    >
                      <option value="published">🟢 Darhol nashr qilish</option>
                      <option value="draft">🟡 Qoralama</option>
                    </select>
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label className="adm-form-label">Rejalashtirish (Vaqti)</label>
                    <input 
                      type="datetime-local" 
                      value={form.publishAt || ""}
                      onChange={(e) => setForm({ ...form, publishAt: e.target.value })}
                      className="adm-form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="adm-card">
                <h3 className="adm-card-header">Sozlamalar</h3>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className="adm-toggle-wrapper">
                    <span className="adm-toggle-label-text">Telegramga yuborish</span>
                    <label className="adm-toggle">
                      <input 
                        type="checkbox" 
                        checked={form.sendToTelegram || false}
                        onChange={(e) => setForm({ ...form, sendToTelegram: e.target.checked })}
                      />
                      <span className="adm-toggle-slider"></span>
                    </label>
                  </div>
                  
                  <div className="adm-toggle-wrapper">
                    <span className="adm-toggle-label-text">Push xabar (Breaking News)</span>
                    <label className="adm-toggle">
                      <input 
                        type="checkbox" 
                        checked={form.sendPushNotification || false}
                        onChange={(e) => setForm({ ...form, sendPushNotification: e.target.checked })}
                      />
                      <span className="adm-toggle-slider"></span>
                    </label>
                  </div>

                  <div className="adm-toggle-wrapper">
                    <span className="adm-toggle-label-text">Asosiy maqola (Featured)</span>
                    <label className="adm-toggle">
                      <input 
                        type="checkbox" 
                        checked={form.isFeatured || false}
                        onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                      />
                      <span className="adm-toggle-slider"></span>
                    </label>
                  </div>

                  <div className="adm-toggle-wrapper">
                    <span className="adm-toggle-label-text">Tahririyat tanlovi</span>
                    <label className="adm-toggle">
                      <input 
                        type="checkbox" 
                        checked={form.isEditorChoice || false}
                        onChange={(e) => setForm({ ...form, isEditorChoice: e.target.checked })}
                      />
                      <span className="adm-toggle-slider"></span>
                    </label>
                  </div>

                  <div className="adm-toggle-wrapper">
                    <span className="adm-toggle-label-text">Dolzarb xabar (Breaking)</span>
                    <label className="adm-toggle">
                      <input 
                        type="checkbox" 
                        checked={form.isBreaking || false}
                        onChange={(e) => setForm({ ...form, isBreaking: e.target.checked })}
                      />
                      <span className="adm-toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setActiveTab("articles")} style={{ padding: "12px 16px", background: "transparent", color: "var(--ink)", border: "1px solid var(--line)", borderRadius: "6px", fontWeight: "700", cursor: "pointer", flex: 1 }}>
                  Bekor qilish
                </button>
                <button type="submit" style={{ padding: "12px 16px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "700", cursor: "pointer", flex: 1, boxShadow: "0 2px 8px rgba(59, 130, 246, 0.4)" }}>
                  Сохранить (Saqlash)
                </button>
              </div>
              
              {editingStory && editingStory.history && editingStory.history.length > 0 && (
                  <div className="adm-card">
                    <h3 className="adm-card-header">⏳ Tarix</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {editingStory.history.map((hist, idx) => (
                        <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px", background: "var(--fill)", borderRadius: "6px" }}>
                          <span style={{ fontSize: "11px", color: "var(--muted)" }}>{new Date(hist.updatedAt).toLocaleString("uz-UZ")}</span>
                          <button 
                            type="button" 
                            onClick={() => {
                              if (confirm("Rostdan ham ushbu versiyaga qaytishni xohlaysizmi?")) {
                                setForm({ ...form, title: hist.title, summary: hist.summary, body: hist.body, image: hist.image, tags: hist.tags });
                              }
                            }}
                            style={{ padding: "4px 8px", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "4px", cursor: "pointer", fontSize: "11px", fontWeight: "bold" }}
                          >
                            Qaytarish
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
              )}
              
            </div>
          </form>
        )}

        \n\n`;

code = code.substring(0, startIndex) + newEditorBlock + code.substring(endIndex);

fs.writeFileSync('app.jsx', code);
console.log('Replaced AdminPanel form successfully.');
