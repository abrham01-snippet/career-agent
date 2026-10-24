/**
 * Pure Deterministic Scoring Service
 * AI Career Development Agent
 *
 * Requirements:
 * - Pure deterministic JavaScript function. No database, no LLM.
 * - Per skill credit:
 *     demonstrated: 1.0
 *     student_confirmed: 1.0
 *     listed: 0.5
 *     not_established: 0.0
 * - Required fraction = (sum of credits for required skills) / count of required
 * - Preferred fraction = (sum of credits for preferred skills) / count of preferred
 * - Formula:
 *     Score = 100 * (0.8 * reqFraction + 0.2 * prefFraction) [when preferred skills exist]
 *     Score = 100 * reqFraction [when no preferred skills exist]
 * - Separates full matches (credit === 1.0) from partial matches (0 < credit < 1.0)
 *   and missing skills (credit === 0).
 * - Returns raw score and rounded score.
 * - Sorts by raw score descending; ties broken by opportunity id ascending.
 * - Never mutates its inputs.
 */

const { normalize } = require('../data/skills');
const { OPPORTUNITIES } = require('../data/opportunities');

// Normalized skill credits table
const SKILL_CREDITS = {
  'demonstrated': 1.0,
  'student_confirmed': 1.0,
  'student-confirmed': 1.0, // Alias for hyphenated format
  'listed': 0.5,
  'not_established': 0.0,
  'not-established': 0.0
};

/**
 * Builds an immutable, normalized skill lookup map from a profile's skill list.
 * Resolves aliases, deduplicates by retaining the highest credit level,
 * and ignores unknown skills without error.
 *
 * @param {Array<{name: string, status?: string}>} skills
 * @returns {Map<string, {status: string, credit: number}>}
 */
function buildSkillMap(skills) {
  const map = new Map();

  if (!Array.isArray(skills)) {
    return map;
  }

  for (const item of skills) {
    if (!item || typeof item !== 'object') continue;

    const rawName = item.name || item.skill;
    const canonicalName = normalize(rawName);

    // If skill is unrecognized, do not map to canonical
    if (!canonicalName) continue;

    const rawStatus = (item.status || 'not_established').toLowerCase();
    const credit = SKILL_CREDITS[rawStatus] !== undefined ? SKILL_CREDITS[rawStatus] : 0.0;

    // Deduplication rule: retain the highest credit level seen for this canonical skill
    if (!map.has(canonicalName) || credit > map.get(canonicalName).credit) {
      map.set(canonicalName, {
        status: rawStatus,
        credit
      });
    }
  }

  return map;
}

/**
 * Scores a single opportunity against a normalized student profile skill map.
 * Pure function: does not mutate opportunity or profile map.
 * Separates full matches (credit = 1.0) from partial matches (0 < credit < 1.0).
 *
 * @param {Map<string, {status: string, credit: number}>} skillMap
 * @param {Object} opportunity
 * @returns {Object} Scored opportunity result
 */
function scoreOpportunity(skillMap, opportunity) {
  const required = Array.isArray(opportunity.requiredSkills) ? opportunity.requiredSkills : [];
  const preferred = Array.isArray(opportunity.preferredSkills) ? opportunity.preferredSkills : [];

  let reqCreditSum = 0;
  const matchedRequired = [];
  const partialRequired = [];
  const missingRequired = [];

  for (const reqSkill of required) {
    const canonical = normalize(reqSkill) || reqSkill;
    const profileMatch = skillMap.get(canonical);
    const credit = profileMatch ? profileMatch.credit : 0.0;

    reqCreditSum += credit;

    if (credit >= 1.0) {
      matchedRequired.push(reqSkill);
    } else if (credit > 0.0) {
      partialRequired.push(reqSkill);
    } else {
      missingRequired.push(reqSkill);
    }
  }

  let prefCreditSum = 0;
  const matchedPreferred = [];
  const partialPreferred = [];
  const missingPreferred = [];

  for (const prefSkill of preferred) {
    const canonical = normalize(prefSkill) || prefSkill;
    const profileMatch = skillMap.get(canonical);
    const credit = profileMatch ? profileMatch.credit : 0.0;

    prefCreditSum += credit;

    if (credit >= 1.0) {
      matchedPreferred.push(prefSkill);
    } else if (credit > 0.0) {
      partialPreferred.push(prefSkill);
    } else {
      missingPreferred.push(prefSkill);
    }
  }

  const reqCount = required.length;
  const prefCount = preferred.length;

  const reqFraction = reqCount > 0 ? reqCreditSum / reqCount : 0;
  const prefFraction = prefCount > 0 ? prefCreditSum / prefCount : 0;

  let rawScore = 0;
  if (prefCount > 0) {
    rawScore = 100 * (0.8 * reqFraction + 0.2 * prefFraction);
  } else {
    rawScore = 100 * reqFraction;
  }

  // Prevent floating point overshoot
  rawScore = Math.max(0, Math.min(100, rawScore));
  const roundedScore = Math.round(rawScore);

  return {
    id: opportunity.id,
    title: opportunity.title,
    score: roundedScore,
    rawScore,
    matchedRequired: Object.freeze(matchedRequired),
    partialRequired: Object.freeze(partialRequired),
    matchedPreferred: Object.freeze(matchedPreferred),
    partialPreferred: Object.freeze(partialPreferred),
    missingRequired: Object.freeze(missingRequired),
    missingPreferred: Object.freeze(missingPreferred)
  };
}

/**
 * Scores and ranks opportunities against a student profile.
 * Pure function: guarantees inputs are never mutated.
 *
 * @param {Array|Object} profile Array of skill objects or profile object with .skills
 * @param {Array} [opportunities=OPPORTUNITIES] Opportunity records list
 * @returns {Array<Object>} Sorted list of scored opportunities (rawScore desc, id asc)
 */
function scoreOpportunities(profile, opportunities = OPPORTUNITIES) {
  // Extract skills array safely without mutating input
  let rawSkills = [];
  if (Array.isArray(profile)) {
    rawSkills = profile;
  } else if (profile && Array.isArray(profile.skills)) {
    rawSkills = profile.skills;
  }

  const skillMap = buildSkillMap(rawSkills);
  const oppsToScore = Array.isArray(opportunities) ? opportunities : OPPORTUNITIES;

  const results = oppsToScore.map((opp) => scoreOpportunity(skillMap, opp));

  // Sort by rawScore descending; break ties deterministically by opportunity id ascending
  results.sort((a, b) => {
    if (b.rawScore !== a.rawScore) {
      return b.rawScore - a.rawScore;
    }
    return a.id.localeCompare(b.id);
  });

  return results;
}

module.exports = {
  SKILL_CREDITS,
  scoreOpportunities,
  scoreOpportunity,
  buildSkillMap
};
