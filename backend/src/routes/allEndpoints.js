const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// In-memory state storage (persisted across session requests)
const sessions = new Map();
const savedPlans = new Map();

// Helper to load demo CV text
function getDemoCvText() {
  const cvPath = path.join(__dirname, '../data/cv.txt');
  if (fs.existsSync(cvPath)) {
    return fs.readFileSync(cvPath, 'utf-8');
  }
  return `Amina Bekele\nFinal-year Business Analytics student | amina.bekele@university.edu\n\nEDUCATION\nB.Sc. in Business Analytics & Information Systems (Expected July 2025)\nRelevant Coursework: Business Statistics, Data Warehousing, Spreadsheets & Modeling, Business Communication.\n\nPROJECTS & EXPERIENCE\nBusiness Operations Intern - Retail Trends Ltd (Summer 2024)\n- Built advanced Excel financial models and automated monthly variance reporting for inventory tracking.\n- Wrote Python scripts (pandas, numpy) for exploratory data analysis on 35,000+ customer sales records.\n- Designed interactive Power BI dashboards to track store KPIs and presented weekly summary decks to department managers.\n- Pulled order records from the company database for analytics reports to resolve stockout issues.`;
}

// 5 Standard Demonstration Opportunities
const DEMO_OPPORTUNITIES = [
  {
    id: 'OPP-01',
    title: 'Data Analyst Intern',
    organization: 'Nile Retail Group',
    type: 'Hybrid · Summer 2025',
    description: 'Query transactional data, build executive Power BI KPI dashboards, and support weekly inventory reports.',
    required: ['SQL', 'Excel'],
    preferred: ['Python', 'Data visualization']
  },
  {
    id: 'OPP-02',
    title: 'Marketing Analytics Associate',
    organization: 'BlueWave Digital',
    type: 'Remote · 6 Months',
    description: 'Track multi-channel ad attribution, aggregate user conversion funnels, and present visual campaign slide decks.',
    required: ['Data visualization', 'Excel'],
    preferred: ['SQL', 'Communication']
  },
  {
    id: 'OPP-03',
    title: 'Junior Web Developer',
    organization: 'FinTech Horizon',
    type: 'On-site · Full-time Junior',
    description: 'Build responsive client dashboards, translate Figma wireframes into accessible markup, and connect APIs.',
    required: ['JavaScript', 'Figma'],
    preferred: ['Python', 'Communication']
  },
  {
    id: 'OPP-04',
    title: 'UX Research Assistant',
    organization: 'Addis Design Studio',
    type: 'Hybrid · 4 Months',
    description: 'Conduct semi-structured user interviews, build usability affinity diagrams, and present findings to product teams.',
    required: ['User research', 'Communication'],
    preferred: ['Figma', 'Data visualization']
  },
  {
    id: 'OPP-05',
    title: 'Operations Coordinator',
    organization: 'Apex Logistics',
    type: 'On-site · Summer 2025',
    description: 'Optimize carrier routing tables, calculate warehouse turnaround velocity, and manage vendor communication logs.',
    required: ['Excel', 'Communication'],
    preferred: ['SQL', 'Python']
  }
];

// Team-Created Resources Catalog (Tool 2)
const DEMO_RESOURCES = [
  {
    id: 'R-01',
    title: 'SQL joins: 5 practice queries',
    type: 'exercise',
    minutes: 45,
    tag: 'SQL',
    description: 'Master INNER, LEFT, and FULL OUTER joins on order and shipment tables with guided feedback.'
  },
  {
    id: 'R-02',
    title: 'Dashboard design mini-lesson',
    type: 'mini-lesson',
    minutes: 30,
    tag: 'Data visualization',
    description: 'Principles of information hierarchy, visual uncluttering, and metric cards for executive stakeholders.'
  },
  {
    id: 'R-03',
    title: 'SQL filtering and grouping',
    type: 'mini-lesson',
    minutes: 40,
    tag: 'SQL',
    description: 'Deep dive into WHERE vs HAVING, multi-column GROUP BY, and common aggregate functions.'
  },
  {
    id: 'R-04',
    title: 'JavaScript basics: 10 small exercises',
    type: 'exercise',
    minutes: 60,
    tag: 'JavaScript',
    description: 'Hands-on practice covering variables, array methods (map, filter), functions, and DOM manipulation.'
  },
  {
    id: 'R-05',
    title: 'Write a 5-question user interview guide',
    type: 'exercise',
    minutes: 40,
    tag: 'User research',
    description: 'Draft unbiased, open-ended interview prompts and test them in a peer roleplay simulation.'
  }
];

