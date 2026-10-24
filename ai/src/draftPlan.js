import { askValidated } from './client.js';
import { PLAN_SYSTEM } from './prompts.js';
import { validatePlan } from './validators.js';

/**
 * Creates a structured 7-day learning plan to cover gap skills using specific available resources.
 * Guardrails:
 * - Resource IDs are strictly limited to provided resources catalog.
 * - Maximum daily study minutes are checked to prevent student burnout.
 * - Uncovered gaps are calculated deterministically in code.
 *
 * @param {Object} params
 * @param {Object} params.profile
 * @param {Object} params.opportunity
 * @param {string[]} params.gapSkills
 * @param {Array<{ id: string, title: string, type: string, minutes: number, skills: string[] }>} params.resources
 * @param {number} [params.maxMinutesPerDay=90]
 * @returns {Promise<{ plan: Array<{ day: number, task: string, minutes: number, resource_id: string, status: string }>, uncovered_gaps: string[], summary: string }>}
 */
export async function draftPlan({ profile, opportunity, gapSkills, resources, maxMinutesPerDay = 90 }) {
  // Guardrail: Validate required input catalogs
  if (!Array.isArray(resources) || resources.length === 0) {
    throw new Error('resources must be a non-empty array of available learning materials');
  }
  if (!Array.isArray(gapSkills)) {
    throw new Error('gapSkills must be an array of skill names');
  }

  const userPrompt = `Target Opportunity:\n${JSON.stringify(opportunity, null, 2)}\n\nStudent Profile:\n${JSON.stringify(profile?.skills || [], null, 2)}\n\nGap Skills to Address:\n${JSON.stringify(gapSkills, null, 2)}\n\nAvailable Resources (use only these IDs):\n${JSON.stringify(resources, null, 2)}\n\nConstraints:\nMax minutes per day: ${maxMinutesPerDay}\n7-day plan with at least 3 actionable activities.\n\nCreate the 7-day learning plan.`;

  // Guardrail: Enforce resource ID validity, daily minute limits, and recalculate uncovered gaps in code
  return await askValidated({
    system: PLAN_SYSTEM,
    user: userPrompt,
    validate: (res) => validatePlan(res, { resources, gapSkills, maxMinutesPerDay }),
  });
}
