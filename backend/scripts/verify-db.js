/**
 * M0 Verification Script: Neon PostgreSQL Connectivity
 * Executes 'SELECT 1 AS connected' with SSL required.
 */
require('dotenv').config();
const { Pool } = require('pg');

async function testNeonDatabase() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('❌ [DATABASE TEST FAILED]: DATABASE_URL is not defined in environment or .env');
    console.error('Please set DATABASE_URL=postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require in backend/.env');
    process.exit(1);
  }

  console.log('🔄 Connecting to PostgreSQL database (SSL enabled)...');

  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 5000
  });

  try {
    const startTime = Date.now();
    const result = await pool.query('SELECT 1 AS connected, NOW() AS server_time, current_database() AS db_name;');
    const duration = Date.now() - startTime;

    console.log('✅ [DATABASE TEST SUCCESS]');
    console.log(`⏱️ Query executed in ${duration}ms`);
    console.log('📊 Result row:', result.rows[0]);
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ [DATABASE TEST FAILED]:', err.message);
    if (err.code) console.error('Error Code:', err.code);
    await pool.end();
    process.exit(1);
  }
}

testNeonDatabase();

