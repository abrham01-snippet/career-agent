/**
 * Profile Service
 * AI Career Development Agent
 *
 * Handles retrieval and persistence of student profiles.
 * Supports PostgreSQL connection when DATABASE_URL is present,
 * with in-memory stub storage for 100% offline testing.
 */

require('dotenv').config();

// In-memory stub store for testing / offline execution
const stubProfiles = new Map();

/**
 * Registers an in-memory stub profile for testing.
 * @param {string} id
 * @param {Object} profile
 */
function setStubProfile(id, profile) {
  stubProfiles.set(id, {
    id,
    ...profile
  });
}

/**
 * Clears all registered in-memory stub profiles.
 */
function clearStubProfiles() {
  stubProfiles.clear();
}

/**
 * Retrieves a profile by ID.
 * Checks in-memory stubs first; if not found and DATABASE_URL is set, queries PostgreSQL.
 *
 * @param {string} profileId
 * @returns {Promise<Object|null>}
 */
async function getProfileById(profileId) {
  if (!profileId || typeof profileId !== 'string') {
    return null;
  }

  // Check in-memory stubs (used for offline testing)
  if (stubProfiles.has(profileId)) {
    return JSON.parse(JSON.stringify(stubProfiles.get(profileId)));
  }

  // If DATABASE_URL is available, query remote database
  if (process.env.DATABASE_URL) {
    try {
      const { Pool } = require('pg');
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 3000
      });

      const res = await pool.query(
        'SELECT id, status, cv_text, skills, created_at, updated_at, confirmed_at FROM profiles WHERE id = $1',
        [profileId]
      );
      await pool.end();

      if (res.rows.length === 0) {
        return null;
      }

      const row = res.rows[0];
      return {
        id: row.id,
        status: row.status,
        cvText: row.cv_text,
        skills: typeof row.skills === 'string' ? JSON.parse(row.skills) : row.skills,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        confirmedAt: row.confirmed_at
      };
    } catch (dbErr) {
      console.warn(`[ProfileService] Database query failed: ${dbErr.message}`);
      return null;
    }
  }

  return null;
}

module.exports = {
  getProfileById,
  setStubProfile,
  clearStubProfiles
};

