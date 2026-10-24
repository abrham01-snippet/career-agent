// ==========================================
// CAREERPATH DUMMY DATA & CALCULATION HELPERS
// ==========================================

export const STUDENT_PROFILE = {
  name: 'Amina Bekele',
  headline: 'Final-year Business Analytics student',
  university: 'University College of Technology',
  email: 'amina.bekele@university.edu'
};

export const DEMO_CV_TEXT = `Amina Bekele
Final-year Business Analytics student | amina.bekele@university.edu

EDUCATION
B.Sc. in Business Analytics & Information Systems (Expected July 2025)
Relevant Coursework: Business Statistics, Data Warehousing, Spreadsheets & Modeling, Business Communication.

PROJECTS & EXPERIENCE
Business Operations Intern - Retail Trends Ltd (Summer 2024)
- Built advanced Excel financial models and automated monthly variance reporting for inventory tracking.
- Wrote Python scripts (pandas, numpy) for exploratory data analysis on 35,000+ customer sales records.
- Designed interactive Power BI dashboards to track store KPIs and presented weekly summary decks to department managers.
- Pulled order records from the company database for analytics reports to resolve stockout issues.

Academic Capstone: Predictive Delivery Optimization
- Applied hypothesis testing and multi-variable regression analysis to evaluate warehouse fulfillment delays.
- Delivered weekly milestone presentations to faculty advisors and corporate sponsor representatives.`;

export const ALLOWED_SKILLS = [
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

export const INITIAL_SKILLS = [
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
  },
  {
    id: 'sk-sql',
    name: 'SQL',
    level: 'beginner',
    evidence: 'Pulled order records from the company database for analytics reports to resolve stockout issues.',
    weakEvidence: true,
    removed: false
  }
];

export const OPPORTUNITIES = [
  {
    id: 'OPP-01',
    title: 'Data Analyst Intern',
    organization: 'Nile Retail Group',
    type: 'Internship',
    description: 'Support retail supply chain analytics by querying transaction logs and maintaining daily executive dashboards. Work alongside senior analysts to identify sales velocity trends and inventory imbalances.',
    required: ['SQL', 'Excel', 'Statistics'],
    preferred: ['Python', 'Data visualization'],
    cvQuotes: [
      'Pulled order records from the company database for analytics reports to resolve stockout issues.',
      'Built advanced Excel financial models and automated monthly variance reporting.',
      'Applied hypothesis testing and multi-variable regression analysis.'
    ],
    oppQuotes: [
      'Seeking an intern comfortable writing SQL queries against operational databases and building clean Excel summaries.',
      'Familiarity with exploratory Python and data visualization dashboards is preferred.'
    ]
  },
  {
    id: 'OPP-02',
    title: 'Marketing Analytics Trainee',
    organization: 'Sunrise Media',
    type: 'Traineeship',
    description: 'Analyze digital campaign performance metrics and present actionable audience insights to brand managers. Help develop automated client reports and visualize conversion funnels across multi-channel campaigns.',
    required: ['Excel', 'Data visualization', 'Communication'],
    preferred: ['SQL', 'Statistics'],
    cvQuotes: [
      'Designed interactive Power BI dashboards to track store KPIs and presented weekly summary decks.',
      'Delivered weekly milestone presentations to faculty advisors and corporate sponsors.',
      'Built advanced Excel financial models and automated monthly variance reporting.'
    ],
    oppQuotes: [
      'You will craft compelling data visualizations and communicate campaign performance clearly to non-technical stakeholders.',
      'Daily work revolves around Excel modeling, BI reports, and occasional SQL queries.'
    ]
  },
  {
    id: 'OPP-03',
    title: 'Junior Web Developer',
    organization: 'Bright Pixel Studio',
    type: 'Entry Level',
    description: 'Collaborate with designers to engineer responsive web components and interactive client applications. Write clean front-end code and contribute to technical sprint reviews with the engineering team.',
    required: ['JavaScript', 'Communication'],
    preferred: ['Figma', 'Python'],
    cvQuotes: [
      'Delivered weekly milestone presentations to faculty advisors and corporate sponsor representatives.',
      'Wrote Python scripts for data analysis on 35,000+ customer records.'
    ],
    oppQuotes: [
      'Requires strong front-end JavaScript foundations and clear team communication.',
      'Bonus points for prototyping familiarity in Figma or scripting in Python.'
    ]
  },
  {
    id: 'OPP-04',
    title: 'UX Research Assistant',
    organization: 'Lalibela Design Lab',
    type: 'Research Assistantship',
    description: 'Conduct user interviews, run usability tests, and synthesize qualitative findings into product opportunity briefs. Assist interaction designers in organizing research repositories and workshop activities.',
    required: ['User research', 'Communication'],
    preferred: ['Figma', 'Data visualization'],
    cvQuotes: [
      'Delivered weekly milestone presentations to corporate sponsor representatives.',
      'Designed interactive Power BI dashboards to track store KPIs.'
    ],
    oppQuotes: [
      'Must be passionate about user interview synthesis and articulating student feedback clearly.',
      'Figma wireframe inspection and data visualization skills are welcome assets.'
    ]
  },
  {
    id: 'OPP-05',
    title: 'Operations Coordinator',
    organization: 'Abay Logistics',
    type: 'Campus Placement',
    description: 'Monitor regional fleet schedules, resolve shipping bottlenecks, and maintain delivery performance scorecards. Coordinate daily operational handoffs between warehouse supervisors and logistics partners.',
    required: ['Excel', 'Communication'],
    preferred: ['Statistics', 'SQL'],
    cvQuotes: [
      'Built advanced Excel financial models and automated monthly variance reporting.',
      'Delivered weekly milestone presentations to faculty advisors and corporate sponsors.',
      'Pulled order records from the company database for analytics reports.'
    ],
    oppQuotes: [
      'High-volume tracking requires diligent Excel coordination and clear operational communication.',
      'Basic database queries and statistics knowledge will help audit shipment variance.'
    ]
  }
];

