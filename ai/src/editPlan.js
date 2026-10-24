import { askValidated } from './client.js';
import { EDIT_SYSTEM } from './prompts.js';
import { validatePlan } from './validators.js';

/**
 * Edits an existing 7-day learning plan based on natural language student instructions.
 * Guardrails:
 * - Unchanged days must be preserved as closely as possible.
 * - Modifications must adhere to resource catalog constraints and daily minute limits.
 * - Uncovered gaps are recomputed in code.
 *
 * @param {Object} params
 * @param {Object} params.currentPlan
 * @param {string} params.instruction
 * @param {Array<{ id: string, title: string, type: string, minutes: number, skills: string[] }>} params.resources
 * @param {string[]} [params.gapSkills=[]]
 * @param {number} [params.maxMinutesPerDay=90]
 * @returns {Promise<{ plan: Array<{ day: number, task: string, minutes: number, resource_id: string, status: string }>, uncovered_gaps: string[], summary: string }>}
 */
export async function editPlan({ currentPlan, instruction, resources, gapSkills = [], maxMinutesPerDay = 90 }) {
  // Guardrail: Validate plan structure and instruction presence
  if (!currentPlan || !Array.isArray(currentPlan.plan)) {
    throw new Error('currentPlan must contain a valid plan array');
  }
  if (typeof instruction !== 'string' || !instruction.trim()) {
    throw new Error('instruction must be a non-empty string');
  }
  if (!Array.isArray(resources) || resources.length === 0) {
    throw new Error('resources must be a non-empty array');
  }

  const userPrompt = `Current 7-Day Plan:\n${JSON.stringify(currentPlan, null, 2)}\n\nStudent Modification Request:\n"${instruction.trim()}"\n\nAvailable Resources (use only these IDs):\n${JSON.stringify(resources, null, 2)}\n\nConstraints:\nMax minutes per day: ${maxMinutesPerDay}\nKeep unchanged days exactly as they were.\n\nUpdate the plan.`;

  // Guardrail: Ensure plan validity, resource constraints, and accurate gap coverage
  return await askValidated({
    system: EDIT_SYSTEM,
    user: userPrompt,
    validate: (res) => validatePlan(res, { resources, gapSkills, maxMinutesPerDay }),
  });
}
