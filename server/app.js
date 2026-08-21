const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const morgan = require('morgan');
const config = require('./config/config');
const { helmetConfig, corsConfig, rateLimiter } = require('./config/security');
const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const commentRoutes = require('./routes/commentRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const settingRoutes = require('./routes/settingRoutes');
const translationRoutes = require('./routes/translationRoutes');
const languageRoutes = require('./routes/languageRoutes');
const tagRoutes = require('./routes/tagRoutes');
const pageRoutes = require('./routes/pageRoutes');

const seoRoutes = require('./routes/seoRoutes');
const pushRoutes = require('./routes/pushRoutes');
const logRoutes = require('./routes/logRoutes');
const userRoutes = require('./routes/userRoutes');
const adRoutes = require('./routes/adRoutes');
const subscribeRoutes = require('./routes/subscribeRoutes');
const videoRoutes = require('./routes/videoRoutes');
const photoRoutes = require('./routes/photoRoutes');

const app = express();
app.set('trust proxy', 1);

// Global Middlewares
app.use(helmetConfig);
app.use(corsConfig);
app.use(rateLimiter);
app.use(cookieParser());
app.use(express.json({ limit: '12mb' })); // Support base64 image uploads up to 12mb
app.use(express.urlencoded({ extended: true, limit: '12mb' }));

if (config.env === 'development') {
  app.use(morgan('dev'));
}

// SEO static mapping at root level
app.use('/', seoRoutes);

// API Routers
app.use('/api', authRoutes);
app.use('/api', articleRoutes);
app.use('/api', categoryRoutes);
app.use('/api', commentRoutes);
app.use('/api/admin/users', userRoutes);
app.use('/api/admin/logs', logRoutes);
app.use('/api', mediaRoutes);
app.use('/api/admin', settingRoutes);
app.use('/api', translationRoutes);
app.use('/api', languageRoutes);
app.use('/api', tagRoutes);
app.use('/api', pageRoutes);
app.use('/api', adRoutes);
app.use('/api/push', pushRoutes);
app.use('/api/subscribe', subscribeRoutes);
app.use('/api', videoRoutes);
app.use('/api', photoRoutes);


// Block access to sensitive files and directories
app.use((req, res, next) => {
  const blocked = ['/server/', '/node_modules/', '/.env', '/.git', '/package.json', '/package-lock.json', '/change_pwd.js'];
  const lower = req.path.toLowerCase();
  if (blocked.some(b => lower.startsWith(b) || lower === b)) {
    return res.status(404).send('Not Found');
  }
  // Block all .js files except allowed ones
  if (lower.endsWith('.js') && !['sw.js', 'app.jsx'].some(a => lower.endsWith(a))) {
    return res.status(404).send('Not Found');
  }
  next();
});

// Static uploads serving
app.use('/uploads', express.static(config.uploadsDir));

// Static files serving (React application root) with caching
const rootDir = path.join(__dirname, '..');
app.use(express.static(rootDir, {
  dotfiles: 'deny',
  index: false, // Disable serving index.html automatically so dynamic SSR / OG tag handler processes all HTML routes
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('app.jsx') || filePath.endsWith('styles.css') || filePath.endsWith('sw.js')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  }
}));

const fs = require('fs');
const articleRepository = require('./repositories/articleRepository');
const settingRepository = require('./repositories/settingRepository');

// Google Site Verification file handler (serves only real uploaded verification files, 404 otherwise)
app.get('/google:code.html', (req, res) => {
  const code = req.params.code;
  const fileName = `google${code}.html`;
  const filePath = path.join(rootDir, fileName);
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }
  return res.status(404).send('Not Found');
});