// Scoring Formula implementation
const CREDIT_MAP = { strong: 1.0, working: 0.7, beginner: 0.4, none: 0.0 };

function scoreOpportunity(opp, skills) {
  const activeSkillsMap = new Map();
  skills.filter(s => !s.removed).forEach(s => {
    activeSkillsMap.set(s.name.toLowerCase().trim(), s.level || 'working');
  });

  let totalWeightedCredit = 0;
  let totalWeight = 0;
  const matched = [];
  const missing = [];

  opp.required.forEach(skillName => {
    const lvl = activeSkillsMap.get(skillName.toLowerCase().trim()) || 'none';
    const credit = CREDIT_MAP[lvl] || 0;
    totalWeightedCredit += 2 * credit;
    totalWeight += 2;
    if (lvl !== 'none') {
      matched.push({ name: skillName, level: lvl, isRequired: true, credit });
    } else {
      missing.push({ name: skillName, isRequired: true });
    }
  });

  opp.preferred.forEach(skillName => {
    const lvl = activeSkillsMap.get(skillName.toLowerCase().trim()) || 'none';
    const credit = CREDIT_MAP[lvl] || 0;
    totalWeightedCredit += 1 * credit;
    totalWeight += 1;
    if (lvl !== 'none') {
      matched.push({ name: skillName, level: lvl, isRequired: false, credit });
    } else {
      missing.push({ name: skillName, isRequired: false });
    }
  });

  const rawScore = totalWeight > 0 ? (totalWeightedCredit / totalWeight) * 100 : 0;
  const score = Math.round(rawScore);

  return {
    ...opp,
    score,
    rawScore,
    matched,
    missing,
    whyItFits: {
      summary: `Matches ${matched.length} out of ${opp.required.length + opp.preferred.length} desired competencies.`,
      matched: matched.map(m => ({
        skill: m.name,
        level: m.level,
        requirement: m.isRequired ? `Required: ${m.name}` : `Preferred: ${m.name}`,
        evidence: `Demonstrated candidate background in ${m.name}.`
      })),
      missing: missing.map(m => ({
        skill: m.name,
        requirement: m.isRequired ? `Required: ${m.name}` : `Preferred: ${m.name}`,
        status: m.isRequired ? 'Must close gap in one-week plan' : 'Recommended growth area'
      }))
    }
  };
}

// =========================================================================
// 15 SPECIFICATION ENDPOINTS
// =========================================================================

// 1. GET /health
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'career-agent-backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 2. POST /session
router.post('/session', (req, res) => {
  const sessionId = req.body?.sessionId || `sess_${Date.now()}`;
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      id: sessionId,
      skills: [],
      confirmed: false,
      createdAt: new Date().toISOString()
    });
  }
  res.json({ sessionId, session: sessions.get(sessionId) });
});

// 3. GET /demo/cv
router.get('/demo/cv', (req, res) => {
  const cvText = getDemoCvText();
  res.json({ cvText });
});

