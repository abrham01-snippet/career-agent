import React, { useState } from 'react';
import LevelSelector from './LevelSelector.jsx';
import { Undo2, X, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

export default function SkillCard({
  skill,
  isHighlighted = false,
  onLevelChange,
  onRemove,
  onRestore
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (skill.removed) {
    return (
      <div className="p-2.5 bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl flex items-center justify-between transition-all">
        <div className="flex items-center gap-2">
          <span className="text-xs line-through text-slate-400 dark:text-slate-500 font-medium">{skill.name}</span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">Removed</span>
        </div>
        <button
          type="button"
          onClick={() => onRestore(skill.id)}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Undo2 className="w-3.5 h-3.5" />
          <span>Undo</span>
        </button>
      </div>
    );
  }


  return (
    <div
      className={`bg-white dark:bg-[#111827] border rounded-xl shadow-2xs transition-all overflow-hidden ${
        isHighlighted
          ? 'border-indigo-500 ring-2 ring-indigo-100 dark:ring-indigo-900/50 bg-indigo-50/20'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Compact Collapsed Row */}
      <div className="p-3 sm:p-3.5 flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
            {skill.name}
          </h4>

          {skill.weakEvidence ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-1.5 py-0.5 rounded shrink-0">
              <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">Weak evidence</span>
            </span>
          ) : (
            <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/60 px-1.5 py-0.5 rounded shrink-0">
              Verified
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* See more / See less button */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center gap-0.5 px-1.5 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <span>{isExpanded ? 'See less' : 'See more'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Remove Skill Button */}
          <button
            type="button"
            onClick={() => onRemove(skill.id)}
            className="text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 p-1 rounded-md transition-colors cursor-pointer"
            title={`Remove ${skill.name}`}
            aria-label={`Remove ${skill.name}`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded Details Section */}
      {isExpanded && (
        <div className="px-3.5 pb-3.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 space-y-3 animate-fade-in">
          {/* Quoted Evidence */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Quoted Evidence from CV
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-white dark:bg-slate-800/70 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 leading-relaxed">
              "{skill.evidence || 'Demonstrated across submitted project descriptions.'}"
            </p>
          </div>

          {/* Interactive Level Tuning */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Tune Proficiency Level
            </span>
            <LevelSelector
              currentLevel={skill.level}
              onSelect={(lvl) => onLevelChange(skill.id, lvl)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
