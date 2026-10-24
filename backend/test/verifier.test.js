/**
 * Unit Tests for Evidence Verifier & Plan Validation Service (M2)
 * Runs offline with zero external dependencies and zero network/credentials.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');

const {
  normalizeText,
  verifySourceReference,
  validateCvInput,
  verifyExtractedSkills,
  validatePlan
} = require('../src/services/verifier');

describe('Evidence Verifier & Input Validation (M2)', () => {

  describe('Text Normalization & Substring Proofs', () => {
    it('normalizes mixed whitespace, line breaks, tabs and casing', () => {
      const input = '  Built\n\n\ta  Scalable\tREST   API in  Python  ';
      assert.strictEqual(normalizeText(input), 'built a scalable rest api in python');
    });

    it('verifies exact quote in CV text', () => {
      const cv = 'Developed relational database schemas using PostgreSQL. Managed SQL migrations and complex joins.';
      const quote = 'Developed relational database schemas using PostgreSQL';
      assert.strictEqual(verifySourceReference(cv, quote), true);
    });

    it('verifies quote despite whitespace formatting differences between CV and extractor', () => {
      const cv = 'Built  REST APIs\n   using Node.js  and Express for a high-traffic student portal.';
      const quote = 'Built REST APIs using Node.js and Express';
      assert.strictEqual(verifySourceReference(cv, quote), true);
    });

    it('rejects fabricated or non-existent quotes', () => {
      const cv = 'Experience with Python and pandas dataframes for data manipulation.';
      const quote = 'Led a team of 10 engineers deploying Kubernetes clusters on AWS';
      assert.strictEqual(verifySourceReference(cv, quote), false);
    });

    it('handles empty or non-string inputs safely', () => {
      assert.strictEqual(verifySourceReference(null, 'some quote'), false);
      assert.strictEqual(verifySourceReference('some cv', ''), false);
      assert.strictEqual(verifySourceReference('', ''), false);
    });
  });

  describe('CV Input Validation', () => {
    it('accepts valid CV text of appropriate length', () => {
      const cv = 'Alex Rivera. Software Engineering Student with experience in Node.js, Express, and SQL query optimization. Looking for internships.';
      const result = validateCvInput(cv);
      assert.strictEqual(result.valid, true);
    });

    it('rejects empty or non-string CV inputs', () => {
      assert.strictEqual(validateCvInput('').valid, false);
      assert.strictEqual(validateCvInput(null).valid, false);
      assert.strictEqual(validateCvInput(12345).valid, false);
    });

    it('rejects CVs that are too short (<50 characters)', () => {
      const result = validateCvInput('Hi I code in python.');
      assert.strictEqual(result.valid, false);
      assert.match(result.error, /too short/i);
    });
  });

  describe('Extracted Skills Verification & Demotion', () => {
    const sampleCv = `
      Alex Rivera
      Skills: Python, SQL, Excel, HTML, CSS.
      Experience:
      - Built REST APIs in Python using FastAPI for university projects.
      - Conducted SQL performance tuning on relational databases.
    `;

    it('retains demonstrated status and marks verified: true when evidence is confirmed in CV', () => {
      const extracted = [
        {
          name: 'Python',
          status: 'demonstrated',
          evidence: 'Built REST APIs in Python using FastAPI for university projects.',
          sourceReference: 'Built REST APIs in Python using FastAPI'
        }
      ];

      const processed = verifyExtractedSkills(sampleCv, extracted);
      assert.strictEqual(processed.length, 1);
      assert.strictEqual(processed[0].name, 'Python');
      assert.strictEqual(processed[0].status, 'demonstrated');
      assert.strictEqual(processed[0].verified, true);
      assert.strictEqual(processed[0].verificationNote, undefined);
    });

    it('demotes unverified demonstrated skill to not_established without dropping it', () => {
      const extracted = [
        {
          name: 'JavaScript',
          status: 'demonstrated',
          evidence: 'Built single page apps in React and TypeScript.',
          sourceReference: 'Architected micro-frontends with React and TypeScript in production' // Fabricated quote
        }
      ];

      const processed = verifyExtractedSkills(sampleCv, extracted);
      assert.strictEqual(processed.length, 1);
      assert.strictEqual(processed[0].name, 'JavaScript');
      // Status must be demoted, NOT dropped
      assert.strictEqual(processed[0].status, 'not_established');
      assert.strictEqual(processed[0].verified, false);
      assert.ok(processed[0].verificationNote.includes('demoted from demonstrated to not_established'));
    });
  });

  describe('7-Day Plan Invariants Validation', () => {
    const validPlanPayload = {
      opportunityId: 'OPP001',
      studentConfirmed: true,
      plan: {
        title: '7-Day Data Analyst Accelerator',
        activities: [
          {
            day: 1,
            title: 'Data Cleaning Essentials',
            durationMinutes: 45,
            resourceIds: ['LR01']
          },
          {
            day: 3,
            title: 'Advanced SQL Query Lab',
            durationMinutes: 45,
            resourceIds: ['LR02']
          },
          {
            day: 5,
            title: 'Data Visualization Techniques',
            durationMinutes: 45,
            resourceIds: ['LR03']
          }
        ]
      }
    };

    it('accepts a fully compliant 7-day development plan', () => {
      const result = validatePlan(validPlanPayload);
      assert.strictEqual(result.valid, true);
      assert.deepStrictEqual(result.errors, []);
    });

    it('rejects plan if studentConfirmed is false', () => {
      const unconfirmed = {
        ...validPlanPayload,
        studentConfirmed: false
      };
      const result = validatePlan(unconfirmed);
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('explicit student confirmation')));
    });

    it('rejects plan if opportunityId does not exist', () => {
      const invalidOpp = {
        ...validPlanPayload,
        opportunityId: 'NON_EXISTENT_OPP_999'
      };
      const result = validatePlan(invalidOpp);
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('does not exist in valid opportunities')));
    });

    it('rejects plan with fewer than 3 activities', () => {
      const fewActivities = {
        ...validPlanPayload,
        plan: {
          title: 'Too short plan',
          activities: [
            { day: 1, title: 'Day 1', durationMinutes: 45, resourceIds: ['LR01'] },
            { day: 2, title: 'Day 2', durationMinutes: 45, resourceIds: ['LR02'] }
          ]
        }
      };
      const result = validatePlan(fewActivities);
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('at least 3 activities')));
    });

    it('rejects activity with day outside 1–7', () => {
      const invalidDay = {
        ...validPlanPayload,
        plan: {
          title: 'Invalid Day Plan',
          activities: [
            { day: 0, title: 'Day 0', durationMinutes: 45, resourceIds: ['LR01'] },
            { day: 4, title: 'Day 4', durationMinutes: 45, resourceIds: ['LR02'] },
            { day: 8, title: 'Day 8', durationMinutes: 45, resourceIds: ['LR03'] }
          ]
        }
      };
      const result = validatePlan(invalidDay);
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('between 1 and 7')));
    });

    it('rejects non-existent resource IDs', () => {
      const badResource = {
        ...validPlanPayload,
        plan: {
          title: 'Plan with bad resource',
          activities: [
            { day: 1, title: 'Day 1', durationMinutes: 45, resourceIds: ['LR999_FAKE'] },
            { day: 2, title: 'Day 2', durationMinutes: 45, resourceIds: ['LR02'] },
            { day: 3, title: 'Day 3', durationMinutes: 45, resourceIds: ['LR03'] }
          ]
        }
      };
      const result = validatePlan(badResource);
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('non-existent resource ID: "LR999_FAKE"')));
    });

    it('rejects activity with invalid duration (<15 or >300 min)', () => {
      const badDuration = {
        ...validPlanPayload,
        plan: {
          title: 'Plan with bad duration',
          activities: [
            { day: 1, title: 'Day 1', durationMinutes: 5, resourceIds: ['LR01'] },
            { day: 2, title: 'Day 2', durationMinutes: 500, resourceIds: ['LR02'] },
            { day: 3, title: 'Day 3', durationMinutes: 45, resourceIds: ['LR03'] }
          ]
        }
      };
      const result = validatePlan(badDuration);
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('duration must be an integer between 15 and 300')));
    });
  });
});

