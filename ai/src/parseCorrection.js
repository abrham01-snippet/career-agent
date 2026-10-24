import { askValidated } from './client.js';
import { CORRECTION_SYSTEM } from './prompts.js';
import { validateOps } from './validators.js';

/**
 * Translates student natural-language feedback into atomic profile correction operations.
 * Guardrails:
 * - Empty or unclear requests safely resolve to empty ops array without crashing.
 * - Allowed ops are strictly restricted to valid profile skills and vocabulary terms.
 *
 * @param {Object} params
 * @param {string} params.message
 * @param {Object} params.profile
 * @param {string[]} params.skillVocabulary
 * @returns {Promise<{ ops: Array<{ op: 'remove'|'add'|'set_level', name: string, level?: string }> }>}
 */
export async function parseCorrection({ message, profile, skillVocabulary }) {
  // Guardrail: Gracefully handle empty or non-string correction messages
  if (typeof message !== 'string' || !message.trim()) {
    return { ops: [] };
  }

  const safeProfile = profile && typeof profile === 'object' ? profile : { skills: [] };
  const safeVocabulary = Array.isArray(skillVocabulary) ? skillVocabulary : [];

  const userPrompt = `Current Profile Skills:\n${JSON.stringify(safeProfile.skills || [], null, 2)}\n\nApproved Skill Vocabulary:\n${JSON.stringify(safeVocabulary, null, 2)}\n\nStudent Message:\n"${message.trim()}"\n\nGenerate the correction operations. If unclear or not applicable, return {"ops": []}.`;

  // Guardrail: Validate all operations against profile state and vocabulary
  return await askValidated({
    system: CORRECTION_SYSTEM,
    user: userPrompt,
    validate: (res) => validateOps(res, { profile: safeProfile, skillVocabulary: safeVocabulary }),
  });
}
