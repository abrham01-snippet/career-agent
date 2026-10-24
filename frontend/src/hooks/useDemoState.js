import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  INITIAL_SKILLS,
  rankAllOpportunities,
  generatePlanForOpportunity,
  parseChatMessage,
  OPPORTUNITIES,
  extractSkillsFromCv
} from '../data/mock.js';

const STORAGE_KEY_PLANS = 'careerpath_saved_plans_v2';
const STORAGE_KEY_SKILLS = 'careerpath_user_skills_v2';

export function useDemoState() {
  const [step, setStep] = useState(1);
  const [cvText, setCvText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);

  // User Skills
  const [skills, setSkills] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SKILLS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SKILLS;
  });

  // Selected Opportunity
  const [selectedOppId, setSelectedOppId] = useState('OPP-01');

  // Plan State
  const [planIntensity, setPlanIntensity] = useState('standard');
  const [activePlan, setActivePlan] = useState(() => {
    const opp = OPPORTUNITIES.find(o => o.id === 'OPP-01') || OPPORTUNITIES[0];
    return generatePlanForOpportunity(opp, INITIAL_SKILLS, 'standard');
  });

  // Saved Plans
  const [savedPlans, setSavedPlans] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLANS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      'PLAN-1001': {
        id: 'PLAN-1001',
        opportunityId: 'OPP-01',
        title: 'Data Analyst Intern',
        org: 'Nile Retail Group',
        savedAt: 'Today, 10:15 AM',
        intensity: 'standard',
        uncovered: [],
        tasks: [
          { day: 1, title: 'SQL joins: Complete the 5 join queries in R-01 and note which join type you used', minutes: 45, resId: 'R-01', done: true, isRest: false },
          { day: 2, title: 'SQL filtering: Practice GROUP BY & HAVING queries on retail transaction orders (R-03)', minutes: 40, resId: 'R-03', done: true, isRest: false },
          { day: 3, title: 'Excel & Data Visualization audit: Review KPIs in R-02 and outline an executive summary dashboard', minutes: 30, resId: 'R-02', done: false, isRest: false },
          { day: 4, title: 'Mid-week Rest & Synthesis: Consolidate query notes and review SQL syntax cheat sheet', minutes: 0, resId: null, done: false, isRest: true },
          { day: 5, title: 'Simulated Challenge: Write a 3-table join query to calculate weekly store sales velocity', minutes: 50, resId: 'R-01', done: false, isRest: false },
          { day: 6, title: 'Dashboard Polish: Build a mini interactive chart showing inventory stockout alerts', minutes: 35, resId: 'R-02', done: false, isRest: false },
          { day: 7, title: 'Final Retrospective: Document your SQL queries & dashboard link for your student portfolio', minutes: 25, resId: null, done: false, isRest: false }
        ]
      }
    };
  });

  // UI Micro-States
  const [scoreDeltas, setScoreDeltas] = useState({});
  const [isReranking, setIsReranking] = useState(false);
  const [highlightedSkillId, setHighlightedSkillId] = useState(null);
  const [lastSavedPlanId, setLastSavedPlanId] = useState('PLAN-1001');

  // Filters for Step 2
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMin60, setFilterMin60] = useState(false);
  const [filterHideMissingReq, setFilterHideMissingReq] = useState(false);

  // Chat Panel
  const [chatOpen, setChatOpen] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hi! I'm your CareerPath AI adviser. Once you upload or paste your CV, I can explain match criteria, adjust your skills, or tune your 7-day study plan. Try typing 'remove SQL', 'add Figma, working', or 'Why is #1 my best match?'.",
      timestamp: 'Just now'
    }
  ]);

  // Persist skills & saved plans to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SKILLS, JSON.stringify(skills));
    } catch {}
  }, [skills]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(savedPlans));
    } catch {}
  }, [savedPlans]);

  // Ranked Opportunities (computed via mock scoring formula)
  const previousScores = useRef({});
  const rankedOpportunities = useMemo(() => {
    return rankAllOpportunities(skills);
  }, [skills]);

  // Current selected opportunity with computed fit
  const selectedOpportunity = useMemo(() => {
    return rankedOpportunities.find(o => o.id === selectedOppId) || rankedOpportunities[0];
  }, [rankedOpportunities, selectedOppId]);

  // Re-generate plan whenever chosen opportunity or intensity changes
  useEffect(() => {
    if (selectedOpportunity) {
      const newPlan = generatePlanForOpportunity(selectedOpportunity, skills, planIntensity);
      setActivePlan(newPlan);
    }
  }, [selectedOpportunity, planIntensity, skills]);

  // Core skill mutation with animation and delta badges
  const triggerSkillUpdate = useCallback((nextSkills, changedSkillId = null) => {
    setIsReranking(true);
    if (changedSkillId) {
      setHighlightedSkillId(changedSkillId);
      setTimeout(() => setHighlightedSkillId(null), 2000);
    }

    const oldTopId = rankedOpportunities[0]?.id;

    setTimeout(() => {
      const nextRanked = rankAllOpportunities(nextSkills);
      const deltas = {};

      nextRanked.forEach((item, index) => {
        const oldScore = previousScores.current[item.id];
        if (oldScore !== undefined) {
          const diff = item.score - oldScore;
          if (diff !== 0) {
            deltas[item.id] = {
              delta: diff > 0 ? `+${diff}` : `${diff}`,
              isNewTop: index === 0 && oldTopId !== item.id
            };
          }
        }
        previousScores.current[item.id] = item.score;
      });

      setScoreDeltas(deltas);
      setSkills(nextSkills);
      setIsReranking(false);

      // Deltas fade after ~4 seconds
      setTimeout(() => setScoreDeltas({}), 4000);
    }, 300);
  }, [rankedOpportunities]);

  // Helper actions
  const updateSkillLevel = (id, newLevel) => {
    const next = skills.map(s => s.id === id ? { ...s, level: newLevel, removed: false } : s);
    triggerSkillUpdate(next, id);
  };

  const removeSkill = (id) => {
    const next = skills.map(s => s.id === id ? { ...s, removed: true } : s);
    triggerSkillUpdate(next, id);
  };

  const restoreSkill = (id) => {
    const next = skills.map(s => s.id === id ? { ...s, removed: false } : s);
    triggerSkillUpdate(next, id);
  };

  const addSkill = (name, level = 'working', evidence = '') => {
    const existingIndex = skills.findIndex(s => s.name.toLowerCase() === name.toLowerCase());
    let next = [];
    let targetId = '';

    if (existingIndex >= 0) {
      targetId = skills[existingIndex].id;
      next = skills.map((s, idx) =>
        idx === existingIndex
          ? { ...s, level, evidence: evidence || s.evidence, removed: false }
          : s
      );
    } else {
      targetId = `sk-${Date.now()}`;
      next = [
        ...skills,
        {
          id: targetId,
          name,
          level,
          evidence: evidence || 'Added from student profile update.',
          weakEvidence: false,
          removed: false
        }
      ];
    }

    triggerSkillUpdate(next, targetId);
  };

  const extractSkillsFromCurrentCv = (textToUse) => {
    const content = textToUse !== undefined ? textToUse : cvText;
    const extracted = extractSkillsFromCv(content);
    triggerSkillUpdate(extracted);
  };

  const clearCv = () => {
    setCvText('');
    setUploadedFile(null);
  };

  const resetToDemo = () => {
    clearCv();
  };

  // Chat sender with simulated 700ms typing delay
  const sendChatMessage = (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMessage]);
    setAiTyping(true);

    setTimeout(() => {
      const parsed = parseChatMessage(text, skills, activePlan);

      if (parsed.action === 'lighten_plan') {
        setPlanIntensity('light');
      } else if (parsed.updatedSkills && parsed.updatedSkills !== skills) {
        triggerSkillUpdate(parsed.updatedSkills);
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: parsed.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setAiTyping(false);
    }, 700);
  };

  // Edit specific task in active plan
  const updateActivePlanTask = (day, updates) => {
    setActivePlan(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.day === day ? { ...t, ...updates } : t)
    }));
  };

  // Save current active plan
  const saveCurrentPlan = () => {
    const newId = `PLAN-${Math.floor(1000 + Math.random() * 9000)}`;
    const newSaved = {
      id: newId,
      opportunityId: selectedOpportunity.id,
      title: selectedOpportunity.title,
      org: selectedOpportunity.organization,
      savedAt: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      intensity: planIntensity,
      uncovered: activePlan.uncovered,
      tasks: activePlan.tasks
    };

    setSavedPlans(prev => ({ ...prev, [newId]: newSaved }));
    setLastSavedPlanId(newId);
    return newId;
  };

  // Toggle task in saved plan
  const toggleSavedPlanTaskDone = (planId, day) => {
    setSavedPlans(prev => {
      const plan = prev[planId];
      if (!plan) return prev;
      return {
        ...prev,
        [planId]: {
          ...plan,
          tasks: plan.tasks.map(t => t.day === day ? { ...t, done: !t.done } : t)
        }
      };
    });
  };

  return {
    step,
    setStep,
    cvText,
    setCvText,
    uploadedFile,
    setUploadedFile,
    extractSkillsFromCurrentCv,
    clearCv,
    isExtracting,
    setIsExtracting,
    skills,
    highlightedSkillId,
    updateSkillLevel,
    removeSkill,
    restoreSkill,
    addSkill,
    resetToDemo,
    selectedOppId,
    setSelectedOppId,
    selectedOpportunity,
    rankedOpportunities,
    scoreDeltas,
    isReranking,
    searchTerm,
    setSearchTerm,
    filterMin60,
    setFilterMin60,
    filterHideMissingReq,
    setFilterHideMissingReq,
    planIntensity,
    setPlanIntensity,
    activePlan,
    updateActivePlanTask,
    savedPlans,
    lastSavedPlanId,
    saveCurrentPlan,
    toggleSavedPlanTaskDone,
    chatOpen,
    setChatOpen,
    aiTyping,
    chatMessages,
    sendChatMessage
  };
}
