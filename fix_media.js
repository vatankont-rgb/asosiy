const fs = require('fs');

let content = fs.readFileSync('app.jsx', 'utf8');

const target1 = `  const videos = safeItems.filter(([type]) => type === "video");
  const photos = safeItems.filter(([type]) => type === "photo");`;
const replacement1 = `  const videos = safeItems.filter((item) => item.type === "video");
  const photos = safeItems.filter((item) => item.type === "photo");`;
content = content.replace(target1, replacement1);

const target2 = `    const handleOpen = (item) => {
      if (!onOpen) return;
      const [t, itemTitle, meta, image] = item;
      onOpen({
        id: \`media-\${Date.now()}-\${Math.random()}\`,
        title: itemTitle,
        category: meta.split(' | ')[0] || type,
        time: meta.split(' | ')[1] || "",
        image: type === "video" ? null : image,
        body: type === "video" 
          ? \`<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; margin-bottom: 24px;">
               <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
             </div>
             <p>\${itemTitle} haqida batafsil ma'lumot...</p>\`
          : \`<p style="text-align:center; padding: 40px; background: #eee; border-radius: 12px; font-weight: bold; margin-bottom: 20px;">[ Fotogalereya Placeholder ]</p><p>\${itemTitle} haqida batafsil ma'lumot...</p>\`
      });
    };`;
const replacement2 = `    const handleOpen = (item) => {
      if (!onOpen) return;
      const { type, title: itemTitle, meta, url: image } = item;
      onOpen({
        id: \`media-\${Date.now()}-\${Math.random()}\`,
        title: itemTitle,
        category: meta ? meta.split(' | ')[0] : type,
        time: meta ? meta.split(' | ')[1] : "",
        image: type === "video" ? null : image,
        body: type === "video" 
          ? \`<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; margin-bottom: 24px;">
               <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
             </div>
             <p>\${itemTitle} haqida batafsil ma'lumot...</p>\`
          : \`<p style="text-align:center; padding: 40px; background: #eee; border-radius: 12px; font-weight: bold; margin-bottom: 20px;">[ Fotogalereya Placeholder ]</p><p>\${itemTitle} haqida batafsil ma'lumot...</p>\`
      });
    };`;
content = content.replace(target2, replacement2);

const target3 = `                <img src={featured[3]} alt="" />
                <div className="media-featured-overlay" />
                <span className={\`media-featured-icon video\`}>▶</span>
                <div className="media-featured-meta">
                  <span className="media-type-badge video">{title}</span>
                  <span>{featured[2]}</span>
                </div>
              </div>
              <div className="media-featured-body">
                <strong>{featured[1]}</strong>`;
const replacement3 = `                <img src={featured.url} alt="" />
                <div className="media-featured-overlay" />
                <span className={\`media-featured-icon video\`}>▶</span>
                <div className="media-featured-meta">
                  <span className="media-type-badge video">{title}</span>
                  <span>{featured.meta}</span>
                </div>
              </div>
              <div className="media-featured-body">
                <strong>{featured.title}</strong>`;
content = content.replace(target3, replacement3);

const target4 = `              {rest.map((item, idx) => {
                const [t, itemTitle, meta, image] = item;
                return (
                <article className="media-list-item" key={idx}>
                  <button onClick={() => handleOpen(item)}>
                    <span className="media-list-thumb">
                      <img src={image} alt="" />
                      <span className="media-list-icon">▶</span>
                    </span>
                    <span className="media-list-content">
                      <strong>{itemTitle}</strong>
                      <span className="meta">{meta}</span>`;
const replacement4 = `              {rest.map((item, idx) => {
                const { title: itemTitle, meta, url: image } = item;
                return (
                <article className="media-list-item" key={idx}>
                  <button onClick={() => handleOpen(item)}>
                    <span className="media-list-thumb">
                      <img src={image} alt="" />
                      <span className="media-list-icon">▶</span>
                    </span>
                    <span className="media-list-content">
                      <strong>{itemTitle}</strong>
                      <span className="meta">{meta}</span>`;
content = content.replace(target4, replacement4);

const target5 = `            {blockItems.map((item, idx) => {
              const [t, itemTitle, meta, image] = item;
              return (
              <article className="media-photo-card" key={idx}>
                <button onClick={() => handleOpen(item)}>
                  <div className="media-photo-thumb">
                    <img src={image} alt="" />
                    <div className="media-photo-overlay" />
                    <span className="media-photo-icon">◉</span>
                    <span className="media-photo-meta">{meta}</span>
                  </div>
                  <div className="media-photo-body">
                    <strong>{itemTitle}</strong>`;
const replacement5 = `            {blockItems.map((item, idx) => {
              const { title: itemTitle, meta, url: image } = item;
              return (
              <article className="media-photo-card" key={idx}>
                <button onClick={() => handleOpen(item)}>
                  <div className="media-photo-thumb">
                    <img src={image} alt="" />
                    <div className="media-photo-overlay" />
                    <span className="media-photo-icon">◉</span>
                    <span className="media-photo-meta">{meta}</span>
                  </div>
                  <div className="media-photo-body">
                    <strong>{itemTitle}</strong>`;
content = content.replace(target5, replacement5);

fs.writeFileSync('app.jsx', content, 'utf8');
console.log('MediaSection updated!');
