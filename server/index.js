require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const path    = require('path');

const chatRouter     = require('./routes/chat');
const modulesRouter  = require('./routes/modules');
const quizRouter     = require('./routes/quiz');
const glossaryRouter = require('./routes/glossary');
const mythsRouter    = require('./routes/myths');

const app  = express();
const PORT = process.env.PORT || 5000;

/* ── Security ────────────────────────────────────────────── */
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false, // managed by frontend headers
}));

/* CORS only needed in dev (same-origin in production via Cloud Run) */
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));
}

app.use(express.json({ limit: '10kb' }));

/* ── API Routes ──────────────────────────────────────────── */
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' })
);

app.use('/api/chat',     chatRouter);
app.use('/api/modules',  modulesRouter);
app.use('/api/quiz',     quizRouter);
app.use('/api/glossary', glossaryRouter);
app.use('/api/myths',    mythsRouter);

/* ── Serve React frontend (production) ───────────────────── */
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, 'public');
  app.use(express.static(clientDist, {
    maxAge: '1y',
    etag: true,
    index: false,         // handle via catch-all below
  }));
  /* SPA catch-all — serve index.html for all non-API routes */
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

/* ── 404 (API only in dev) ───────────────────────────────── */
app.use((_req, res) => res.status(404).json({ error: 'Resource not found' }));

/* ── Global Error Handler ────────────────────────────────── */
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(`[${new Date().toISOString()}]`, err.message);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅  ElectaGuide → http://localhost:${PORT}`);
    console.log(`🤖  Gemini: ${process.env.GEMINI_API_KEY ? 'Configured' : 'Fallback mode'}`);
    console.log(`🌐  Mode: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
