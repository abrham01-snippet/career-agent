const express = require('express');
require('dotenv').config();
const asyncHandler = require('./src/utils/asyncHandler');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const MOCK_AI = process.env.MOCK_AI === 'true';

// SAFETY INVARIANT: Strictly refuse to start if MOCK_AI is enabled in production
if (NODE_ENV === 'production' && MOCK_AI) {
  console.error('[FATAL] Configuration error: MOCK_AI cannot be true when NODE_ENV is production.');
  process.exit(1);
}

app.use(express.json({ limit: '1mb' }));

/**
 * Health check endpoint
 * Reports service status, environment, mock mode status, and uptime.
 */
app.get('/api/health', asyncHandler(async (req, res) => {
  let dbStatus = 'unconfigured';

  if (process.env.DATABASE_URL) {
    try {
      const { Pool } = require('pg');
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 3000
      });
      await pool.query('SELECT 1');
      await pool.end();
      dbStatus = 'connected';
    } catch (err) {
      dbStatus = `error: ${err.message}`;
    }
  }

  res.status(200).json({
    status: 'ok',
    service: 'career-agent-backend',
    environment: NODE_ENV,
    database: dbStatus,
    mockMode: MOCK_AI,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime())
  });
}));

// Generic 404 handler for unmapped routes
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.path}`,
      details: []
    }
  });
});

// Centralized error handler returning standardized JSON
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  res.status(err.status || 500).json({
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected internal error occurred.',
      details: err.details || []
    }
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[SERVER] Career Development Agent API listening on port ${PORT} [env=${NODE_ENV}, mock=${MOCK_AI}]`);
  });
}

module.exports = app;

