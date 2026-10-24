/**
 * AI Internal Agent Tools
 * AI Career Development Agent
 *
 * Implements Tool 1: search_and_score_opportunities
 * Enforces bounded execution loops with hard caps preventing infinite tool calls.
 */

const { scoreOpportunities } = require('../services/scoring');
const { OPPORTUNITIES } = require('../data/opportunities');

// Tool 1 Declaration for model tool-calling schemas
const SEARCH_AND_SCORE_DECLARATION = {
  name: 'search_and_score_opportunities',
  description: 'Ranks demonstration internship opportunities against confirmed student profile skills using deterministic scoring logic.',
  parameters: {
    type: 'OBJECT',
    properties: {
      limit: {
        type: 'INTEGER',
        description: 'Maximum number of top opportunities to return (1-5, default: 5)'
      }
    }
  }
};

/**
 * Bounded execution loop tracker enforcing hard caps on model iterations and tool calls.
 */
class BoundedToolLoop {
  constructor({ maxIterations = 3, maxToolCalls = 5 } = {}) {
    this.maxIterations = maxIterations;
    this.maxToolCalls = maxToolCalls;
    this.iterations = 0;
    this.toolCalls = 0;
    this.history = [];
  }

  recordIteration() {
    this.iterations++;
    if (this.iterations > this.maxIterations) {
      const error = new Error(`Bounded loop limit exceeded: maximum ${this.maxIterations} iterations allowed.`);
      error.code = 'MAX_ITERATIONS_EXCEEDED';
      error.status = 429;
      throw error;
    }
  }

  recordCall(toolName, input = {}) {
    this.toolCalls++;
    if (this.toolCalls > this.maxToolCalls) {
      const error = new Error(`Bounded loop limit exceeded: maximum ${this.maxToolCalls} tool calls allowed.`);
      error.code = 'MAX_TOOL_CALLS_EXCEEDED';
      error.status = 429;
      throw error;
    }

    const record = {
      tool: toolName,
      input,
      timestamp: new Date().toISOString()
    };
    this.history.push(record);
    return record;
  }

  getLog() {
    return [...this.history];
  }
}

/**
 * Tool 1: search_and_score_opportunities
 * Executes deterministic scoring over opportunities using student skills from the confirmed profile.
 *
 * @param {Object} [params={}] Arguments passed by model or caller (e.g. { limit })
 * @param {Object} context Execution context injected by server ({ profile, loopTracker })
 * @returns {Object} Ranked opportunities with match breakdowns
 */
function searchAndScoreOpportunities(params = {}, context = {}) {
  // Enforce bounded loop hard cap if tracker is present
  if (context.loopTracker) {
    context.loopTracker.recordCall('search_and_score_opportunities', params);
  }

  const profile = context.profile || params.profile;
  if (!profile) {
    const error = new Error('Confirmed student profile is required to run search_and_score_opportunities.');
    error.code = 'MISSING_PROFILE';
    error.status = 400;
    throw error;
  }

  if (profile.status !== 'confirmed') {
    const error = new Error('Profile must be confirmed before ranking opportunities.');
    error.code = 'UNCONFIRMED_PROFILE';
    error.status = 400;
    throw error;
  }

  const skills = Array.isArray(profile.skills) ? profile.skills : [];
  const rawLimit = Number(params.limit);
  const limit = Number.isInteger(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, OPPORTUNITIES.length) : 5;

  // Run pure deterministic scoring
  const ranked = scoreOpportunities(skills, OPPORTUNITIES);
  const topResults = ranked.slice(0, limit);

  return {
    tool: 'search_and_score_opportunities',
    totalEvaluated: OPPORTUNITIES.length,
    returnedCount: topResults.length,
    opportunities: topResults
  };
}

module.exports = {
  SEARCH_AND_SCORE_DECLARATION,
  BoundedToolLoop,
  searchAndScoreOpportunities
};

