import React, { useState, useMemo } from 'react';
import { INITIAL_SKILLS, OPPORTUNITIES, computeOpportunityFit } from '../data/mock.js';
import ScoreRing from './ScoreRing.jsx';
import { Sparkles, RotateCcw } from 'lucide-react';

export default function LandingDemoWidget() {
  // Use 5 core skill toggles for the interactive demo strip
  const [demoSkills, setDemoSkills] = useState(INITIAL_SKILLS.slice(0, 5));

  const toggleSkill = (id) => {
    setDemoSkills(prev =>
      prev.map(s => s.id === id ? { ...s, removed: !s.removed } : s)
    );
  };

  const resetSkills = () => {
    setDemoSkills(INITIAL_SKILLS.slice(0, 5).map(s => ({ ...s, removed: false })));
  };

  const ranked = useMemo(() => {
    return OPPORTUNITIES
      .map(opp => computeOpportunityFit(opp, demoSkills))
      .sort((a, b) => b.score - a.score);
  }, [demoSkills]);

  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Live Engine Demo</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Toggle skills to watch live match score changes.
          </p>
        </div>

        <button
          type="button"
          onClick={resetSkills}
          className="text-xs text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 font-medium flex items-center gap-1 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* 5 Skill toggle chips */}
      <div className="flex flex-wrap gap-1.5 pt-0.5">
        {demoSkills.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => toggleSkill(s.id)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              s.removed
                ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 line-through'
                : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 shadow-2xs hover:bg-indigo-100 dark:hover:bg-indigo-900/60'
            }`}
          >
            <span>{s.name}</span>
            <span className="text-[10px] opacity-60 font-normal">
              {s.removed ? 'off' : 'on'}
            </span>
          </button>
        ))}
      </div>

      {/* 5 Jobs Re-sorting live */}
      <div className="space-y-2 pt-1">
        {ranked.map((opp, idx) => (
          <div
            key={opp.id}
            className="p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 rounded-xl flex items-center justify-between gap-3 transition-all duration-300 hover:bg-white dark:hover:bg-slate-800/80"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-6 h-6 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-slate-600 dark:text-slate-300 shrink-0">
                #{idx + 1}
              </span>
              <div className="min-w-0 truncate">
                <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">{opp.title}</h5>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{opp.organization}</span>
              </div>
            </div>

            <div className="shrink-0">
              <ScoreRing score={opp.score} size="sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
