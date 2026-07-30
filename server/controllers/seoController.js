const articleRepository = require('../repositories/articleRepository');

class SeoController {
  async getRss(req, res, next) {
    try {
      const isRu = req.path === '/rss-ru.xml';
      const lang = isRu ? 'ru' : 'uz';
      const db = await articleRepository.getAll();
      const items = (db[lang] || []).filter(s => s.status === 'published').slice(0, 20);

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Yangi Kun${isRu ? " (RU)" : ""}</title>
    <link>http://localhost:5173</link>
    <description>${isRu ? "Новости на русском языке" : "O'zbekcha yangiliklar"}</description>
    <language>${isRu ? "ru" : "uz"}</language>
    <atom:link href="http://localhost:5173${req.path}" rel="self" type="application/rss+xml"/>
    ${items.map(s => `<item>
      <title><![CDATA[${s.title}]]></title>
      <description><![CDATA[${s.summary}]]></description>
      <link>http://localhost:5173/?story=${s.id}</link>
      <guid>http://localhost:5173/?story=${s.id}</guid>
      <pubDate>${new Date(s.createdAt || Date.now()).toUTCString()}</pubDate>
      <category>${s.category}</category>
      ${s.image ? `<enclosure url="${s.image}" type="image/jpeg" length="0"/>` : ""}
    </item>`).join("\n    ")}
  </channel>
</rss>`;

      res.header('Content-Type', 'application/rss+xml; charset=utf-8');
      return res.status(200).send(xml);
    } catch (err) {
      next(err);
    }
  }

  async getSitemap(req, res, next) {
    try {
      const db = await articleRepository.getAll();
      const uzStories = (db.uz || []).filter(s => s.status === 'published');
      const ruStories = (db.ru || []).filter(s => s.status === 'published');
      const allStories = [...uzStories, ...ruStories];

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>http://localhost:5173/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${allStories.map(s => `  <url>
    <loc>http://localhost:5173/?story=${s.id}</loc>
    <lastmod>${new Date(s.updatedAt || s.createdAt || Date.now()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

      res.header('Content-Type', 'application/xml; charset=utf-8');
      return res.status(200).send(sitemap);
    } catch (err) {
      next(err);
    }
  }

  async getRobots(req, res, next) {
    try {
      const txt = `User-agent: *
Allow: /
Disallow: /api/admin/
Sitemap: http://localhost:5173/sitemap.xml
`;
      res.header('Content-Type', 'text/plain; charset=utf-8');
      return res.status(200).send(txt);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SeoController();
