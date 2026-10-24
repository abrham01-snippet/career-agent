const express = require('express');
const path = require('path');
require('dotenv').config();
require('dotenv').config({ path: path.join(__dirname, '../ai/.env') });
const asyncHandler = require('./src/utils/asyncHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const MOCK_AI = process.env.MOCK_AI === 'true';

// SAFETY INVARIANT: Strictly refuse to start if MOCK_AI is enabled in production
if (NODE_ENV === 'production' && MOCK_AI) {
  console.error('[FATAL] Configuration error: MOCK_AI cannot be true when NODE_ENV is production.');
  process.exit(1);
}

// Enable CORS for frontend integration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Session-ID');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Request logger to terminal
app.use((req, res, next) => {
  console.log(`[BACKEND] 📡 ${req.method} ${req.originalUrl || req.url}`);
  next();
});

app.use(express.json({ limit: '5mb' }));

// Mount all 15 specification endpoints
const allEndpoints = require('./src/routes/allEndpoints');
app.use('/api', allEndpoints);
app.use('/', allEndpoints);

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