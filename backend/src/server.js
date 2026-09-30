require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const corsOptions = require('./config/corsOption');
const prisma = require('./lib/prisma');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security middleware ──────────────────────────────────────
// Helmet sets secure HTTP headers (X-Content-Type-Options,
// Strict-Transport-Security, X-Frame-Options, etc.)
app.use(helmet());

// CORS — use the whitelist-based config instead of wide-open cors()
app.use(cors(corsOptions));

// Body parsing with a sane size limit to prevent DoS via huge payloads.
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Health check — also verifies the DB connection via Prisma
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'disconnected', message: err.message });
  }
});

app.use('/api', routes);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Global error handler — never leak stack traces in production
app.use((err, req, res, _next) => {
  console.error(err);
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error';
  res.status(500).json({ error: message });
});

if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    await prisma.$disconnect();
    server.close(() => process.exit(0));
  });
  process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    server.close(() => process.exit(0));
  });
}

module.exports = app;
