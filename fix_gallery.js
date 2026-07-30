const fs = require('fs');
let code = fs.readFileSync('app.jsx', 'utf8');

// 1. Remove placeholder from MediaBlock
code = code.replace(
  /body: item\.body \|\| `<p style="text-align:center; padding: 40px; background: #eee; border-radius: 12px; font-weight: bold; margin-bottom: 20px;">\[ Fotogalereya Placeholder \]<\/p><p>\$\{itemTitle\} haqida batafsil ma'lumot\.\.\.<\/p>`/g,
  'body: item.body || ""'
);
// And also in the other MediaSection (line 1026)
code = code.replace(
  /body: `<p style="text-align:center; padding: 40px; background: #eee; border-radius: 12px; font-weight: bold; margin-bottom: 20px;">\[ Fotogalereya Placeholder \]<\/p><p>\$\{itemTitle\} haqida batafsil ma'lumot\.\.\.<\/p>`/g,
  'body: ""'
);

// Add images field to mapped items
code = code.replace(
  /summary: item\.meta,/g,
  'summary: item.meta,\n        images: item.images || (item.url ? [item.url] : []),'
);

// 2. AdminPhotos changes
// Initial state
code = code.replace(
  /const \[form, setForm\] = React\.useState\(\{ title: '', meta: '', url: '', body: '' \}\);/g,
  "const [form, setForm] = React.useState({ title: '', meta: '', url: '', images: [], body: '' });"
);

// Reset form
code = code.replace(
  /setForm\(\{ title: "", meta: "", url: "", body: "" \}\);/g,
  'setForm({ title: "", meta: "", url: "", images: [], body: "" });'
);
code = code.replace(
  /setForm\(\{title:"",meta:"",url:"",body:""\}\);/g,
  'setForm({title:"",meta:"",url:"",images:[],body:""});'
);

// populate on edit
code = code.replace(
  /setForm\(\{ title: p\.title \|\| "", meta: p\.meta \|\| "", url: p\.url, body: p\.body \|\| "" \}\);/g,
  'setForm({ title: p.title || "", meta: p.meta || "", url: p.url, images: p.images || (p.url ? [p.url] : []), body: p.body || "" });'
);

// Upload logic
const oldUploadLogic = `  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': \`Bearer \${document.cookie.replace(/(?:(?:^|.*;\\s*)yk_session\\s*\\=\\s*([^;]*).*$)|^.*$/, "$1")}\`
          },
          body: JSON.stringify({ dataUrl: ev.target.result })
        });
        if (res.ok) {
          const data = await res.json();
          setForm({ ...form, url: data.url });
        } else {
          const errData = await res.json().catch(() => ({}));
          alert("Xatolik: " + (errData.error || res.statusText));
        }
      } catch (err) {
        alert("Xatolik yuz berdi");
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };`;

const newUploadLogic = `  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    
    let currentUrls = [...(form.images || [])];
    if (form.url && currentUrls.length === 0) currentUrls.push(form.url);

    for (const file of files) {
      await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async (ev) => {
          try {
            const res = await fetch('/api/admin/upload', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${document.cookie.replace(/(?:(?:^|.*;\\s*)yk_session\\s*\\=\\s*([^;]*).*$)|^.*$/, "$1")}\`
              },
              body: JSON.stringify({ dataUrl: ev.target.result })
            });
            if (res.ok) {
              const data = await res.json();
              currentUrls.push(data.url);
            }
          } catch (err) {}
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    setForm(prev => ({ ...prev, images: currentUrls, url: currentUrls[0] || '' }));
    setUploading(false);
    e.target.value = '';
  };`;

code = code.replace(oldUploadLogic, newUploadLogic);

// File input UI
code = code.replace(
  /<input type="file" accept="image\/\*" onChange=\{handleUpload\} disabled=\{uploading\}/g,
  '<input type="file" accept="image/*" multiple onChange={handleUpload} disabled={uploading}'
);

// Preview UI
code = code.replace(
  /\{form\.url && <img src=\{form\.url\} alt="Preview".*?\/>\}/g,
  `{(form.images && form.images.length > 0) ? (
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "12px" }}>
                {form.images.map((img, i) => (
                  <div key={i} style={{ position: "relative", width: 100, height: 100 }}>
                    <img src={img} alt="Preview" style={{ width: "100%", height: "100%", borderRadius: 6, objectFit: "cover", border: "1px solid var(--line)" }} />
                    <button type="button" onClick={() => {
                        const newImages = form.images.filter((_, idx) => idx !== i);
                        setForm({...form, images: newImages, url: newImages[0] || ''});
                    }} style={{ position: "absolute", top: -8, right: -8, background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>&times;</button>
                  </div>
                ))}
              </div>
            ) : form.url && <img src={form.url} alt="Preview" style={{ height: 100, marginTop: 12, borderRadius: 6, objectFit: "cover", border: "1px solid var(--line)", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }} />}`
);

// 3. ArticlePage rendering
// Find the end of story.body rendering and add the gallery
const storyBodyMatch = `                ? <div dangerouslySetInnerHTML={{__html: story.body}} />
                : paragraphs.length > 1
                  ? paragraphs.map((para, i) => <p key={i}>{para}</p>)
                  : <p>{story.body || story.summary || (t.noDetails || "Batafsil ma'lumot mavjud emas.")}</p>
            }`;

const galleryAddon = `
            {/* Fotogalereya (Photo Gallery) */}
            {story.category === "photo" && story.images && story.images.length > 0 && (
              <div style={{ marginTop: "32px", borderTop: "1px solid var(--line)", paddingTop: "24px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px", color: "var(--ink)" }}>
                  {lang === "en" ? "Photo Gallery" : "Fotogalereya"}
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "16px" }}>
                  {story.images.map((img, i) => (
                    <img key={i} src={img} alt={\`Gallery \${i+1}\`} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }} />
                  ))}
                </div>
              </div>
            )}`;

code = code.replace(storyBodyMatch, storyBodyMatch + galleryAddon);

fs.writeFileSync('app.jsx', code);
console.log('Fixed app.jsx for photo gallery support');
