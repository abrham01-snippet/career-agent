const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { searchAndScoreOpportunities } = require('../ai/tools');
const { generateContent } = require('../ai/client');
const db = require('../db');

// POST /api/opportunities/rank - Pure JS scoring (No LLM)
router.post('/rank', asyncHandler(async (req, res) => {
  const { profileId } = req.body;
  if (!profileId) {
    return res.status(400).json({ error: { code: 'INVALID_INPUT', message: 'profileId is required' } });
  }

  // Fetch confirmed profile from DB
  const result = await db.query('SELECT * FROM profiles WHERE id = $1', [profileId]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Profile not found' } });
  }

  const profile = result.rows[0];
  if (profile.status !== 'confirmed') {
    return res.status(400).json({ error: { code: 'UNCONFIRMED_PROFILE', message: 'Profile must be confirmed before matching' } });
  }

  const rankedOpportunities = searchAndScoreOpportunities(profile.skills);
  res.json({ profileId, opportunities: rankedOpportunities });
}));

// POST /api/opportunities/explain - LLM explanations with evidence citations
router.post('/explain', asyncHandler(async (req, res) => {
  const { profileId, opportunityIds } = req.body;
  if (!profileId || !Array.isArray(opportunityIds)) {
    return res.status(400).json({ error: { code: 'INVALID_INPUT', message: 'profileId and opportunityIds array are required' } });
  }

  const result = await db.query('SELECT * FROM profiles WHERE id = $1', [profileId]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Profile not found' } });
  }

  const profile = result.rows[0];
  if (profile.status !== 'confirmed') {
    return res.status(400).json({ error: { code: 'UNCONFIRMED_PROFILE', message: 'Profile must be confirmed before generating explanations' } });
  }

  const prompt = `You are a career adviser. Explain why these internship opportunity IDs [${opportunityIds.join(', ')}] match the student's skills: ${JSON.stringify(profile.skills)}. Cite specific CV evidence IDs (like CV-S1, CV-S2) in your explanation. Be brief.`;
  
  const aiResponse = await generateContent(prompt);
  res.json({ profileId, explanation: aiResponse });
}));

module.exports = router;
