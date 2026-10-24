import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  quoteExistsIn,
  normalizeText,
  canonicalSkill,
  normalizeLevel,
  validateProfile,
  validateOps,
  validateExplanations,
  validatePlan,
} from '../src/validators.js';

describe('validators.js pure validation suite', () => {
  const sampleCV = `
    Amina Bekele
    Final-year student.
    Built automated data cleaning scripts using Python for customer feedback.
    pulled order records from the company database for quarterly reviews.
  `;

  const vocabulary = ['Python', 'SQL', 'Data visualization', 'Excel', 'Figma'];

  it('quoteExistsIn ignores whitespace and case', () => {
    const text = 'Built automated   DATA cleaning   scripts\nusing Python';
    const quote = 'built automated data cleaning scripts using python';
    assert.strictEqual(quoteExistsIn(text, quote), true);

    const nonExistent = 'built machine learning models';
    assert.strictEqual(quoteExistsIn(text, nonExistent), false);

    assert.strictEqual(quoteExistsIn(text, ''), false);
  });

  it('unknown skill names dropped', () => {
    const input = {
      skills: [
        {
          name: 'Python',
          level: 'working',
          evidence: 'Built automated data cleaning scripts using Python',
          weak_evidence: false,
        },
        {
          name: 'UnknownQuantumComputing',
          level: 'beginner',
          evidence: 'Built automated data cleaning scripts using Python',
          weak_evidence: false,
        },
      ],
    };

    const validated = validateProfile(input, { cvText: sampleCV, skillVocabulary: vocabulary });
    assert.strictEqual(validated.skills.length, 1);
    assert.strictEqual(validated.skills[0].name, 'Python');
  });

  it('invalid level rejected', () => {
    const input = {
      skills: [
        {
          name: 'Python',
          level: 'master-level',
          evidence: 'Built automated data cleaning scripts using Python',
          weak_evidence: false,
        },
      ],
    };

    assert.throws(() => {
      validateProfile(input, { cvText: sampleCV, skillVocabulary: vocabulary });
    }, /Invalid skill level/);
  });

  it('fake evidence quote becomes weak_evidence', () => {
    const input = {
      skills: [
        {
          name: 'Python',
          level: 'working',
          evidence: 'Completely made up evidence not in CV text at all',
          weak_evidence: false,
        },
      ],
    };

    const validated = validateProfile(input, { cvText: sampleCV, skillVocabulary: vocabulary });
    assert.strictEqual(validated.skills.length, 1);
    assert.strictEqual(validated.skills[0].weak_evidence, true);
  });

  it('plan with unknown resource_id rejected', () => {
    const resources = [
      { id: 'R-01', title: 'SQL Basics', type: 'course', minutes: 30, skills: ['SQL'] },
      { id: 'R-02', title: 'Data Viz', type: 'tutorial', minutes: 30, skills: ['Data visualization'] },
    ];

    const input = {
      plan: [
        { day: 1, task: 'Task 1', minutes: 30, resource_id: 'R-01', status: 'not_started' },
        { day: 2, task: 'Task 2', minutes: 30, resource_id: 'R-999', status: 'not_started' },
        { day: 3, task: 'Task 3', minutes: 30, resource_id: 'R-02', status: 'not_started' },
      ],
      summary: 'Test summary',
    };

    assert.throws(() => {
      validatePlan(input, { resources, gapSkills: ['SQL'] });
    }, /Unknown resource_id "R-999"/);
  });

  it('plan with fewer than 3 activities rejected', () => {
    const resources = [
      { id: 'R-01', title: 'SQL Basics', type: 'course', minutes: 30, skills: ['SQL'] },
    ];

    const input = {
      plan: [
        { day: 1, task: 'Task 1', minutes: 30, resource_id: 'R-01', status: 'not_started' },
        { day: 2, task: 'Task 2', minutes: 30, resource_id: 'R-01', status: 'not_started' },
      ],
      summary: 'Test summary',
    };

    assert.throws(() => {
      validatePlan(input, { resources, gapSkills: ['SQL'] });
    }, /Plan must contain at least 3 activities/);
  });

  it('plan over daily minutes rejected', () => {
    const resources = [
      { id: 'R-01', title: 'SQL Basics', type: 'course', minutes: 50, skills: ['SQL'] },
    ];

    const input = {
      plan: [
        { day: 1, task: 'Task 1 part 1', minutes: 60, resource_id: 'R-01', status: 'not_started' },
        { day: 1, task: 'Task 1 part 2', minutes: 40, resource_id: 'R-01', status: 'not_started' },
        { day: 2, task: 'Task 2', minutes: 30, resource_id: 'R-01', status: 'not_started' },
      ],
      summary: 'Test summary',
    };

    // Day 1 total = 100 > 90
    assert.throws(() => {
      validatePlan(input, { resources, gapSkills: ['SQL'], maxMinutesPerDay: 90 });
    }, /Daily minutes for Day 1 .* exceeds max allowed/);
  });

  it('uncovered gaps computed in code', () => {
    const resources = [
      { id: 'R-01', title: 'SQL Basics', type: 'course', minutes: 40, skills: ['SQL'] },
      { id: 'R-02', title: 'Advanced SQL', type: 'tutorial', minutes: 30, skills: ['SQL'] },
    ];

    const gapSkills = ['SQL', 'Figma'];

    // Model tries to claim empty uncovered_gaps or different gaps
    const input = {
      plan: [
        { day: 1, task: 'Task 1', minutes: 30, resource_id: 'R-01', status: 'not_started' },
        { day: 2, task: 'Task 2', minutes: 30, resource_id: 'R-02', status: 'not_started' },
        { day: 3, task: 'Task 3', minutes: 30, resource_id: 'R-01', status: 'not_started' },
      ],
      uncovered_gaps: ['SomeOtherSkill'],
      summary: 'Good summary',
    };

    const validated = validatePlan(input, { resources, gapSkills });
    // Code ignores what model returned and deterministically identifies Figma
    assert.deepStrictEqual(validated.uncovered_gaps, ['Figma']);
  });

  it('skills_to_build overwritten with the real missing skills', () => {
    const cvText = 'Built automated data cleaning scripts using Python.';
    const opportunities = [
      {
        id: 'OPP-01',
        title: 'Data Analyst',
        description: 'Requires data cleaning scripts and database querying.',
      },
    ];

    const ranked = [
      {
        id: 'OPP-01',
        title: 'Data Analyst',
        score: 85,
        matched: ['Python'],
        missing: ['SQL', 'Figma'],
      },
    ];

    // Model returns arbitrary skills_to_build
    const modelResult = {
      explanations: [
        {
          opportunity_id: 'OPP-01',
          why_fits: [
            {
              cv_quote: 'data cleaning scripts using Python',
              opportunity_quote: 'data cleaning scripts',
              note: 'Direct match for scripts.',
            },
          ],
          skills_to_build: [
            { skill: 'InventedSkill', reason: 'Some reason' },
            { skill: 'SQL', reason: 'Model provided reason for SQL' },
          ],
        },
      ],
    };

    const validated = validateExplanations(modelResult, { cvText, ranked, opportunities });
    assert.strictEqual(validated.explanations.length, 1);
    const skillsToBuild = validated.explanations[0].skills_to_build;

    // Must strictly match missing skills: SQL and Figma
    assert.strictEqual(skillsToBuild.length, 2);
    assert.strictEqual(skillsToBuild[0].skill, 'SQL');
    assert.strictEqual(skillsToBuild[0].reason, 'Model provided reason for SQL');
    assert.strictEqual(skillsToBuild[1].skill, 'Figma');
    assert.ok(skillsToBuild[1].reason.length > 0);
  });
});
