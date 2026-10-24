/**
 * Unit Tests for Deterministic Scoring Service
 * Uses Node.js built-in test runner (node:test, node:assert)
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');

const { scoreOpportunities, scoreOpportunity, buildSkillMap, SKILL_CREDITS } = require('../src/services/scoring');
const { OPPORTUNITIES } = require('../src/data/opportunities');
const { normalize, isCanonical } = require('../src/data/skills');

describe('Deterministic Scoring Service', () => {

  describe('Skill Normalization & Aliases', () => {
    it('normalizes canonical skills regardless of casing and whitespace', () => {
      assert.strictEqual(normalize('  python  '), 'Python');
      assert.strictEqual(normalize('SQL'), 'SQL');
      assert.strictEqual(normalize('html'), 'HTML');
      assert.strictEqual(normalize('Data Cleaning'), 'Data cleaning');
    });

    it('resolves skill aliases correctly to canonical names', () => {
      assert.strictEqual(normalize('js'), 'JavaScript');
      assert.strictEqual(normalize('github'), 'Git');
      assert.strictEqual(normalize('postgres'), 'SQL');
      assert.strictEqual(normalize('spreadsheets'), 'Excel');
      assert.strictEqual(normalize('rest api'), 'API basics');
      assert.strictEqual(normalize('unit testing'), 'Testing fundamentals');
    });

    it('returns null for unknown skills and invalid inputs', () => {
      assert.strictEqual(normalize('QuantumComputing'), null);
      assert.strictEqual(normalize(''), null);
      assert.strictEqual(normalize(null), null);
      assert.strictEqual(normalize(undefined), null);
    });

    it('identifies canonical skills with isCanonical', () => {
      assert.strictEqual(isCanonical('Python'), true);
      assert.strictEqual(isCanonical('JavaScript'), true);
      assert.strictEqual(isCanonical('js'), false);
    });
  });

  describe('Hand-Computed Oracle: Baseline Profile', () => {
    // Profile: Python, SQL, HTML, CSS demonstrated; Excel listed.
    const baselineProfile = [
      { name: 'Python', status: 'demonstrated' },
      { name: 'SQL', status: 'demonstrated' },
      { name: 'HTML', status: 'demonstrated' },
      { name: 'CSS', status: 'demonstrated' },
      { name: 'Excel', status: 'listed' }
    ];

    it('computes exact expected rounded scores: OPP001: 67, OPP002: 53, OPP004: 40, OPP003: 27, OPP005: 0', () => {
      const results = scoreOpportunities(baselineProfile, OPPORTUNITIES);

      // Verify sorted order
      const ids = results.map(r => r.id);
      assert.deepStrictEqual(ids, ['OPP001', 'OPP002', 'OPP004', 'OPP003', 'OPP005']);

      // Map results for direct score assertions
      const scoreMap = Object.fromEntries(results.map(r => [r.id, r.score]));

      assert.strictEqual(scoreMap['OPP001'], 67, 'OPP001 score must be 67');
      assert.strictEqual(scoreMap['OPP002'], 53, 'OPP002 score must be 53');
      assert.strictEqual(scoreMap['OPP004'], 40, 'OPP004 score must be 40');
      assert.strictEqual(scoreMap['OPP003'], 27, 'OPP003 score must be 27');
      assert.strictEqual(scoreMap['OPP005'], 0, 'OPP005 score must be 0');
    });

    it('separates full matches from partial matches and missing skills for OPP001', () => {
      const results = scoreOpportunities(baselineProfile, OPPORTUNITIES);
      const opp1 = results.find(r => r.id === 'OPP001');

      // Full matches (credit === 1.0)
      assert.deepStrictEqual([...opp1.matchedRequired], ['Python', 'SQL']);
      // Partial matches (0 < credit < 1.0)
      assert.deepStrictEqual([...opp1.partialRequired], ['Excel']);
      // Missing required (credit === 0)
      assert.deepStrictEqual([...opp1.missingRequired], []);

      // Preferred skills breakdown
      assert.deepStrictEqual([...opp1.matchedPreferred], []);
      assert.deepStrictEqual([...opp1.partialPreferred], []);
      assert.deepStrictEqual([...opp1.missingPreferred], ['Data visualization']);
    });

    it('separates full matches from missing skills for OPP002', () => {
      const results = scoreOpportunities(baselineProfile, OPPORTUNITIES);
      const opp2 = results.find(r => r.id === 'OPP002');

      assert.deepStrictEqual([...opp2.matchedRequired], ['HTML', 'CSS']);
      assert.deepStrictEqual([...opp2.partialRequired], []);
      assert.deepStrictEqual([...opp2.missingRequired], ['JavaScript']);

      assert.deepStrictEqual([...opp2.matchedPreferred], []);
      assert.deepStrictEqual([...opp2.partialPreferred], []);
      assert.deepStrictEqual([...opp2.missingPreferred], ['Git']);
    });
  });

  describe('Hand-Computed Oracle: Profile Progression & Top Opportunity Change', () => {
    const baselineProfile = [
      { name: 'Python', status: 'demonstrated' },
      { name: 'SQL', status: 'demonstrated' },
      { name: 'HTML', status: 'demonstrated' },
      { name: 'CSS', status: 'demonstrated' },
      { name: 'Excel', status: 'listed' }
    ];

    it('flips the top-ranked opportunity to OPP002 when Git is confirmed before Excel upgrade', () => {
      const intermediateProfile = [
        ...baselineProfile,
        { name: 'Git', status: 'student_confirmed' }
      ];

      const results = scoreOpportunities(intermediateProfile, OPPORTUNITIES);

      // OPP002 should now have score 73 (100*(0.8*(2/3) + 0.2*1.0) = 73.33)
      // OPP001 remains at 66.67 (rounded 67)
      assert.strictEqual(results[0].id, 'OPP002', 'Top ranked opportunity should flip to OPP002');
      assert.strictEqual(results[0].score, 73);
      assert.strictEqual(results[1].id, 'OPP001');
      assert.strictEqual(results[1].score, 67);

      // Check OPP002 preferred skill is now a full match
      assert.deepStrictEqual([...results[0].matchedPreferred], ['Git']);
      assert.deepStrictEqual([...results[0].partialPreferred], []);
    });

    it('computes exact expected scores when Git and Excel are student_confirmed: OPP001 80, OPP002 73, OPP004 60, OPP003 53, OPP005 0', () => {
      const confirmedProfile = [
        { name: 'Python', status: 'demonstrated' },
        { name: 'SQL', status: 'demonstrated' },
        { name: 'HTML', status: 'demonstrated' },
        { name: 'CSS', status: 'demonstrated' },
        { name: 'Excel', status: 'student_confirmed' },
        { name: 'Git', status: 'student_confirmed' }
      ];

      const results = scoreOpportunities(confirmedProfile, OPPORTUNITIES);
      const scoreMap = Object.fromEntries(results.map(r => [r.id, r.score]));

      assert.strictEqual(scoreMap['OPP001'], 80, 'OPP001 score must be 80');
      assert.strictEqual(scoreMap['OPP002'], 73, 'OPP002 score must be 73');
      assert.strictEqual(scoreMap['OPP004'], 60, 'OPP004 score must be 60');
      assert.strictEqual(scoreMap['OPP003'], 53, 'OPP003 score must be 53');
      assert.strictEqual(scoreMap['OPP005'], 0, 'OPP005 score must be 0');

      // OPP001 reclaims top rank; Excel is now a full match, not partial
      assert.strictEqual(results[0].id, 'OPP001');
      assert.deepStrictEqual([...results[0].matchedRequired], ['Python', 'SQL', 'Excel']);
      assert.deepStrictEqual([...results[0].partialRequired], []);

      assert.strictEqual(results[1].id, 'OPP002');
      assert.strictEqual(results[2].id, 'OPP004');
      assert.strictEqual(results[3].id, 'OPP003');
      assert.strictEqual(results[4].id, 'OPP005');
    });
  });

  describe('Edge Cases', () => {
    it('handles an empty profile safely (all scores 0, ties broken by id)', () => {
      const results = scoreOpportunities([]);
      assert.strictEqual(results.length, 5);

      for (const res of results) {
        assert.strictEqual(res.score, 0);
        assert.strictEqual(res.rawScore, 0);
        assert.strictEqual(res.matchedRequired.length, 0);
        assert.strictEqual(res.partialRequired.length, 0);
      }

      // Tie-break by ID ascending
      assert.deepStrictEqual(results.map(r => r.id), ['OPP001', 'OPP002', 'OPP003', 'OPP004', 'OPP005']);
    });

    it('deduplicates skills and retains the highest credit tier', () => {
      // Profile has listed Python (0.5) then demonstrated Python (1.0)
      const profile = [
        { name: 'Python', status: 'listed' },
        { name: 'Python', status: 'demonstrated' }
      ];

      const skillMap = buildSkillMap(profile);
      assert.strictEqual(skillMap.get('Python').credit, 1.0);
      assert.strictEqual(skillMap.get('Python').status, 'demonstrated');

      // OPP004 requires Python and Testing fundamentals
      const opp4 = OPPORTUNITIES.find(o => o.id === 'OPP004');
      const scored = scoreOpportunity(skillMap, opp4);
      assert.strictEqual(scored.score, 40);
      assert.deepStrictEqual([...scored.matchedRequired], ['Python']);
      assert.deepStrictEqual([...scored.partialRequired], []);
    });

    it('matches aliases transparently', () => {
      const profile = [
        { name: 'js', status: 'demonstrated' },
        { name: 'github', status: 'student_confirmed' }
      ];

      const skillMap = buildSkillMap(profile);
      assert.strictEqual(skillMap.has('JavaScript'), true);
      assert.strictEqual(skillMap.has('Git'), true);

      const opp2 = OPPORTUNITIES.find(o => o.id === 'OPP002');
      const scored = scoreOpportunity(skillMap, opp2);
      assert.ok(scored.matchedRequired.includes('JavaScript'));
      assert.ok(scored.matchedPreferred.includes('Git'));
    });

    it('handles partial preferred matches when a preferred skill is listed', () => {
      // Profile has HTML and CSS demonstrated, Git listed (0.5 credit)
      const profile = [
        { name: 'HTML', status: 'demonstrated' },
        { name: 'CSS', status: 'demonstrated' },
        { name: 'Git', status: 'listed' }
      ];

      const opp2 = OPPORTUNITIES.find(o => o.id === 'OPP002');
      const skillMap = buildSkillMap(profile);
      const scored = scoreOpportunity(skillMap, opp2);

      // Preferred Git should be in partialPreferred, not matchedPreferred
      assert.deepStrictEqual([...scored.matchedPreferred], []);
      assert.deepStrictEqual([...scored.partialPreferred], ['Git']);
      assert.deepStrictEqual([...scored.missingPreferred], []);

      // Score: 100*(0.8*(2/3) + 0.2*(0.5/1)) = 100*(0.5333 + 0.1) = 63.33 -> 63
      assert.strictEqual(scored.score, 63);
    });

    it('gracefully ignores unknown skills without throwing', () => {
      const profile = [
        { name: 'UnderwaterBasketWeaving', status: 'demonstrated' },
        { name: 'SomeFantasySkill', status: 'listed' }
      ];

      const results = scoreOpportunities(profile);
      assert.strictEqual(results.length, 5);
      for (const res of results) {
        assert.strictEqual(res.score, 0);
      }
    });

    it('never mutates input objects or arrays', () => {
      const originalProfile = [
        { name: 'Python', status: 'demonstrated' },
        { name: 'SQL', status: 'listed' }
      ];
      const clonedProfile = JSON.parse(JSON.stringify(originalProfile));

      const originalOpps = JSON.parse(JSON.stringify(OPPORTUNITIES));

      // Execute scoring
      scoreOpportunities(originalProfile, OPPORTUNITIES);

      // Verify inputs remain completely untouched
      assert.deepStrictEqual(originalProfile, clonedProfile);
      assert.deepStrictEqual(OPPORTUNITIES, originalOpps);
    });
  });
});
