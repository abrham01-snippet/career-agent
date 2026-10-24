import { askValidated } from './client.js';
import { EXTRACT_SYSTEM } from './prompts.js';
import { validateProfile } from './validators.js';

/**
 * Extracts student skills from CV text mapped to an approved skill vocabulary.
 * Guardrails:
 * - Vocabulary restriction prevents arbitrary model skill hallucination.
 * - CV quote validation prevents hallucinated work experience.
 * - Input validation rejects empty CV or vocabulary.
 *
 * @param {Object} params
 * @param {string} params.cvText
 * @param {string[]} params.skillVocabulary
 * @returns {Promise<{ skills: Array<{ name: string, level: string, evidence: string, weak_evidence: boolean }> }>}
 */
export async function extractProfile({ cvText, skillVocabulary }) {
  // Guardrail: Ensure input types are valid before sending to LLM
  if (typeof cvText !== 'string' || !cvText.trim()) {
    throw new Error('cvText must be a non-empty string');
  }
  if (!Array.isArray(skillVocabulary) || skillVocabulary.length === 0) {
    throw new Error('skillVocabulary must be a non-empty array of skill strings');
  }

  const userPrompt = `Approved Skill Vocabulary:\n${JSON.stringify(skillVocabulary, null, 2)}\n\nStudent CV Text:\n${cvText}\n\nExtract the skills present in this CV that exist in the approved vocabulary.`;

  // Guardrail: Validates output shape, vocabulary spelling, level constraints, and evidence truthfulness
  return await askValidated({
    system: EXTRACT_SYSTEM,
    user: userPrompt,
    validate: (res) => validateProfile(res, { cvText, skillVocabulary }),
  });
}