// 4. POST /cv/extract (Live Gemini AI + Intelligent Fallback)
router.post('/cv/extract', async (req, res) => {
  const cvText = req.body.cvText || req.body.text || req.body.content || req.body.cv || '';
  const pdfBase64 = req.body.pdfBase64 || req.body.base64 || req.body.fileBase64 || null;
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  const ALLOWED_VOCAB = [
    'SQL',
    'Excel',
    'Python',
    'Statistics',
    'Data visualization',
    'Communication',
    'Figma',
    'JavaScript',
    'User research'
  ];

  // Strategy 1: Live Gemini AI with PDF or Text
  if (apiKey) {
    try {
      const { GoogleGenAI } = require('@google/genai');
      const ai = new GoogleGenAI({ apiKey });

      let contents;
      const promptInstruction = `Approved Skill Vocabulary:
${JSON.stringify(ALLOWED_VOCAB, null, 2)}

You are an expert university career adviser. Analyze this student resume and extract ONLY skills that map directly to the approved vocabulary list above.
For each detected skill, determine the student's level ('strong', 'working', or 'beginner') based on their demonstrated projects or coursework, and extract an EXACT verbatim quote from the resume as evidence.
If evidence is brief or ambiguous, set weak_evidence to true, otherwise false.

Respond with ONLY valid JSON:
{
  "skills": [
    {
      "name": "Exact skill name from approved vocabulary",
      "level": "strong" | "working" | "beginner",
      "evidence": "Exact quote from resume",
      "weak_evidence": false
    }
  ]
}`;

      if (pdfBase64 && typeof pdfBase64 === 'string' && pdfBase64.length > 50) {
        const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '').trim();
        contents = [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: cleanBase64
            }
          },
          {
            text: promptInstruction
          }
        ];
      } else {
        contents = `${promptInstruction}\n\nStudent Resume Text:\n${cvText || ''}`;
      }

      console.log(`[Backend AI] 🤖 Sending extraction request to Gemini (${modelName})...`);
      
      const response = await Promise.race([
        ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.1
          }
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Gemini API timeout (25s exceeded)')), 25000))
      ]);

      const raw = response.text || response.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
      const cleanJson = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed && Array.isArray(parsed.skills) && parsed.skills.length > 0) {
        const validatedSkills = parsed.skills.map((s, idx) => ({
          id: `sk-${s.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${idx}`,
          name: s.name,
          level: ['strong', 'working', 'beginner'].includes(s.level) ? s.level : 'working',
          evidence: s.evidence || `Demonstrated competency in ${s.name}.`,
          weakEvidence: Boolean(s.weak_evidence),
          removed: false
        }));

        console.log(`[Backend AI] ✨ Gemini extracted ${validatedSkills.length} skills successfully!`);
        return res.json({ skills: validatedSkills, count: validatedSkills.length, source: 'gemini-live' });
      }
    } catch (err) {
      console.warn(`[Backend AI] ⚠️ Gemini call failed: ${err.message}. Using rule-based text scanner.`);
    }
  }

  // Strategy 2: Rule-Based Resume Text Scanner (Extracts skills from text or PDF buffer)
  let rawText = cvText || '';
  if (!rawText.trim() && pdfBase64 && typeof pdfBase64 === 'string') {
    try {
      const cleanB64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '').trim();
      const buf = Buffer.from(cleanB64, 'base64');
      let ascii = '';
      for (let i = 0; i < buf.length; i++) {
        const b = buf[i];
        if ((b >= 32 && b <= 126) || b === 10 || b === 13) {
          ascii += String.fromCharCode(b);
        } else {
          ascii += ' ';
        }
      }
      rawText = ascii.replace(/\s{2,}/g, ' ');
    } catch (e) {
      console.warn('[Backend] Could not extract text from PDF buffer:', e.message);
    }
  }

  const textToScan = (rawText || '').toLowerCase();
  const detectedSkills = [];

  ALLOWED_VOCAB.forEach((vocabSkill) => {
    const vLower = vocabSkill.toLowerCase();
    if (textToScan.includes(vLower)) {
      // Find sentence containing the skill
      const sentences = rawText.split(/[.\n;]/).map(s => s.trim()).filter(Boolean);
      const matchSentence = sentences.find(s => s.toLowerCase().includes(vLower)) || `Demonstrated competency in ${vocabSkill}.`;
      
      let level = 'working';
      if (textToScan.includes(`advanced ${vLower}`) || textToScan.includes(`lead`) || textToScan.includes(`built`) || textToScan.includes(`senior`) || textToScan.includes(`proficient`)) {
        level = 'strong';
      } else if (textToScan.includes(`basic ${vLower}`) || textToScan.includes(`familiar with ${vLower}`) || textToScan.includes(`coursework`)) {
        level = 'beginner';
      }

      detectedSkills.push({
        id: `sk-${vLower.replace(/[^a-z0-9]/g, '-')}-${detectedSkills.length}`,
        name: vocabSkill,
        level,
        evidence: matchSentence.length > 180 ? matchSentence.substring(0, 180) + '...' : matchSentence,
        weakEvidence: level === 'beginner',
        removed: false
      });
    }
  });

  if (detectedSkills.length > 0) {
    console.log(`[Backend Scanner] 📄 Text/PDF scanner found ${detectedSkills.length} skills from candidate resume.`);
    return res.json({ skills: detectedSkills, count: detectedSkills.length, source: 'text-scanner' });
  }

  // Strategy 3: Standard Demo Skills (if CV text was empty)
  const defaultSkills = [
    {
      id: 'sk-excel',
      name: 'Excel',
      level: 'strong',
      evidence: 'Built advanced Excel financial models and automated monthly variance reporting for inventory tracking.',
      weakEvidence: false,
      removed: false
    },
    {
      id: 'sk-python',
      name: 'Python',
      level: 'working',
      evidence: 'Wrote Python scripts (pandas, numpy) for exploratory data analysis on 35,000+ customer sales records.',
      weakEvidence: false,
      removed: false
    },
    {
      id: 'sk-stats',
      name: 'Statistics',
      level: 'working',
      evidence: 'Applied hypothesis testing and multi-variable regression analysis to evaluate warehouse fulfillment delays.',
      weakEvidence: false,
      removed: false
    },
    {
      id: 'sk-dataviz',
      name: 'Data visualization',
      level: 'working',
      evidence: 'Designed interactive Power BI dashboards to track store KPIs and presented weekly summary decks to department managers.',
      weakEvidence: false,
      removed: false
    },
    {
      id: 'sk-comm',
      name: 'Communication',
      level: 'strong',
      evidence: 'Delivered weekly milestone presentations to faculty advisors and corporate sponsor representatives.',
      weakEvidence: false,
      removed: false
    }
  ];

  res.json({ skills: defaultSkills, count: defaultSkills.length, source: 'demo-catalog' });
});

