/**
 * Database Setup Script
 * Applies src/db/schema.sql to DATABASE_URL idempotently.
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function setupDatabase() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('❌ [DB SETUP FAILED]: DATABASE_URL is not set in environment or .env');
    console.error('Please configure DATABASE_URL in backend/.env before running db:setup');
    process.exit(1);
  }

  const schemaPath = path.join(__dirname, '..', 'src', 'db', 'schema.sql');
  if (!fs.existsSync(schemaPath)) {
    console.error(`❌ [DB SETUP FAILED]: Schema file not found at ${schemaPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(schemaPath, 'utf8');

  console.log('🔄 Connecting to PostgreSQL database (SSL enabled)...');
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000
  });

  try {
    console.log('🔄 Applying schema migrations from src/db/schema.sql...');
    await pool.query(sql);

    // Verify created tables
    const checkTables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('profiles', 'plans')
      ORDER BY table_name;
    `);

    console.log('✅ [DB SETUP SUCCESS] Schema successfully applied.');
    console.log('📋 Verified public tables:');
    checkTables.rows.forEach((row) => console.log(`   - ${row.table_name}`));

    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ [DB SETUP FAILED]:', err.message);
    await pool.end();
    process.exit(1);
  }
}

setupDatabase();

