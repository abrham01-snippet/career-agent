/**
 * Stub implementations of the 5 CareerPath AI functions.
 * Returns hardcoded JSON conforming strictly to the shared schemas,
 * allowing frontend and backend development in parallel without model dependencies.
 */

export async function extractProfile({ cvText, skillVocabulary } = {}) {
  return {
    skills: [
      {
        name: 'Python',
        level: 'working',
        evidence: 'Built automated data cleaning scripts using Python',
        weak_evidence: false,
      },
      {
        name: 'Data visualization',
        level: 'working',
        evidence: 'Designed interactive dashboards for weekly sales reviews',
        weak_evidence: false,
      },
      {
        name: 'SQL',
        level: 'beginner',
        evidence: 'pulled order records from the company database',
        weak_evidence: true,
      },
    ],
  };
}

export async function parseCorrection({ message, profile, skillVocabulary } = {}) {
  return {
    ops: [
      {
        op: 'remove',
        name: 'SQL',
      },
      {
        op: 'add',
        name: 'Figma',
        level: 'working',
      },
    ],
  };
}

export async function explainMatches({ profile, cvText, ranked, opportunities } = {}) {
  return {
    explanations: [
      {
        opportunity_id: 'OPP-01',
        why_fits: [
          {
            cv_quote: 'Designed interactive dashboards for weekly sales reviews',
            opportunity_quote: 'Deliver clear dashboards that inform team decisions',
            note: 'Your experience creating dashboard reports fits this role requirement directly.',
          },
        ],
        skills_to_build: [
          {
            skill: 'SQL',
            reason: 'Essential for running queries against production analytics tables.',
          },
          {
            skill: 'Figma',
            reason: 'Used for wireframing metric visual layouts before building.',
          },
        ],
      },
    ],
  };
}

export async function draftPlan({ profile, opportunity, gapSkills, resources, maxMinutesPerDay = 90 } = {}) {
  return {
    plan: [
      {
        day: 1,
        task: 'Complete introductory queries in R-01',
        minutes: 30,
        resource_id: 'R-01',
        status: 'not_started',
      },
      {
        day: 2,
        task: 'Follow indexing exercises in R-02',
        minutes: 45,
        resource_id: 'R-02',
        status: 'not_started',
      },
      {
        day: 3,
        task: 'Build dashboard prototype using R-03',
        minutes: 40,
        resource_id: 'R-03',
        status: 'not_started',
      },
    ],
    uncovered_gaps: ['Figma'],
    summary: 'Structured 7-day starter plan targeting core analytics skills.',
  };
}

export async function editPlan({ currentPlan, instruction, resources, gapSkills = [], maxMinutesPerDay = 90 } = {}) {
  return {
    plan: [
      {
        day: 1,
        task: 'Complete introductory queries in R-01',
        minutes: 30,
        resource_id: 'R-01',
        status: 'not_started',
      },
      {
        day: 2,
        task: 'Complete a lighter review of indexing in R-02',
        minutes: 20,
        resource_id: 'R-02',
        status: 'not_started',
      },
      {
        day: 3,
        task: 'Build dashboard prototype using R-03',
        minutes: 40,
        resource_id: 'R-03',
        status: 'not_started',
      },
    ],
    uncovered_gaps: ['Figma'],
    summary: 'Adjusted 7-day plan with reduced Day 2 workload.',
  };
}