// Fallback wild-card handler for Single Page Application routing (with SSR SEO meta injection)
app.use(async (req, res, next) => {
  try {
    const indexPath = path.join(rootDir, 'index.html');
    let html = fs.readFileSync(indexPath, 'utf8');

    const rawHost = req.get('x-forwarded-host') || req.get('host') || '189.74.97.12';
    const host = rawHost.replace(/[^a-zA-Z0-9.\-:]/g, '');
    const rawProto = req.get('x-forwarded-proto') || req.protocol || 'http';
    const proto = rawProto.replace(/[^a-zA-Z]/g, '');
    const baseUrl = `${proto}://${host}`;

    let storyId = req.query.story || req.query.id;
    if (!storyId) {
      const m = req.path.match(/^\/(?:news|story|article|yangilik)\/([a-zA-Z0-9_-]+)/i);
      if (m) storyId = m[1];
    }

    // If there is a storyId, inject dynamic OpenGraph & Google SEO Schema.org tags
    if (storyId) {
      const db = await articleRepository.getAll(true);
      const allStories = Object.values(db).flat().filter(Boolean);
      const story = allStories.find(s => String(s.id) === String(storyId) || String(s.slug) === String(storyId));
      
      if (story) {
        const escText = (str) => String(str || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        const escUrl = (str) => String(str || '').trim().replace(/"/g,'%22').replace(/'/g,'%27').replace(/</g,'%3C').replace(/>/g,'%3E');

        let imageUrl = story.image ? String(story.image).trim() : '';
        if (imageUrl && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
          imageUrl = `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
        }

        const pageTitle = `${escText(story.title)} — Vatanuz.uz`;
        const rawSummary = story.summary || (story.body ? story.body.replace(/<[^>]*>?/gm, '').slice(0, 250) : '') || 'Vatanuz.uz yangiliklari';
        const pageDesc = escText(rawSummary);
        const pageUrl = `${baseUrl}/news/${encodeURIComponent(story.id)}`;
        const cleanImageUrl = escUrl(imageUrl);
        const cleanPageUrl = escUrl(pageUrl);
        const publishedDate = new Date(story.createdAt || Date.now()).toISOString();
        const modifiedDate = new Date(story.updatedAt || story.createdAt || Date.now()).toISOString();
        const authorName = escText(story.author || 'Vatanuz Tahririyati');
        const categoryName = escText(story.category || 'Yangiliklar');
        const tags = escText(Array.isArray(story.tags) ? story.tags.join(', ') : (story.tags || categoryName));

        const structuredData = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": cleanPageUrl
          },
          "headline": story.title,
          "description": rawSummary,
          "image": cleanImageUrl ? [cleanImageUrl] : [`${baseUrl}/icon-512.png`],
          "datePublished": publishedDate,
          "dateModified": modifiedDate,
          "author": {
            "@type": "Person",
            "name": story.author || "Vatanuz.uz"
          },
          "publisher": {
            "@type": "NewsMediaOrganization",
            "name": "Vatanuz.uz",
            "url": baseUrl,
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/icon-512.png`
            }
          },
          "articleSection": story.category || "Yangiliklar",
          "keywords": tags
        });

        const seoTags = `
    <!-- Google & Search Engine SEO Meta -->
    <link rel="canonical" href="${cleanPageUrl}" />
    <meta name="description" content="${pageDesc}" />
    <meta name="keywords" content="${tags}" />
    <meta name="news_keywords" content="${tags}" />
    <meta name="author" content="${authorName}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

    <!-- Open Graph / Facebook / Telegram -->
    <meta property="og:site_name" content="Vatanuz.uz" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${cleanPageUrl}" />
    <meta property="og:title" content="${escText(story.title)}" />
    <meta property="og:description" content="${pageDesc}" />
    <meta property="article:published_time" content="${publishedDate}" />
    <meta property="article:modified_time" content="${modifiedDate}" />
    <meta property="article:section" content="${categoryName}" />
    ${cleanImageUrl ? `
    <meta property="og:image" content="${cleanImageUrl}" />
    <meta property="og:image:secure_url" content="${cleanImageUrl}" />
    <meta property="og:image:alt" content="${escText(story.title)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />` : ''}

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${cleanPageUrl}" />
    <meta name="twitter:title" content="${escText(story.title)}" />
    <meta name="twitter:description" content="${pageDesc}" />
    ${cleanImageUrl ? `<meta name="twitter:image" content="${cleanImageUrl}" />` : ''}

    <!-- Google News & Rich Results JSON-LD Structured Data -->
    <script type="application/ld+json">
${structuredData}
    </script>
`;
        html = html.replace(/<head>/i, '<head>\n' + seoTags);
        html = html.replace(/<title>.*?<\/title>/i, `<title>${pageTitle}</title>`);
      }
    } else {
      // Default website SEO & OpenGraph tags for Homepage
      try {
        const settings = await settingRepository.getSettings();
        const siteName = settings?.siteName || 'Vatanuz.uz';
        let ogImage = settings?.ogImage || settings?.logoUrl || '';
        if (ogImage && !ogImage.startsWith('http://') && !ogImage.startsWith('https://')) {
          ogImage = `${baseUrl}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;
        }
        const escText = (str) => String(str || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        const escUrl = (str) => String(str || '').trim().replace(/"/g,'%22').replace(/'/g,'%27').replace(/</g,'%3C').replace(/>/g,'%3E');
        const defaultDesc = "Vatanuz.uz — O'zbekiston va jahon yangiliklari, eng muhim voqealar va tahliliy materiallar portali.";
        const cleanOgImage = escUrl(ogImage);
        const cleanBaseUrl = escUrl(baseUrl);
        const googleVerif = settings?.googleVerification ? `<meta name="google-site-verification" content="${escText(settings.googleVerification)}" />` : '';

        const homeStructuredData = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NewsMediaOrganization",
          "name": siteName,
          "url": baseUrl,
          "logo": cleanOgImage || `${baseUrl}/icon-512.png`,
          "description": defaultDesc,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${baseUrl}/?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        });

        const ogTags = `
    <!-- Homepage SEO & Verification -->
    <link rel="canonical" href="${cleanBaseUrl}/" />
    <meta name="description" content="${escText(defaultDesc)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    ${googleVerif}

    <!-- Open Graph / Facebook -->
    <meta property="og:site_name" content="${escText(siteName)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${cleanBaseUrl}/" />
    <meta property="og:title" content="${escText(siteName)} — Milliy axborot portali" />
    <meta property="og:description" content="${escText(defaultDesc)}" />
    ${cleanOgImage ? `
    <meta property="og:image" content="${cleanOgImage}" />
    <meta property="og:image:secure_url" content="${cleanOgImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />` : ''}

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escText(siteName)} — Milliy axborot portali" />
    <meta name="twitter:description" content="${escText(defaultDesc)}" />
    ${cleanOgImage ? `<meta name="twitter:image" content="${cleanOgImage}" />` : ''}

    <!-- Structured Data JSON-LD -->
    <script type="application/ld+json">
${homeStructuredData}
    </script>
`;
        html = html.replace(/<head>/i, '<head>\n' + ogTags);
      } catch (_) {}
    }

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.send(html);
  } catch (err) {
    next(err);
  }
});

// Global Error Handler
app.use(errorHandler);

// Start background auto-repair and health-check scheduler
const scheduler = require('./utils/scheduler');
scheduler.startScheduler();

module.exports = app;

// touch for restart

// trigger nodemon restart

// trigger restart
