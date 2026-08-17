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
  maxAge: '7d', // Cache for 7 days
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=0'); // Don't cache HTML files
    }
  }
}));

const fs = require('fs');
const articleRepository = require('./repositories/articleRepository');

// Fallback wild-card handler for Single Page Application routing (with SSR SEO meta injection)
app.use(async (req, res, next) => {
  try {
    const indexPath = path.join(rootDir, 'index.html');
    let html = fs.readFileSync(indexPath, 'utf8');

    // If there is a ?story=ID query parameter, inject dynamic OpenGraph SEO tags
    if (req.query.story) {
      const db = await articleRepository.getAll();
      const allStories = [...(db.uz || []), ...(db.en || [])];
      const story = allStories.find(s => s.id === req.query.story);
      
      if (story) {
        const esc = (str) => String(str || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        const ogTags = `
          <meta property="og:title" content="${esc(story.title)}" />
          <meta property="og:description" content="${esc(story.summary)}" />
          <meta property="og:image" content="${esc(story.image)}" />
          <meta property="og:type" content="article" />
          <meta name="twitter:card" content="summary_large_image" />
        `;
        html = html.replace('</head>', ogTags + '</head>');
        html = html.replace(/<title>.*?<\/title>/, `<title>${esc(story.title)} - Vatan.uz</title>`);
      }
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
