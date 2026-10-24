import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  extractProfile,
  parseCorrection,
  explainMatches,
  draftPlan,
  editPlan,
} from '../stubs/index.js';

describe('stubs/index.js shared JSON shapes test', () => {
  it('extractProfile stub matches Profile shape', async () => {
    const res = await extractProfile();
    assert.ok(Array.isArray(res.skills), 'Profile must have skills array');
    assert.ok(res.skills.length > 0, 'Profile skills should not be empty');

    for (const skill of res.skills) {
      assert.ok('name' in skill, 'Skill must have name');
      assert.ok('level' in skill, 'Skill must have level');
      assert.ok(['beginner', 'working', 'strong'].includes(skill.level), 'Level must be beginner|working|strong');
      assert.ok('evidence' in skill, 'Skill must have evidence');
      assert.ok('weak_evidence' in skill, 'Skill must have weak_evidence boolean');
      assert.strictEqual(typeof skill.weak_evidence, 'boolean');
    }
  });

  it('parseCorrection stub matches Corrections shape', async () => {
    const res = await parseCorrection();
    assert.ok(Array.isArray(res.ops), 'Corrections must have ops array');

    for (const op of res.ops) {
      assert.ok(['remove', 'add', 'set_level'].includes(op.op), 'op must be remove|add|set_level');
      assert.ok('name' in op, 'op must have skill name');
      if (op.level) {
        assert.ok(['beginner', 'working', 'strong'].includes(op.level), 'level must be valid');
      }
    }
  });

  it('explainMatches stub matches Explanations shape', async () => {
    const res = await explainMatches();
    assert.ok(Array.isArray(res.explanations), 'Explanations must have explanations array');
    assert.ok(res.explanations.length > 0);

    for (const item of res.explanations) {
      assert.ok('opportunity_id' in item, 'Explanation must have opportunity_id');
      assert.ok(Array.isArray(item.why_fits), 'why_fits must be an array');
      for (const w of item.why_fits) {
        assert.ok('cv_quote' in w, 'why_fits item must have cv_quote');
        assert.ok('opportunity_quote' in w, 'why_fits item must have opportunity_quote');
        assert.ok('note' in w, 'why_fits item must have note');
      }

      assert.ok(Array.isArray(item.skills_to_build), 'skills_to_build must be an array');
      for (const s of item.skills_to_build) {
        assert.ok('skill' in s, 'skills_to_build item must have skill');
        assert.ok('reason' in s, 'skills_to_build item must have reason');
      }
    }
  });

  it('draftPlan stub matches Plan shape with 3 activities using R-01, R-02, R-03', async () => {
    const res = await draftPlan();
    assert.ok(Array.isArray(res.plan), 'Plan must have plan array');
    assert.strictEqual(res.plan.length, 3, 'Plan stub should have 3 activities');
    assert.ok(Array.isArray(res.uncovered_gaps), 'Plan must have uncovered_gaps array');
    assert.ok('summary' in res, 'Plan must have summary');

    const expectedResources = ['R-01', 'R-02', 'R-03'];
    res.plan.forEach((activity, idx) => {
      assert.ok('day' in activity, 'Activity must have day');
      assert.ok('task' in activity, 'Activity must have task');
      assert.ok('minutes' in activity, 'Activity must have minutes');
      assert.ok('resource_id' in activity, 'Activity must have resource_id');
      assert.strictEqual(activity.resource_id, expectedResources[idx]);
      assert.strictEqual(activity.status, 'not_started', 'Status must be not_started');
    });
  });

  it('editPlan stub matches Plan shape', async () => {
    const res = await editPlan();
    assert.ok(Array.isArray(res.plan), 'Plan must have plan array');
    assert.ok(Array.isArray(res.uncovered_gaps), 'Plan must have uncovered_gaps array');
    assert.ok('summary' in res, 'Plan must have summary');

    for (const activity of res.plan) {
      assert.ok('day' in activity);
      assert.ok('task' in activity);
      assert.ok('minutes' in activity);
      assert.ok('resource_id' in activity);
      assert.strictEqual(activity.status, 'not_started');
    }
  });
});