// 5. POST /profile/correct
router.post('/profile/correct', (req, res) => {
  const { message, currentSkills = [] } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }

  const msg = message.toLowerCase();
  let updatedSkills = [...currentSkills];
  let reply = "I've reviewed your skills adjustment.";

  if (msg.includes('excel') && (msg.includes('working') || msg.includes('lower') || msg.includes('reduce'))) {
    updatedSkills = updatedSkills.map(s => s.name === 'Excel' ? { ...s, level: 'working' } : s);
    reply = "Changed Excel to working level.";
  } else if (msg.includes('python') && (msg.includes('strong') || msg.includes('expert'))) {
    updatedSkills = updatedSkills.map(s => s.name === 'Python' ? { ...s, level: 'strong' } : s);
    reply = "Promoted Python to strong level.";
  } else if (msg.includes('sql') && (msg.includes('add') || msg.includes('have'))) {
    if (!updatedSkills.some(s => s.name.toLowerCase() === 'sql')) {
      updatedSkills.push({
        id: 'sk-sql-user',
        name: 'SQL',
        level: 'beginner',
        evidence: 'Verified from user prompt: basic SQL queries knowledge.',
        weakEvidence: false,
        removed: false
      });
      reply = "Added SQL at beginner level.";
    }
  }

  res.json({ skills: updatedSkills, reply, explanation: 'Applied profile corrections.' });
});

// 6. POST /profile/set
router.post('/profile/set', (req, res) => {
  const { skills = [] } = req.body;
  const sessionId = req.body?.sessionId || req.headers['x-session-id'];
  if (sessionId && sessions.has(sessionId)) {
    const sess = sessions.get(sessionId);
    sess.skills = skills;
  }
  res.json({ ok: true, count: skills.length });
});

// 7. POST /profile/confirm
router.post('/profile/confirm', (req, res) => {
  const { skills = [] } = req.body;
  const sessionId = req.body?.sessionId || req.headers['x-session-id'];
  if (sessionId && sessions.has(sessionId)) {
    const sess = sessions.get(sessionId);
    sess.skills = skills;
    sess.confirmed = true;
    sess.confirmedAt = new Date().toISOString();
  }
  res.json({ ok: true, confirmedAt: new Date().toISOString(), status: 'confirmed' });
});

// 8. POST /opportunities/rank (Tool 1: search_and_score_opportunities)
router.post('/opportunities/rank', (req, res) => {
  const skills = req.body?.skills || [];
  const ranked = DEMO_OPPORTUNITIES.map(opp => scoreOpportunity(opp, skills)).sort((a, b) => b.score - a.score);
  res.json({ rankedOpportunities: ranked, count: ranked.length });
});

// 9. POST /opportunities/explain
router.post('/opportunities/explain', (req, res) => {
  const { opportunityId, skills = [] } = req.body;
  const opp = DEMO_OPPORTUNITIES.find(o => o.id === opportunityId) || DEMO_OPPORTUNITIES[0];
  const scored = scoreOpportunity(opp, skills);
  res.json({
    opportunityId: opp.id,
    title: opp.title,
    organization: opp.organization,
    summary: scored.whyItFits.summary,
    matched: scored.whyItFits.matched,
    missing: scored.whyItFits.missing
  });
});

// 10. POST /resources/find (Tool 2: find_learning_resources)
router.post('/resources/find', (req, res) => {
  const gapSkills = req.body?.gapSkills || req.body?.missingSkills || [];
  const normalizedGaps = gapSkills.map(g => (typeof g === 'string' ? g : g.name || '').toLowerCase());
  const gapSet = new Set(normalizedGaps);

  const matched = DEMO_RESOURCES.filter(r => gapSet.has(r.tag.toLowerCase()));
  const uncovered = normalizedGaps.filter(g => !DEMO_RESOURCES.some(r => r.tag.toLowerCase() === g));

  res.json({ resources: matched.length > 0 ? matched : DEMO_RESOURCES.slice(0, 3), uncovered });
});

