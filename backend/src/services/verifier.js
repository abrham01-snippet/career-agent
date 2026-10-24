/**
 * Evidence Verification & Plan Validation Service
 * AI Career Development Agent
 *
 * Invariants:
 * 1. Evidence check normalizes whitespace and casing before checking substring inclusion.
 * 2. Unverified evidence is demoted (not dropped) with verified: false and a descriptive note.
 * 3. Plan validator revalidates all 6 invariants:
 *    - Valid 7-day schedule (day 1..7)
 *    - At least 3 distinct activities
 *    - All referenced resourceIds exist in curated learning resources
 *    - Target opportunity exists
 *    - Activity durations are positive integers (15–300 min)
 *    - Confirmation status check
 */

const { normalize } = require('../data/skills');
const { OPPORTUNITIES } = require('../data/opportunities');
const { RESOURCES } = require('../data/resources');

const VALID_OPP_IDS = new Set(OPPORTUNITIES.map((o) => o.id));
const VALID_RESOURCE_IDS = new Set(RESOURCES.map((r) => r.id));

/**
 * Normalizes text by collapsing all whitespace (newlines, tabs, repeated spaces)
 * into a single space and folding to lowercase.
 *
 * @param {string} text
 * @returns {string} Normalized string
 */
function normalizeText(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Verifies that a sourceReference quote exists as an exact substring in the CV text,
 * accounting for variations in whitespace formatting and case.
 *
 * @param {string} cvText Raw CV text
 * @param {string} sourceReference Verbatim quote returned by extractor
 * @returns {boolean} True if substring proof is verified in CV text
 */
function verifySourceReference(cvText, sourceReference) {
  if (!cvText || !sourceReference || typeof cvText !== 'string' || typeof sourceReference !== 'string') {
    return false;
  }

  const normalizedCv = normalizeText(cvText);
  const normalizedRef = normalizeText(sourceReference);

  if (!normalizedRef) {
    return false;
  }

  return normalizedCv.includes(normalizedRef);
}

/**
 * Validates and normalizes raw CV input.
 *
 * @param {string} cvText
 * @returns {{valid: boolean, error?: string}}
 */
function validateCvInput(cvText) {
  if (!cvText || typeof cvText !== 'string') {
    return { valid: false, error: 'CV text must be a non-empty string.' };
  }

  const trimmed = cvText.trim();
  if (trimmed.length < 50) {
    return { valid: false, error: 'CV text is too short. Please provide at least 50 characters.' };
  }

  if (trimmed.length > 25000) {
    return { valid: false, error: 'CV text exceeds the maximum permitted size of 25,000 characters.' };
  }

  return { valid: true };
}

/**
 * Processes extracted skills against the raw CV text.
 * - Verifies source references with whitespace/case normalization.
 * - Unverified evidence is demoted (not dropped) with verified: false.
 * - Resolves canonical skill names.
 *
 * @param {string} cvText
 * @param {Array<Object>} extractedSkills
 * @returns {Array<Object>} Verified and processed skill profiles
 */
function verifyExtractedSkills(cvText, extractedSkills) {
  if (!Array.isArray(extractedSkills)) {
    return [];
  }

  return extractedSkills.map((item) => {
    if (!item || typeof item !== 'object') {
      return null;
    }

    const rawName = item.name || item.skill || '';
    const canonicalName = normalize(rawName) || rawName.trim();
    const rawStatus = (item.status || 'not_established').toLowerCase();
    const sourceRef = item.sourceReference || item.source_reference || '';
    const evidenceText = item.evidence || '';

    // Verify source reference quote against CV text
    const isVerified = verifySourceReference(cvText, sourceRef);

    let finalStatus = rawStatus;
    let verificationNote = null;

    if (!isVerified) {
      // Unverified evidence is demoted, never silently dropped
      if (rawStatus === 'demonstrated') {
        finalStatus = 'not_established';
        verificationNote = `Quoted reference "${sourceRef}" was not found in CV text; demoted from demonstrated to not_established.`;
      } else if (rawStatus === 'listed') {
        finalStatus = 'not_established';
        verificationNote = `Reference was not found in CV text; marked unverified.`;
      }
    }

    return {
      name: canonicalName,
      status: finalStatus,
      evidence: evidenceText,
      sourceReference: sourceRef,
      verified: isVerified,
      ...(verificationNote ? { verificationNote } : {})
    };
  }).filter(Boolean);
}

/**
 * Validates a 7-day development plan against business invariants.
 *
 * Invariants enforced:
 * 1. Plan structure and title present
 * 2. At least 3 specific activities
 * 3. Every activity assigned to day 1 through 7
 * 4. Activity durations are integers between 15 and 300 minutes
 * 5. Every referenced resource ID exists in the curated learning resources
 * 6. Target opportunity ID exists in the demonstration opportunities
 *
 * @param {Object} params
 * @param {Object} params.plan Plan payload with title and activities
 * @param {string} params.opportunityId Target opportunity ID
 * @param {boolean} params.studentConfirmed Explicit confirmation flag
 * @returns {{valid: boolean, errors: string[]}}
 */
function validatePlan({ plan, opportunityId, studentConfirmed }) {
  const errors = [];

  // Invariant: Confirmation
  if (studentConfirmed !== true) {
    errors.push('Plan persistence requires explicit student confirmation (studentConfirmed must be true).');
  }

  // Invariant: Opportunity existence
  if (!opportunityId || !VALID_OPP_IDS.has(opportunityId)) {
    errors.push(`Opportunity ID "${opportunityId}" does not exist in valid opportunities.`);
  }

  // Invariant: Plan structure
  if (!plan || typeof plan !== 'object') {
    errors.push('Plan must be a valid object.');
    return { valid: false, errors };
  }

  if (!plan.title || typeof plan.title !== 'string' || !plan.title.trim()) {
    errors.push('Plan must have a non-empty title.');
  }

  const activities = plan.activities;
  if (!Array.isArray(activities)) {
    errors.push('Plan must contain an activities array.');
    return { valid: false, errors };
  }

  // Invariant: At least 3 activities
  if (activities.length < 3) {
    errors.push(`Plan must have at least 3 activities (received ${activities.length}).`);
  }

  const seenDays = new Set();

  activities.forEach((act, idx) => {
    const actNum = idx + 1;

    if (!act || typeof act !== 'object') {
      errors.push(`Activity #${actNum} must be an object.`);
      return;
    }

    // Invariant: Day bounds (1-7)
    if (!Number.isInteger(act.day) || act.day < 1 || act.day > 7) {
      errors.push(`Activity #${actNum} day must be an integer between 1 and 7 (received: ${act.day}).`);
    } else {
      seenDays.add(act.day);
    }

    // Invariant: Title / Description
    if (!act.title || typeof act.title !== 'string' || !act.title.trim()) {
      errors.push(`Activity #${actNum} must have a non-empty title.`);
    }

    // Invariant: Duration (15–300 minutes)
    const duration = act.durationMinutes || act.duration_minutes;
    if (!Number.isInteger(duration) || duration < 15 || duration > 300) {
      errors.push(`Activity #${actNum} duration must be an integer between 15 and 300 minutes (received: ${duration}).`);
    }

    // Invariant: Resource IDs existence
    const resIds = act.resourceIds || act.resource_ids || [];
    if (!Array.isArray(resIds) || resIds.length === 0) {
      errors.push(`Activity #${actNum} must reference at least one resource ID.`);
    } else {
      for (const resId of resIds) {
        if (!VALID_RESOURCE_IDS.has(resId)) {
          errors.push(`Activity #${actNum} references non-existent resource ID: "${resId}".`);
        }
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = {
  normalizeText,
  verifySourceReference,
  validateCvInput,
  verifyExtractedSkills,
  validatePlan,
  VALID_OPP_IDS,
  VALID_RESOURCE_IDS
};

