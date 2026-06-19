require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Debug: log every incoming request before any middleware touches it
app.use((req, _res, next) => {
  console.log(
    `[REQ] ${new Date().toISOString()} ${req.method} ${req.path} | Origin: ${req.headers.origin || 'none'}`
  );
  next();
});

connectDB();

const allowedOrigins = [
  'https://mkmerndashboard.netlify.app', // Netlify production (hardcoded so it works even if CLIENT_URL is missing)
  process.env.CLIENT_URL,               // additional override from env
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

console.log('[CORS] Allowed origins on startup:', allowedOrigins);

const corsOptions = {
  origin: (origin, callback) => {
    // No origin = curl / Postman / server-to-server — allow
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Use callback(null, false) — NOT callback(new Error(...))
    // Passing an Error triggers next(err) → errorHandler → 500 (the root cause of the OPTIONS 500)
    console.warn(`[CORS] Blocked origin: ${origin}`);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// CORS and preflight MUST be registered before any route or body-parser
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // run in all environments so Render logs show request traffic

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));

app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: process.env.NODE_ENV })
);

app.use(errorHandler);

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () =>
  console.log(`[SERVER] Running on port ${PORT} in ${process.env.NODE_ENV || 'unknown'} mode`)
);

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[FATAL] Port ${PORT} is already in use.\n`);
    process.exit(1);
  }
  throw err;
});
