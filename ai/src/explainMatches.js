import { askValidated } from './client.js';
import { EXPLAIN_SYSTEM } from './prompts.js';
import { validateExplanations } from './validators.js';

/**
 * Generates quote-backed explanations for why candidate CV matches ranked opportunities.
 * Guardrails:
 * - Match scores are never exposed or altered in student explanations.
 * - Explanations must be backed by exact quotes from both CV and Opportunity description.
 * - Missing skills are strictly bound to backend scoring results.
 *
 * @param {Object} params
 * @param {Object} params.profile
 * @param {string} params.cvText
 * @param {Array<{ id: string, title: string, score: number, matched: string[], missing: string[] }>} params.ranked
 * @param {Array<{ id: string, title: string, description: string }>} params.opportunities
 * @returns {Promise<{ explanations: Array<{ opportunity_id: string, why_fits: Array<{ cv_quote: string, opportunity_quote: string, note: string }>, skills_to_build: Array<{ skill: string, reason: string }> }> }>}
 */
export async function explainMatches({ profile, cvText, ranked, opportunities }) {
  // Guardrail: Verify presence of ranked opportunities and CV content
  if (!Array.isArray(ranked) || ranked.length === 0) {
    throw new Error('ranked must be a non-empty array of scored opportunities');
  }
  if (typeof cvText !== 'string' || !cvText.trim()) {
    throw new Error('cvText must be a non-empty string');
  }
  if (!Array.isArray(opportunities) || opportunities.length === 0) {
    throw new Error('opportunities must be a non-empty array');
  }

  // Provide opportunity descriptions and matched/missing skill metadata without exposing numerical score mechanics
  const sanitizedRanked = ranked.map(r => ({
    id: r.id,
    title: r.title,
    matched: r.matched || [],
    missing: r.missing || []
  }));

  const userPrompt = `Student CV Text:\n${cvText}\n\nStudent Profile:\n${JSON.stringify(profile?.skills || [], null, 2)}\n\nRanked Opportunities (Top Matches):\n${JSON.stringify(sanitizedRanked, null, 2)}\n\nOpportunity Details:\n${JSON.stringify(opportunities, null, 2)}\n\nExplain why the student fits each opportunity using exact quotes from the CV and description, and explain why missing skills are needed.`;

  // Guardrail: Validate quotes existence in CV and descriptions, and overwrite skills_to_build with exact missing list
  return await askValidated({
    system: EXPLAIN_SYSTEM,
    user: userPrompt,
    validate: (res) => validateExplanations(res, { cvText, ranked, opportunities }),
  });
}
