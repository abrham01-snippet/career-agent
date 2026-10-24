import React from 'react';
import LevelSelector from './LevelSelector.jsx';
import { Undo2, X, AlertTriangle } from 'lucide-react';

export default function SkillCard({
  skill,
  isHighlighted = false,
  onLevelChange,
  onRemove,
  onRestore
}) {
  if (skill.removed) {
    return (
      <div className="p-3 bg-slate-100/80 border border-slate-200/80 rounded-xl flex items-center justify-between transition-all">
        <div className="flex items-center gap-2">
          <span className="text-xs line-through text-slate-500 font-medium">{skill.name}</span>
          <span className="text-[11px] text-slate-400">Removed</span>
        </div>
        <button
          type="button"
          onClick={() => onRestore(skill.id)}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 transition-colors"
        >
          <Undo2 className="w-3.5 h-3.5" />
          <span>Undo</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`p-4 bg-white border rounded-xl shadow-2xs space-y-2.5 transition-all ${
        isHighlighted
          ? 'border-indigo-500 ring-2 ring-indigo-100 bg-indigo-50/20'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm text-slate-900">{skill.name}</h4>
            {skill.weakEvidence ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-md">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                <span>Weak evidence, please check</span>
              </span>
            ) : (
              <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                Verified
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 italic leading-relaxed">
            "{skill.evidence}"
          </p>
        </div>

        <button
          type="button"
          onClick={() => onRemove(skill.id)}
          className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
          title={`Remove ${skill.name}`}
          aria-label={`Remove ${skill.name}`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Proficiency Level
        </span>
        <LevelSelector
          currentLevel={skill.level}
          onSelect={(lvl) => onLevelChange(skill.id, lvl)}
        />
      </div>
    </div>
  );
}
