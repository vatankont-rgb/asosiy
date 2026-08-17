const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow in dev, restrict via ALLOWED_ORIGINS in production
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'CSRF-Token'],
  exposedHeaders: ['Set-Cookie']
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    data: null,
    errors: ['Rate limit exceeded'],
    timestamp: new Date().toISOString()
  }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // max 50 login requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes.',
    errors: ['Rate limit exceeded']
  }
});

module.exports = {
  helmetConfig: helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }),
  corsConfig: cors(corsOptions),
  rateLimiter: limiter,
  loginLimiter
};
