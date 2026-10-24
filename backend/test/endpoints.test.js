const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const request = require('http');
const app = require('../server.js');

describe('Full-Stack Backend 15 Specification Endpoints', () => {
  let server;
  let baseUrl;

  test.before(async () => {
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://localhost:${port}`;
        resolve();
      });
    });
  });

  test.after(() => {
    if (server) server.close();
  });

  async function post(endpoint, body) {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return { status: res.status, data: await res.json() };
  }

  async function get(endpoint) {
    const res = await fetch(`${baseUrl}${endpoint}`);
    return { status: res.status, data: await res.json() };
  }

  async function patch(endpoint, body) {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return { status: res.status, data: await res.json() };
  }

  // 1. GET /health
  test('1. GET /api/health returns ok', async () => {
    const res = await get('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.data.status, 'ok');
  });

  // 2. POST /session
  test('2. POST /api/session initializes session', async () => {
    const res = await post('/api/session', { sessionId: 'test-sess-1' });
    assert.equal(res.status, 200);
    assert.equal(res.data.sessionId, 'test-sess-1');
  });

  // 3. GET /demo/cv
  test('3. GET /api/demo/cv returns text from cv.txt', async () => {
    const res = await get('/api/demo/cv');
    assert.equal(res.status, 200);
    assert.ok(res.data.cvText && res.data.cvText.includes('Amina Bekele'));
  });

  // 4. POST /cv/extract
  test('4. POST /api/cv/extract returns extracted skills', async () => {
    const res = await post('/api/cv/extract', { cvText: 'Resume for testing Excel and Python' });
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.data.skills));
    assert.ok(res.data.skills.length > 0);
  });

  // 5. POST /profile/correct
  test('5. POST /api/profile/correct applies chat adjustments', async () => {
    const res = await post('/api/profile/correct', {
      message: 'change Excel to working level',
      currentSkills: [{ name: 'Excel', level: 'strong' }]
    });
    assert.equal(res.status, 200);
    const excel = res.data.skills.find(s => s.name === 'Excel');
    assert.equal(excel?.level, 'working');
  });

  // 6. POST /profile/set
  test('6. POST /api/profile/set saves skills', async () => {
    const res = await post('/api/profile/set', { skills: [{ name: 'SQL', level: 'working' }] });
    assert.equal(res.status, 200);
    assert.equal(res.data.ok, true);
  });

  // 7. POST /profile/confirm
  test('7. POST /api/profile/confirm locks profile', async () => {
    const res = await post('/api/profile/confirm', { skills: [{ name: 'SQL', level: 'strong' }] });
    assert.equal(res.status, 200);
    assert.equal(res.data.ok, true);
    assert.equal(res.data.status, 'confirmed');
  });

  // 8. POST /opportunities/rank (Tool 1)
  test('8. POST /api/opportunities/rank returns ranked opportunities', async () => {
    const res = await post('/api/opportunities/rank', {
      skills: [{ name: 'SQL', level: 'strong' }, { name: 'Excel', level: 'strong' }]
    });
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.data.rankedOpportunities));
    assert.ok(res.data.rankedOpportunities.length > 0);
  });

  // 9. POST /opportunities/explain
  test('9. POST /api/opportunities/explain returns why it fits', async () => {
    const res = await post('/api/opportunities/explain', {
      opportunityId: 'OPP-01',
      skills: [{ name: 'SQL', level: 'strong' }]
    });
    assert.equal(res.status, 200);
    assert.ok(res.data.summary);
    assert.ok(Array.isArray(res.data.matched));
  });

  // 10. POST /resources/find (Tool 2)
  test('10. POST /api/resources/find returns matching learning resources', async () => {
    const res = await post('/api/resources/find', { gapSkills: ['SQL'] });
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.data.resources));
    assert.ok(res.data.resources.some(r => r.tag === 'SQL'));
  });

  // 11. POST /plan/draft
  test('11. POST /api/plan/draft returns 7-day plan with >= 3 activities', async () => {
    const res = await post('/api/plan/draft', { opportunityId: 'OPP-01', intensity: 'standard' });
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.data.tasks));
    assert.equal(res.data.tasks.length, 7);
  });

  // 12. POST /plan/edit
  test('12. POST /api/plan/edit adjusts plan', async () => {
    const initialPlan = {
      tasks: [{ day: 1, title: 'SQL Joins', minutes: 40 }]
    };
    const res = await post('/api/plan/edit', { plan: initialPlan, prompt: 'make it lighter' });
    assert.equal(res.status, 200);
    assert.ok(res.data.tasks[0].minutes <= 30);
  });

  // 13. POST /plan/save (Tool 3)
  let savedPlanId;
  test('13. POST /api/plan/save persists approved plan', async () => {
    const res = await post('/api/plan/save', {
      opportunity: { id: 'OPP-01', title: 'Data Analyst', organization: 'Nile Retail' },
      plan: { tasks: [{ day: 1, title: 'SQL', minutes: 45, done: false }] },
      intensity: 'standard'
    });
    assert.equal(res.status, 200);
    assert.ok(res.data.planId);
    savedPlanId = res.data.planId;
  });

  // 14. GET /plan/:plan_id
  test('14. GET /api/plan/:plan_id reopens saved plan', async () => {
    assert.ok(savedPlanId);
    const res = await get(`/api/plan/${savedPlanId}`);
    assert.equal(res.status, 200);
    assert.equal(res.data.plan.planId, savedPlanId);
  });

  // 15. PATCH /plan/:plan_id/activity/:n
  test('15. PATCH /api/plan/:plan_id/activity/:n marks activity done', async () => {
    assert.ok(savedPlanId);
    const res = await patch(`/api/plan/${savedPlanId}/activity/1`, { done: true });
    assert.equal(res.status, 200);
    assert.equal(res.data.done, true);
  });
});
