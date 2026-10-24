/**
 * Pure validator and normalization functions for AI outputs.
 * Design rule: The LLM proposes, the code checks.
 */

// Guardrail: Normalizes text by collapsing irregular whitespace and lowercasing to avoid false negative quote matches.
export function normalizeText(text) {
  if (typeof text !== 'string') return '';
  return text.trim().replace(/\s+/g, ' ').toLowerCase();
}

// Guardrail: Verifies that quotes actually exist verbatim in the source text to prevent AI hallucinations.
export function quoteExistsIn(text, quote) {
  const normQuote = normalizeText(quote);
  if (!normQuote) return false;
  const normText = normalizeText(text);
  return normText.includes(normQuote);
}

// Guardrail: Restricts skill names to an approved canonical vocabulary to prevent arbitrary skill creation.
export function canonicalSkill(name, vocabulary) {
  if (typeof name !== 'string' || !Array.isArray(vocabulary)) return null;
  const normName = normalizeText(name);
  if (!normName) return null;
  const match = vocabulary.find(v => normalizeText(v) === normName);
  return match ?? null;
}

// Guardrail: Enforces consistent, recognized skill proficiency levels ("beginner", "working", "strong").
export function normalizeLevel(level) {
  if (typeof level !== 'string') return null;
  const norm = level.trim().toLowerCase();
  if (norm === 'beginner' || norm === 'basic' || norm === 'novice') return 'beginner';
  if (norm === 'working' || norm === 'intermediate' || norm === 'medium') return 'working';
  if (norm === 'strong' || norm === 'expert' || norm === 'advanced') return 'strong';
  return null;
}

// Guardrail: Validates extracted profiles against vocabulary and CV text; flags unsupported evidence as weak.
export function validateProfile(result, { cvText, skillVocabulary }) {
  if (!result || !Array.isArray(result.skills)) {
    throw new Error('Invalid profile shape: expected { skills: [...] }');
  }

  const seen = new Set();
  const validSkills = [];

  for (const item of result.skills) {
    if (!item || typeof item !== 'object') continue;

    // Check vocabulary membership
    const canonicalName = canonicalSkill(item.name, skillVocabulary);
    if (!canonicalName) {
      // Drop unknown skill name
      continue;
    }

    // Drop duplicates
    if (seen.has(canonicalName)) {
      continue;
    }

    // Reject invalid skill levels by throwing
    const level = normalizeLevel(item.level);
    if (!level) {
      throw new Error(`Invalid skill level "${item.level}" for skill "${item.name}"`);
    }

    // Verify evidence quote in CV
    const evidence = typeof item.evidence === 'string' ? item.evidence : '';
    const quoteFound = quoteExistsIn(cvText, evidence);
    const weak_evidence = Boolean(item.weak_evidence) || !quoteFound;

    seen.add(canonicalName);
    validSkills.push({
      name: canonicalName,
      level,
      evidence,
      weak_evidence
    });
  }

  // Ensure at least one valid skill remains
  if (validSkills.length === 0) {
    throw new Error('No valid skills remaining in profile after validation');
  }

  return { skills: validSkills };
}

// Guardrail: Validates user-requested corrections, ensuring operations only affect existing or valid new skills.
export function validateOps(result, { profile, skillVocabulary }) {
  if (!result || !Array.isArray(result.ops)) {
    return { ops: [] };
  }

  const existingSkills = new Set(
    (profile?.skills || [])
      .map(s => canonicalSkill(s.name, skillVocabulary))
      .filter(Boolean)
  );

  const validOps = [];

  for (const op of result.ops) {
    if (!op || typeof op !== 'object') continue;
    const action = op.op;
    if (action !== 'remove' && action !== 'add' && action !== 'set_level') {
      continue;
    }

    const canonicalName = canonicalSkill(op.name, skillVocabulary);
    if (!canonicalName) {
      continue;
    }

    if (action === 'remove') {
      // Must target an existing skill in the profile
      if (existingSkills.has(canonicalName)) {
        validOps.push({ op: 'remove', name: canonicalName });
      }
    } else if (action === 'set_level') {
      // Must target an existing skill in the profile with a valid level
      if (existingSkills.has(canonicalName)) {
        const level = normalizeLevel(op.level);
        if (level) {
          validOps.push({ op: 'set_level', name: canonicalName, level });
        }
      }
    } else if (action === 'add') {
      // Must NOT already be in the profile
      if (!existingSkills.has(canonicalName)) {
        const level = normalizeLevel(op.level) || 'beginner';
        validOps.push({ op: 'add', name: canonicalName, level });
      }
    }
  }

  return { ops: validOps };
}