// 11. POST /plan/draft
router.post('/plan/draft', (req, res) => {
  const { opportunityId, intensity = 'standard' } = req.body;
  const opp = DEMO_OPPORTUNITIES.find(o => o.id === opportunityId) || DEMO_OPPORTUNITIES[0];

  const timeMultiplier = intensity === 'light' ? 0.7 : intensity === 'intensive' ? 1.3 : 1.0;

  const tasks = [
    { day: 1, title: 'SQL joins: Complete the 5 join queries in R-01 and note which join type you used', minutes: Math.round(45 * timeMultiplier), resId: 'R-01', done: false, isRest: false },
    { day: 2, title: 'SQL filtering: Practice GROUP BY & HAVING queries on retail transaction orders (R-03)', minutes: Math.round(40 * timeMultiplier), resId: 'R-03', done: false, isRest: false },
    { day: 3, title: 'Excel & Data Visualization audit: Review KPIs in R-02 and outline an executive summary dashboard', minutes: Math.round(30 * timeMultiplier), resId: 'R-02', done: false, isRest: false },
    { day: 4, title: 'Mid-week Rest & Synthesis: Consolidate query notes and review SQL syntax cheat sheet', minutes: 0, resId: null, done: false, isRest: true },
    { day: 5, title: 'Simulated Challenge: Write a 3-table join query to calculate weekly store sales velocity', minutes: Math.round(50 * timeMultiplier), resId: 'R-01', done: false, isRest: false },
    { day: 6, title: 'Dashboard Polish: Build a mini interactive chart showing inventory stockout alerts', minutes: Math.round(35 * timeMultiplier), resId: 'R-02', done: false, isRest: false },
    { day: 7, title: 'Final Retrospective: Document your SQL queries & dashboard link for your student portfolio', minutes: Math.round(25 * timeMultiplier), resId: null, done: false, isRest: false }
  ];

  res.json({
    opportunityId: opp.id,
    intensity,
    tasks,
    totalMinutes: tasks.reduce((sum, t) => sum + t.minutes, 0)
  });
});

// 12. POST /plan/edit
router.post('/plan/edit', (req, res) => {
  const { plan, prompt = '' } = req.body;
  if (!plan) {
    return res.status(400).json({ error: 'plan is required' });
  }

  const pLower = prompt.toLowerCase();
  let updatedTasks = [...(plan.tasks || [])];

  if (pLower.includes('light') || pLower.includes('reduce') || pLower.includes('less time')) {
    updatedTasks = updatedTasks.map(t => ({
      ...t,
      minutes: Math.max(15, Math.round(t.minutes * 0.75))
    }));
  }

  res.json({
    ...plan,
    tasks: updatedTasks,
    summary: `Adjusted plan according to student request: "${prompt}".`
  });
});

// 13. POST /plan/save (Tool 3: save_development_plan)
router.post('/plan/save', (req, res) => {
  const { opportunity, plan, intensity = 'standard' } = req.body;
  if (!opportunity || !plan) {
    return res.status(400).json({ error: 'opportunity and plan are required' });
  }

  const planId = `PLAN-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
  const record = {
    planId,
    opportunityId: opportunity.id,
    opportunityTitle: opportunity.title,
    organization: opportunity.organization,
    intensity,
    tasks: plan.tasks || [],
    savedAt: new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }),
    createdAt: new Date().toISOString()
  };

  savedPlans.set(planId, record);

  res.json({
    success: true,
    planId,
    plan: record
  });
});

// 14. GET /plan/:plan_id
router.get('/plan/:plan_id', (req, res) => {
  const { plan_id } = req.params;
  const plan = savedPlans.get(plan_id);
  if (!plan) {
    return res.status(404).json({ error: `Plan ${plan_id} not found` });
  }
  res.json({ plan });
});

// 15. PATCH /plan/:plan_id/activity/:n
router.patch('/plan/:plan_id/activity/:n', (req, res) => {
  const { plan_id, n } = req.params;
  const { done } = req.body;
  const plan = savedPlans.get(plan_id);

  if (!plan) {
    return res.status(404).json({ error: `Plan ${plan_id} not found` });
  }

  const dayIndex = Number(n);
  plan.tasks = plan.tasks.map(t => (t.day === dayIndex ? { ...t, done: Boolean(done) } : t));

  res.json({ success: true, planId: plan_id, day: dayIndex, done: Boolean(done) });
});

module.exports = router;