export const RESOURCES = [
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

// ==========================================
// SCORING HELPER FORMULA
// ==========================================
// Required skill weight = 2, preferred weight = 1
// Credit: strong = 1.0, working = 0.7, beginner = 0.4, absent = 0
// Score = Math.round(100 * sum(weight * credit) / sum(weight))

export const CREDIT_MAP = {
  strong: 1.0,
  working: 0.7,
  beginner: 0.4,
  none: 0.0
};

export function computeOpportunityFit(opp, userSkills) {
  const activeSkillsMap = new Map();
  userSkills.forEach(s => {
    if (!s.removed) {
      activeSkillsMap.set(s.name.toLowerCase().trim(), s.level);
    }
  });

  let totalWeight = 0;
  let weightedCreditSum = 0;
  const breakdown = [];
  const matched = [];
  const missing = [];

  // Required skills (weight 2)
  opp.required.forEach(skillName => {
    const weight = 2;
    totalWeight += weight;
    const userLevel = activeSkillsMap.get(skillName.toLowerCase().trim()) || 'none';
    const credit = CREDIT_MAP[userLevel] || 0;
    const points = Math.round(weight * credit * 100) / 100;
    weightedCreditSum += weight * credit;

    if (userLevel !== 'none') {
      matched.push({ name: skillName, level: userLevel, isRequired: true });
    } else {
      missing.push({ name: skillName, isRequired: true });
    }

    breakdown.push({
      skill: skillName,
      type: 'Required',
      weight,
      level: userLevel,
      credit: Math.round(credit * 100),
      points: Math.round((weight * credit / (weight * 1.0)) * 100)
    });
  });

  // Preferred skills (weight 1)
  opp.preferred.forEach(skillName => {
    const weight = 1;
    totalWeight += weight;
    const userLevel = activeSkillsMap.get(skillName.toLowerCase().trim()) || 'none';
    const credit = CREDIT_MAP[userLevel] || 0;
    const points = Math.round(weight * credit * 100) / 100;
    weightedCreditSum += weight * credit;

    if (userLevel !== 'none') {
      matched.push({ name: skillName, level: userLevel, isRequired: false });
    } else {
      missing.push({ name: skillName, isRequired: false });
    }

    breakdown.push({
      skill: skillName,
      type: 'Preferred',
      weight,
      level: userLevel,
      credit: Math.round(credit * 100),
      points: Math.round((weight * credit / (weight * 1.0)) * 100)
    });
  });

  const rawScore = totalWeight > 0 ? (weightedCreditSum / totalWeight) * 100 : 0;
  const score = Math.min(100, Math.max(0, Math.round(rawScore)));

  return {
    ...opp,
    score,
    matched,
    missing,
    breakdown
  };
}

export function rankAllOpportunities(userSkills) {
  return OPPORTUNITIES
    .map(opp => computeOpportunityFit(opp, userSkills))
    .sort((a, b) => b.score - a.score);
}

// ==========================================
// FAKE PLAN GENERATOR
// ==========================================
export function generatePlanForOpportunity(opportunity, userSkills, intensity = 'standard') {
  const activeSkillsMap = new Map();
  userSkills.forEach(s => {
    if (!s.removed) activeSkillsMap.set(s.name.toLowerCase().trim(), s.level);
  });

  // Target skills: missing skills first, then beginner skills
  const neededSkills = [];
  opportunity.required.forEach(skill => {
    const lvl = activeSkillsMap.get(skill.toLowerCase().trim()) || 'none';
    if (lvl === 'none' || lvl === 'beginner') {
      neededSkills.push({ name: skill, isRequired: true, currentLevel: lvl });
    }
  });
  opportunity.preferred.forEach(skill => {
    const lvl = activeSkillsMap.get(skill.toLowerCase().trim()) || 'none';
    if (lvl === 'none') {
      neededSkills.push({ name: skill, isRequired: false, currentLevel: lvl });
    }
  });

  const uncovered = [];
  const matchedResources = [];

  neededSkills.forEach(item => {
    const resList = RESOURCES.filter(r => r.tag.toLowerCase() === item.name.toLowerCase());
    if (resList.length > 0) {
      resList.forEach(r => matchedResources.push({ ...r, forSkill: item.name }));
    } else {
      uncovered.push(item.name);
    }
  });

  // Base multiplier for intensity
  const timeMultiplier = intensity === 'light' ? 0.7 : intensity === 'intensive' ? 1.3 : 1.0;

  // Build a structured 7-day schedule with at least 3 activities
  const r01 = RESOURCES.find(r => r.id === 'R-01');
  const r02 = RESOURCES.find(r => r.id === 'R-02');
  const r03 = RESOURCES.find(r => r.id === 'R-03');
  const r04 = RESOURCES.find(r => r.id === 'R-04');
  const r05 = RESOURCES.find(r => r.id === 'R-05');

  // Specific syllabus tailored to the role
  let tasks = [];

  if (opportunity.id === 'OPP-01') {
    // Data Analyst
    tasks = [
      { day: 1, title: 'SQL joins: Complete the 5 join queries in R-01 and note which join type you used', minutes: Math.round(45 * timeMultiplier), resId: 'R-01', done: false, isRest: false },
      { day: 2, title: 'SQL filtering: Practice GROUP BY & HAVING queries on retail transaction orders (R-03)', minutes: Math.round(40 * timeMultiplier), resId: 'R-03', done: false, isRest: false },
      { day: 3, title: 'Excel & Data Visualization audit: Review KPIs in R-02 and outline an executive summary dashboard', minutes: Math.round(30 * timeMultiplier), resId: 'R-02', done: false, isRest: false },
      { day: 4, title: 'Mid-week Rest & Synthesis: Consolidate query notes and review SQL syntax cheat sheet', minutes: 0, resId: null, done: false, isRest: true },
      { day: 5, title: 'Simulated Challenge: Write a 3-table join query to calculate weekly store sales velocity', minutes: Math.round(50 * timeMultiplier), resId: 'R-01', done: false, isRest: false },
      { day: 6, title: 'Dashboard Polish: Build a mini interactive chart showing inventory stockout alerts', minutes: Math.round(35 * timeMultiplier), resId: 'R-02', done: false, isRest: false },
      { day: 7, title: 'Final Retrospective: Document your SQL queries & dashboard link for your student portfolio', minutes: Math.round(25 * timeMultiplier), resId: null, done: false, isRest: false }
    ];
  } else if (opportunity.id === 'OPP-02') {
    // Marketing Analytics
    tasks = [
      { day: 1, title: 'Dashboard Design: Study information hierarchy in R-02 and audit current marketing reports', minutes: Math.round(30 * timeMultiplier), resId: 'R-02', done: false, isRest: false },
      { day: 2, title: 'SQL Foundation: Complete practice join queries in R-01 to query user conversion funnels', minutes: Math.round(45 * timeMultiplier), resId: 'R-01', done: false, isRest: false },
      { day: 3, title: 'Multi-channel Deck Prep: Draft 3 slide visuals summarizing campaign return-on-ad-spend', minutes: Math.round(35 * timeMultiplier), resId: 'R-02', done: false, isRest: false },
      { day: 4, title: 'Mid-week Rest & Reflection: Review marketing terminology and presentation outlines', minutes: 0, resId: null, done: false, isRest: true },
      { day: 5, title: 'SQL Aggregations: Run multi-column GROUP BY queries in R-03 on audience segments', minutes: Math.round(40 * timeMultiplier), resId: 'R-03', done: false, isRest: false },
      { day: 6, title: 'Executive Presentation Rehearsal: Record a 4-minute walkthrough of your KPI dashboard', minutes: Math.round(30 * timeMultiplier), resId: null, done: false, isRest: false },
      { day: 7, title: 'Weekly Summary: Package your campaign metrics sheet and slide deck for feedback', minutes: Math.round(20 * timeMultiplier), resId: null, done: false, isRest: false }
    ];
  } else if (opportunity.id === 'OPP-03') {
    // Junior Web Developer
    tasks = [
      { day: 1, title: 'JavaScript Warmup: Solve exercises 1 through 5 in R-04 focusing on array methods', minutes: Math.round(40 * timeMultiplier), resId: 'R-04', done: false, isRest: false },
      { day: 2, title: 'JavaScript Logic: Complete exercises 6 to 10 in R-04 covering DOM updates and events', minutes: Math.round(45 * timeMultiplier), resId: 'R-04', done: false, isRest: false },
      { day: 3, title: 'Component Prototyping: Build a clean responsive card component with HTML/CSS & JS', minutes: Math.round(50 * timeMultiplier), resId: null, done: false, isRest: false },
      { day: 4, title: 'Mid-week Rest & Code Review: Inspect open source UI components and read documentation', minutes: 0, resId: null, done: false, isRest: true },
      { day: 5, title: 'Figma to Code Challenge: Translate wireframe specs into accessible markup (Self-guided)', minutes: Math.round(45 * timeMultiplier), resId: null, done: false, isRest: false },
      { day: 6, title: 'Sprint Review Prep: Practice explaining your component architecture and state flow', minutes: Math.round(30 * timeMultiplier), resId: null, done: false, isRest: false },
      { day: 7, title: 'Code Polish & Git Push: Clean up repository README and test mobile viewport sizing', minutes: Math.round(25 * timeMultiplier), resId: null, done: false, isRest: false }
    ];
  } else if (opportunity.id === 'OPP-04') {
    // UX Research Assistant
    tasks = [
      { day: 1, title: 'Interview Guide: Draft a 5-question user interview guide following the prompts in R-05', minutes: Math.round(40 * timeMultiplier), resId: 'R-05', done: false, isRest: false },
      { day: 2, title: 'Pilot Roleplay: Test your 5 questions with a classmate and note leading question biases', minutes: Math.round(35 * timeMultiplier), resId: 'R-05', done: false, isRest: false },
      { day: 3, title: 'Dashboard Synthesis: Review R-02 to learn visual formats for presenting qualitative themes', minutes: Math.round(30 * timeMultiplier), resId: 'R-02', done: false, isRest: false },
      { day: 4, title: 'Mid-week Rest: Review cognitive bias checklists and usability testing ethics guidelines', minutes: 0, resId: null, done: false, isRest: true },
      { day: 5, title: 'Affinity Mapping: Transcribe pilot interview notes and organize into affinity clusters', minutes: Math.round(45 * timeMultiplier), resId: null, done: false, isRest: false },
      { day: 6, title: 'Insight Brief Creation: Write a 1-page executive summary with direct user quotes', minutes: Math.round(35 * timeMultiplier), resId: null, done: false, isRest: false },
      { day: 7, title: 'Portfolio Packaging: Add your interview guide and synthesis matrix to your research folder', minutes: Math.round(20 * timeMultiplier), resId: null, done: false, isRest: false }
    ];
  } else {
    // Operations Coordinator
    tasks = [
      { day: 1, title: 'Excel Advanced Modeling: Build a vehicle turnaround tracker with lookup functions', minutes: Math.round(40 * timeMultiplier), resId: null, done: false, isRest: false },
      { day: 2, title: 'SQL Joins Practice: Run query drills in R-01 to link warehouse pallets with carriers', minutes: Math.round(45 * timeMultiplier), resId: 'R-01', done: false, isRest: false },
      { day: 3, title: 'SQL Filtering & Grouping: Practice grouping delayed shipments by terminal hub (R-03)', minutes: Math.round(40 * timeMultiplier), resId: 'R-03', done: false, isRest: false },
      { day: 4, title: 'Mid-week Rest & Synthesis: Review logistics acronyms and operational safety standards', minutes: 0, resId: null, done: false, isRest: true },
      { day: 5, title: 'Variance Analysis: Calculate 95% delivery confidence intervals on transit time datasets', minutes: Math.round(35 * timeMultiplier), resId: null, done: false, isRest: false },
      { day: 6, title: 'Operational Handoff Script: Write clear escalation guidelines for driver delays', minutes: Math.round(30 * timeMultiplier), resId: null, done: false, isRest: false },
      { day: 7, title: 'Scorecard Finalization: Assemble your weekly logistics KPI template for review', minutes: Math.round(25 * timeMultiplier), resId: null, done: false, isRest: false }
    ];
  }

  return {
    opportunityId: opportunity.id,
    opportunityTitle: opportunity.title,
    organization: opportunity.organization,
    intensity,
    uncovered: Array.from(new Set(uncovered)),
    tasks
  };
}

// ==========================================
// FAKE CHAT HELPER
// ==========================================
// parseChatMessage(text, skills) understands:
// - "remove X" or "I don't know X" -> remove skill X
// - "add X" / "add X, working|strong|beginner" (intermediate=working, expert=strong, basic=beginner)
// - "why is #1 my best match" -> canned explanation using top match
// - "make my plan lighter" -> reduce plan minutes by about 30 percent
// - anything else -> "I wasn't sure what to change. Try 'remove SQL' or 'add Figma, working'."
// Replies must include the score change (e.g., "Removed SQL. Data Analyst Intern dropped from 82 to 68.")

export function parseChatMessage(text, currentSkills, currentPlan = null) {
  const clean = text.trim();
  const lower = clean.toLowerCase();

  // Helper to normalize skill name
  const findMatchingAllowedSkill = (query) => {
    return ALLOWED_SKILLS.find(s => s.toLowerCase() === query.toLowerCase().trim());
  };

  // Helper to map synonyms for level
  const normalizeLevel = (raw) => {
    if (!raw) return 'working';
    const l = raw.toLowerCase().trim();
    if (l === 'expert' || l === 'strong' || l === 'advanced') return 'strong';
    if (l === 'intermediate' || l === 'working' || l === 'proficient') return 'working';
    if (l === 'basic' || l === 'beginner' || l === 'novice') return 'beginner';
    return 'working';
  };

  // Calculate baseline scores
  const initialRanked = rankAllOpportunities(currentSkills);
  const topOppBefore = initialRanked[0];
  const oldScoreForTop = topOppBefore.score;

  // 1. "make my plan lighter"
  if (lower.includes('make my plan lighter') || lower.includes('lighter plan') || lower.includes('lighter')) {
    return {
      action: 'lighten_plan',
      reply: "I've made your 7-day plan lighter by reducing daily activities by 30%. Day 4 remains your restful synthesis checkpoint.",
      updatedSkills: currentSkills,
      planAdjusted: true
    };
  }

  // 2. "why is #1 my best match" / "why is #1"
  if (lower.includes('why is #1') || lower.includes('best match') || lower.includes('why is number 1')) {
    const top = initialRanked[0];
    const matchedNames = top.matched.map(m => m.name).join(', ');
    return {
      action: 'explain_top',
      reply: `Your top match is "${top.title}" at ${top.organization} with an overall fit score of ${top.score}%. Your verified profile directly matches ${matchedNames}, satisfying the highest-weighted required skills for this position.`,
      updatedSkills: currentSkills
    };
  }

  // 3. "remove X" or "I don't know X"
  const removeMatch = lower.match(/(?:remove|delete|exclude|don't know|do not know|drop)\s+([a-zA-Z\s]+)/i);
  if (removeMatch) {
    const candidate = removeMatch[1].trim();
    const matchedSkillName = findMatchingAllowedSkill(candidate) ||
      currentSkills.find(s => s.name.toLowerCase() === candidate)?.name;

    if (matchedSkillName) {
      const nextSkills = currentSkills.map(s =>
        s.name.toLowerCase() === matchedSkillName.toLowerCase()
          ? { ...s, removed: true }
          : s
      );

      const nextRanked = rankAllOpportunities(nextSkills);
      const targetOppAfter = nextRanked.find(o => o.id === topOppBefore.id) || nextRanked[0];
      const newScore = targetOppAfter.score;

      return {
        action: 'remove_skill',
        skillName: matchedSkillName,
        reply: `Removed ${matchedSkillName}. ${topOppBefore.title} changed from ${oldScoreForTop}% to ${newScore}%.`,
        updatedSkills: nextSkills
      };
    }
  }

  // 4. "add X" / "add X, working|strong|beginner"
  const addMatch = lower.match(/(?:add|include|set)\s+([a-zA-Z\s]+?)(?:,\s*([a-zA-Z]+))?$/i);
  if (addMatch) {
    const rawSkill = addMatch[1].trim();
    const rawLevel = addMatch[2];
    const matchedSkillName = findMatchingAllowedSkill(rawSkill);

    if (matchedSkillName) {
      const targetLevel = normalizeLevel(rawLevel);
      const existingIdx = currentSkills.findIndex(s => s.name.toLowerCase() === matchedSkillName.toLowerCase());

      let nextSkills = [];
      if (existingIdx >= 0) {
        nextSkills = currentSkills.map((s, idx) =>
          idx === existingIdx
            ? { ...s, level: targetLevel, removed: false, evidence: s.evidence || 'Added via AI career adviser.' }
            : s
        );
      } else {
        nextSkills = [
          ...currentSkills,
          {
            id: `sk-${Date.now()}`,
            name: matchedSkillName,
            level: targetLevel,
            evidence: 'Added via conversational AI career adviser.',
            weakEvidence: false,
            removed: false
          }
        ];
      }

      const nextRanked = rankAllOpportunities(nextSkills);
      const targetOppAfter = nextRanked.find(o => o.id === topOppBefore.id) || nextRanked[0];
      const newScore = targetOppAfter.score;
      const deltaMsg = newScore >= oldScoreForTop
        ? `rose from ${oldScoreForTop}% to ${newScore}%`
        : `adjusted from ${oldScoreForTop}% to ${newScore}%`;

      return {
        action: 'add_skill',
        skillName: matchedSkillName,
        level: targetLevel,
        reply: `Added ${matchedSkillName} (${targetLevel}). ${topOppBefore.title} ${deltaMsg}.`,
        updatedSkills: nextSkills
      };
    }
  }

  // 5. Fallback response
  return {
    action: 'unknown',
    reply: "I wasn't sure what to change. Try 'remove SQL', 'add Figma, working', or 'Why is #1 my best match?'.",
    updatedSkills: currentSkills
  };
}

export function extractSkillsFromCv(text) {
  if (!text || text.trim().length === 0) {
    return INITIAL_SKILLS;
  }

  const sentences = text
    .split(/\r?\n|\. |\; /)
    .map(s => s.trim())
    .filter(s => s.length > 5);

  const skillDefinitions = [
    {
      name: 'SQL',
      keywords: [/\bsql\b/i, /\bpostgres/i, /\bmysql\b/i, /\bdatabase/i, /\bquerying\b/i, /\bqueries\b/i],
      defaultLevel: 'working'
    },
    {
      name: 'Excel',
      keywords: [/\bexcel\b/i, /\bspreadsheet/i, /\bvlookup\b/i, /\bpivot\b/i, /\bfinancial model/i],
      defaultLevel: 'strong'
    },
    {
      name: 'Python',
      keywords: [/\bpython\b/i, /\bpandas\b/i, /\bnumpy\b/i, /\bdata analysis\b/i, /\bscripts\b/i],
      defaultLevel: 'working'
    },
    {
      name: 'Statistics',
      keywords: [/\bstatistic/i, /\bhypothesis\b/i, /\bregression\b/i, /\bquantitative\b/i, /\bprobability\b/i],
      defaultLevel: 'working'
    },
    {
      name: 'Data visualization',
      keywords: [/\bdata viz/i, /\bvisualization\b/i, /\bpower bi\b/i, /\btableau\b/i, /\bdashboard/i, /\bcharts\b/i],
      defaultLevel: 'working'
    },
    {
      name: 'Communication',
      keywords: [/\bcommunication\b/i, /\bpresent/i, /\breporting\b/i, /\bstakeholder/i, /\bdeck\b/i, /\bcollaborat/i],
      defaultLevel: 'strong'
    },
    {
      name: 'Figma',
      keywords: [/\bfigma\b/i, /\bwirefram/i, /\bprototyp/i, /\bui\/ux\b/i, /\buser interface\b/i],
      defaultLevel: 'working'
    },
    {
      name: 'JavaScript',
      keywords: [/\bjavascript\b/i, /\bjs\b/i, /\btypescript\b/i, /\bts\b/i, /\bnode/i, /\bfrontend\b/i, /\bfront-end\b/i, /\breact/i],
      defaultLevel: 'working'
    },
    {
      name: 'User research',
      keywords: [/\buser research\b/i, /\busability\b/i, /\binterview/i, /\buser test/i, /\bux research\b/i],
      defaultLevel: 'working'
    }
  ];

  const foundSkills = [];

  for (const def of skillDefinitions) {
    const isMatched = def.keywords.some(rx => rx.test(text));
    if (isMatched) {
      const sentence = sentences.find(s => def.keywords.some(rx => rx.test(s))) || `Demonstrated competency in ${def.name}.`;
      let level = def.defaultLevel;
      const sLower = sentence.toLowerCase();
      if (sLower.includes('lead') || sLower.includes('advanced') || sLower.includes('expert') || sLower.includes('proficient') || sLower.includes('senior')) {
        level = 'strong';
      } else if (sLower.includes('basic') || sLower.includes('beginner') || sLower.includes('learning') || sLower.includes('familiar') || sLower.includes('coursework')) {
        level = 'beginner';
      }

      foundSkills.push({
        id: `sk-${def.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        name: def.name,
        level,
        evidence: sentence.length > 130 ? sentence.slice(0, 127) + '...' : sentence,
        weakEvidence: sentence.length < 25,
        removed: false
      });
    }
  }

  if (foundSkills.length < 3) {
    const sampleSentences = sentences.slice(0, 3);
    const fallbackList = INITIAL_SKILLS.map((sk, idx) => ({
      ...sk,
      evidence: sampleSentences[idx] ? sampleSentences[idx].slice(0, 130) : sk.evidence
    }));
    return foundSkills.length > 0
      ? [...foundSkills, ...fallbackList.filter(f => !foundSkills.some(s => s.name === f.name))]
      : fallbackList;
  }

  return foundSkills;
}