// Guardrail: Validates match explanations ensuring quotes are authentic and skills_to_build strictly match backend gap skills.
export function validateExplanations(result, { cvText, ranked, opportunities }) {
  if (!result || !Array.isArray(result.explanations)) {
    throw new Error('Invalid explanations shape: expected { explanations: [...] }');
  }

  const oppMap = new Map((opportunities || []).map(o => [o.id, o]));
  const explMap = new Map((result.explanations || []).map(e => [e.opportunity_id, e]));
  const validatedExplanations = [];

  for (const r of (ranked || [])) {
    const opp = oppMap.get(r.id);
    const oppDesc = opp?.description || '';
    const expl = explMap.get(r.id);

    if (!expl) {
      throw new Error(`Missing explanation for ranked opportunity ${r.id}`);
    }

    // Keep only why_fits where quotes exist in both CV and Opportunity description
    const validWhyFits = [];
    for (const w of (expl.why_fits || [])) {
      if (!w || typeof w !== 'object') continue;
      const cvQuoteValid = quoteExistsIn(cvText, w.cv_quote);
      const oppQuoteValid = quoteExistsIn(oppDesc, w.opportunity_quote);

      if (cvQuoteValid && oppQuoteValid) {
        validWhyFits.push({
          cv_quote: w.cv_quote,
          opportunity_quote: w.opportunity_quote,
          note: typeof w.note === 'string' ? w.note.trim() : ''
        });
      }
    }

    if (validWhyFits.length === 0) {
      throw new Error(`No valid why_fits quotes for opportunity ${r.id}`);
    }

    // OVERWRITE skills_to_build with exactly the "missing" skills from ranked
    const modelReasonMap = new Map(
      (expl.skills_to_build || []).map(s => [normalizeText(s?.skill), s?.reason])
    );

    const overwrittenSkillsToBuild = (r.missing || []).map(skillName => {
      const existingReason = modelReasonMap.get(normalizeText(skillName));
      return {
        skill: skillName,
        reason: typeof existingReason === 'string' && existingReason.trim()
          ? existingReason.trim()
          : `Build foundational knowledge in ${skillName} to improve qualification for this role.`
      };
    });

    validatedExplanations.push({
      opportunity_id: r.id,
      why_fits: validWhyFits,
      skills_to_build: overwrittenSkillsToBuild
    });
  }

  if (validatedExplanations.length === 0) {
    throw new Error('No valid explanations produced');
  }

  return { explanations: validatedExplanations };
}

// Guardrail: Validates learning plan constraints (duration, resources, steps) and computes uncovered gaps purely in code.
export function validatePlan(result, { resources, gapSkills = [], maxMinutesPerDay = 90 }) {
  if (!result || !Array.isArray(result.plan)) {
    throw new Error('Invalid plan shape: expected { plan: [...] }');
  }

  if (result.plan.length < 3) {
    throw new Error('Plan must contain at least 3 activities');
  }

  const resourceMap = new Map((resources || []).map(r => [r.id, r]));
  const dailyMinutes = {};
  const validPlan = [];

  for (const item of result.plan) {
    if (!item || typeof item !== 'object') {
      throw new Error('Invalid plan activity item');
    }

    const day = Number(item.day);
    if (!Number.isInteger(day) || day < 1 || day > 7) {
      throw new Error(`Invalid plan day: ${item.day}. Must be an integer between 1 and 7.`);
    }

    const minutes = Number(item.minutes);
    if (!Number.isInteger(minutes) || minutes <= 0) {
      throw new Error(`Invalid plan minutes: ${item.minutes}. Must be a positive integer.`);
    }

    if (typeof item.task !== 'string' || !item.task.trim()) {
      throw new Error('Plan task description cannot be empty');
    }

    if (!resourceMap.has(item.resource_id)) {
      throw new Error(`Unknown resource_id "${item.resource_id}" in plan`);
    }

    dailyMinutes[day] = (dailyMinutes[day] || 0) + minutes;
    if (dailyMinutes[day] > maxMinutesPerDay) {
      throw new Error(`Daily minutes for Day ${day} (${dailyMinutes[day]}m) exceeds max allowed (${maxMinutesPerDay}m)`);
    }

    validPlan.push({
      day,
      task: item.task.trim(),
      minutes,
      resource_id: item.resource_id,
      status: 'not_started'
    });
  }

  // Sort activities chronologically by day
  validPlan.sort((a, b) => a.day - b.day);

  // Guardrail: Compute uncovered gaps in code by comparing gap skills against catalog resource coverage
  const coveredSkills = new Set();
  for (const r of (resources || [])) {
    for (const s of (r.skills || [])) {
      coveredSkills.add(normalizeText(s));
    }
  }

  const uncovered_gaps = (gapSkills || []).filter(
    skill => !coveredSkills.has(normalizeText(skill))
  );

  const summary = typeof result.summary === 'string' && result.summary.trim()
    ? result.summary.trim()
    : '7-day learning plan to build targeted career skills.';

  return {
    plan: validPlan,
    uncovered_gaps,
    summary
  };
}
