const articleRepository = require('../repositories/articleRepository');
const categoryRepository = require('../repositories/categoryRepository');
const settingRepository = require('../repositories/settingRepository');

class SeoController {
  constructor() {
    this.getRss = this.getRss.bind(this);
    this.getSitemap = this.getSitemap.bind(this);
    this.getRobots = this.getRobots.bind(this);
    this.getBaseUrl = this.getBaseUrl.bind(this);
  }

  getBaseUrl(req) {
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'vatanuz.uz';
    const proto = req.headers['x-forwarded-proto'] || (req.secure ? 'https' : 'http');
    return `${proto === 'http' && host.includes('vatanuz.uz') ? 'https' : proto}://${host}`;
  }

  async getRss(req, res, next) {
    try {
      const baseUrl = this.getBaseUrl(req);
      const isEn = req.path.includes('-en');
      const isUzk = req.path.includes('-uzk') || !isEn;
      const lang = isEn ? 'en' : (req.path.includes('-uz') ? 'uz' : 'uzk');
      
      const db = await articleRepository.getAll();
      const items = (db[lang] || db.uzk || db.uz || [])
        .filter(s => s && s.status === 'published')
        .slice(0, 30);

      const title = "Vatanuz.uz — Milliy axborot portali";
      const desc = "O'zbekiston va jahon yangiliklari, tahliliy maqolalar, madaniyat va jamiyat.";

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title><![CDATA[${title}]]></title>
    <link>${baseUrl}/</link>
    <description><![CDATA[${desc}]]></description>
    <language>${lang === 'uzk' ? 'uz-Cyrl' : (lang === 'en' ? 'en' : 'uz-Latn')}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}${req.path}" rel="self" type="application/rss+xml"/>
    ${items.map(s => {
      const link = `${baseUrl}/p/${encodeURIComponent(s.numId || s.id)}`;
      const pubDate = new Date(s.createdAt || Date.now()).toUTCString();
      const rawSummary = s.summary || (s.body ? String(s.body).replace(/<[^>]*>?/gm, '').slice(0, 250) : '');
      const imageUrl = s.image ? (s.image.startsWith('http') ? s.image : `${baseUrl}${s.image.startsWith('/') ? '' : '/'}${s.image}`) : '';
      return `<item>
      <title><![CDATA[${s.title}]]></title>
      <description><![CDATA[${rawSummary}]]></description>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[${s.category || 'Yangiliklar'}]]></category>
      <dc:creator><![CDATA[${s.author || 'Vatanuz.uz'}]]></dc:creator>
      ${imageUrl ? `<enclosure url="${imageUrl}" type="image/jpeg" length="0"/>` : ""}
    </item>`;
    }).join("\n    ")}
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
      const baseUrl = this.getBaseUrl(req);
      const db = await articleRepository.getAll();
      
      const seenIds = new Set();
      const allStories = [];

      ['uzk', 'uz', 'en'].forEach(lang => {
        (db[lang] || []).forEach(s => {
          if (s && s.status === 'published' && s.id && !seenIds.has(s.id)) {
            seenIds.add(s.id);
            allStories.push(s);
          }
        });
      });

      // Categories
      const categories = ['Siyosat', 'Iqtisodiyot', 'Jamiyat', 'Madaniyat', 'Dunyo', 'Sport', 'Texnologiya', 'Tahlil'];

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>
  ${categories.map(cat => `  <url>
    <loc>${baseUrl}/?category=${encodeURIComponent(cat)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
  ${allStories.map(s => {
    const link = `${baseUrl}/p/${encodeURIComponent(s.numId || s.id)}`;
    const lastMod = new Date(s.updatedAt || s.createdAt || Date.now()).toISOString();
    const imageUrl = s.image ? (s.image.startsWith('http') ? s.image : `${baseUrl}${s.image.startsWith('/') ? '' : '/'}${s.image}`) : '';
    const safeTitle = String(s.title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `  <url>
    <loc>${link}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    ${imageUrl ? `<image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${safeTitle}</image:title>
    </image:image>` : ''}
  </url>`;
  }).join('\n')}
</urlset>`;

      res.header('Content-Type', 'application/xml; charset=utf-8');
      return res.status(200).send(sitemap);
    } catch (err) {
      next(err);
    }
  }

  async getRobots(req, res, next) {
    try {
      const baseUrl = this.getBaseUrl(req);
      const txt = `User-agent: *
Allow: /
Disallow: /api/admin/
Disallow: /api/users/

User-agent: Googlebot
Allow: /
Disallow: /api/admin/

User-agent: Googlebot-News
Allow: /

User-agent: Googlebot-Image
Allow: /

User-agent: Mediapartners-Google
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Yandex
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/rss.xml
`;
      res.header('Content-Type', 'text/plain; charset=utf-8');
      return res.status(200).send(txt);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SeoController();
