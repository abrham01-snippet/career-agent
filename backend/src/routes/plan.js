const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { generateContent } = require('../ai/client');
const { validatePlanInvariants } = require('../services/verifier');
const resourcesData = require('../data/resources');
const db = require('../db');

// POST /api/resources/find - Tool 2: Find learning resources for skill gaps
router.post('/resources/find', asyncHandler(async (req, res) => {
  const { missingSkills } = req.body;
  if (!Array.isArray(missingSkills)) {
    return res.status(400).json({ error: { code: 'INVALID_INPUT', message: 'missingSkills array is required' } });
  }

  // Filter resources matching missing skills
  const matchedResources = resourcesData.filter(resItem => 
    missingSkills.some(skill => resItem.skills.includes(skill))
  );

  res.json({ resources: matchedResources });
}));

// POST /api/plan/draft - Draft a 7-day development plan via Gemini AI
router.post('/plan/draft', asyncHandler(async (req, res) => {
  const { profileId, opportunityId, missingSkills } = req.body;
  if (!profileId || !opportunityId) {
    return res.status(400).json({ error: { code: 'INVALID_INPUT', message: 'profileId and opportunityId are required' } });
  }

  const prompt = `Create a 7-day development plan for a student targeting opportunity ${opportunityId} who needs to learn: ${JSON.stringify(missingSkills)}. Return JSON with an array of activities for days 1 to 7, each having day (1-7), title, description, durationMinutes (between 15 and 300), and resourceIds.`;
  
  const aiResponse = await generateContent(prompt);
  res.json({ profileId, opportunityId, draftPlan: aiResponse });
}));

// POST /api/plan/save - Save confirmed development plan (Tool 3)
router.post('/plan/save', asyncHandler(async (req, res) => {
  const planPayload = req.body;
  
  // Validate plan using the strict verifier rules from Milestone 2
  const validation = validatePlanInvariants(planPayload);
  if (!validation.valid) {
    return res.status(400).json({ error: { code: 'INVALID_PLAN', message: validation.error } });
  }

  const insertQuery = `
    INSERT INTO development_plans (profile_id, opportunity_id, plan_data, student_confirmed, created_at)
    VALUES ($1, $2, $3, $4, NOW())
    RETURNING id;
  `;
  
  const result = await db.query(insertQuery, [
    planPayload.profileId,
    planPayload.opportunityId,
    JSON.stringify(planPayload),
    planPayload.studentConfirmed
  ]);

  res.json({ success: true, planId: result.rows[0].id });
}));

// GET /api/plan/:plan_id - Reopen saved plan
router.get('/plan/:plan_id', asyncHandler(async (req, res) => {
  const { plan_id } = req.params;
  const result = await db.query('SELECT * FROM development_plans WHERE id = $1', [plan_id]);
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Development plan not found' } });
  }

  res.json(result.rows[0]);
}));

// PATCH /api/plan/:plan_id/activity/:n - Mark an activity done
router.patch('/plan/:plan_id/activity/:n', asyncHandler(async (req, res) => {
  const { plan_id, n } = req.params;
  const { completed } = req.body;

  const result = await db.query('SELECT * FROM development_plans WHERE id = $1', [plan_id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Development plan not found' } });
  }

  let plan = result.rows[0].plan_data;
  // Update activity status in plan_data JSON
  if (plan.activities && plan.activities[n]) {
    plan.activities[n].completed = Boolean(completed);
  }

  await db.query('UPDATE development_plans SET plan_data = $1 WHERE id = $2', [JSON.stringify(plan), plan_id]);
  res.json({ success: true, plan });
}));

module.exports = router;

