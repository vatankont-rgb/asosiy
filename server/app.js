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
  maxAge: '7d',
  index: false // Disable serving index.html automatically so dynamic SSR / OG tag handler processes all HTML routes
}));

const fs = require('fs');
const articleRepository = require('./repositories/articleRepository');
const settingRepository = require('./repositories/settingRepository');

// Fallback wild-card handler for Single Page Application routing (with SSR SEO meta injection)
app.use(async (req, res, next) => {
  try {
    const indexPath = path.join(rootDir, 'index.html');
    let html = fs.readFileSync(indexPath, 'utf8');

    const host = req.get('host') || 'vatanuz.uz';
    const proto = req.get('x-forwarded-proto') || req.protocol || 'http';
    const baseUrl = `${proto}://${host}`;

    const storyId = req.query.story || req.query.id;

    // If there is a ?story=ID query parameter, inject dynamic OpenGraph SEO tags
    if (storyId) {
      const db = await articleRepository.getAll();
      const allStories = Object.values(db).flat().filter(Boolean);
      const story = allStories.find(s => String(s.id) === String(storyId) || String(s.slug) === String(storyId));
      
      if (story) {
        const esc = (str) => String(str || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        let imageUrl = story.image ? String(story.image).trim() : '';
        if (imageUrl && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
          imageUrl = `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
        }

        const pageTitle = `${esc(story.title)} - Vatan.uz`;
        const pageDesc = esc(story.summary || (story.body ? story.body.replace(/<[^>]*>?/gm, '').slice(0, 200) : '') || 'Vatanuz.uz yangiliklari');
        const pageUrl = `${baseUrl}/?story=${encodeURIComponent(story.id)}`;

        const ogTags = `
    <!-- Dynamic Open Graph / Telegram / Social Preview -->
    <meta property="og:site_name" content="Vatan.uz" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${esc(pageUrl)}" />
    <meta property="og:title" content="${esc(story.title)}" />
    <meta property="og:description" content="${pageDesc}" />
    ${imageUrl ? `
    <meta property="og:image" content="${esc(imageUrl)}" />
    <meta property="og:image:secure_url" content="${esc(imageUrl)}" />
    <meta property="og:image:alt" content="${esc(story.title)}" />` : ''}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${esc(pageUrl)}" />
    <meta name="twitter:title" content="${esc(story.title)}" />
    <meta name="twitter:description" content="${pageDesc}" />
    ${imageUrl ? `<meta name="twitter:image" content="${esc(imageUrl)}" />` : ''}
`;
        html = html.replace('</head>', ogTags + '</head>');
        html = html.replace(/<title>.*?<\/title>/i, `<title>${pageTitle}</title>`);
      }
    } else {
      // Default website OpenGraph preview tags
      try {
        const settings = await settingRepository.getSettings();
        const siteName = settings?.siteName || 'Vatan.uz';
        let ogImage = settings?.ogImage || settings?.logoUrl || '';
        if (ogImage && !ogImage.startsWith('http://') && !ogImage.startsWith('https://')) {
          ogImage = `${baseUrl}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;
        }
        const defaultDesc = "Vatanuz.uz — O'zbekiston yangiliklari portali. Tezkor, ishonchli, mustaqil.";
        const ogTags = `
    <!-- Default Open Graph / Telegram Preview -->
    <meta property="og:site_name" content="${siteName}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${baseUrl}/" />
    <meta property="og:title" content="${siteName} — Milliy axborot portali" />
    <meta property="og:description" content="${defaultDesc}" />
    ${ogImage ? `
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:secure_url" content="${ogImage}" />` : ''}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${siteName} — Milliy axborot portali" />
    <meta name="twitter:description" content="${defaultDesc}" />
    ${ogImage ? `<meta name="twitter:image" content="${ogImage}" />` : ''}
`;
        html = html.replace('</head>', ogTags + '</head>');
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
