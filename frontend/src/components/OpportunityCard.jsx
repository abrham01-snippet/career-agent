import React, { useState } from 'react';
import ScoreRing from './ScoreRing.jsx';
import SkillChip from './SkillChip.jsx';
import ScoreBreakdown from './ScoreBreakdown.jsx';
import { ChevronDown, ChevronUp, ChevronRight, Sparkles } from 'lucide-react';

export default function OpportunityCard({
  opportunity,
  rank,
  deltaInfo,
  isSelected,
  onSelectWhyFits,
  onSelectPlan
}) {
  const [breakdownOpen, setBreakdownOpen] = useState(false);

  return (
    <div
      className={`p-4 bg-white border rounded-xl shadow-2xs space-y-3 relative transition-all duration-300 ${
        isSelected
          ? 'border-indigo-500 ring-2 ring-indigo-100 bg-white'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Animated Change Badge ("+8", "-12", "new #1") */}
      {deltaInfo && (
        <div className="absolute top-3 right-3 animate-bounce z-10">
          <span className={`inline-flex items-center gap-1 font-mono font-bold text-[11px] px-2 py-0.5 rounded-full shadow-xs text-white ${
            deltaInfo.isNewTop
              ? 'bg-amber-600 ring-2 ring-amber-200'
              : deltaInfo.delta.startsWith('+')
              ? 'bg-emerald-600 ring-1 ring-emerald-200'
              : 'bg-rose-600 ring-1 ring-rose-200'
          }`}>
            {deltaInfo.isNewTop ? (
              <>
                <Sparkles className="w-3 h-3" />
                <span>New #1 Fit!</span>
              </>
            ) : (
              <span>{deltaInfo.delta} pts</span>
            )}
          </span>
        </div>
      )}

      {/* Header Info */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="font-bold text-slate-700">#{rank} Ranked Fit</span>
            <span aria-hidden="true">·</span>
            <span>{opportunity.type}</span>
          </div>
          <h4 className="font-bold text-base text-slate-900 leading-snug">
            {opportunity.title}
          </h4>
          <p className="text-xs text-slate-500 font-medium">
            {opportunity.organization}
          </p>
        </div>

        <ScoreRing score={opportunity.score} size="md" />
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">
        {opportunity.description}
      </p>

      {/* Matched & Missing Chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        {opportunity.matched.map((m) => (
          <SkillChip
            key={m.name}
            name={m.name}
            level={m.level}
            variant="matched"
          />
        ))}
        {opportunity.missing.map((m) => (
          <SkillChip
            key={m.name}
            name={m.name}
            variant="missing"
            isRequired={m.isRequired}
          />
        ))}
      </div>

      {/* Expandable How this score was calculated toggle */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => setBreakdownOpen(!breakdownOpen)}
          className="text-slate-500 hover:text-slate-900 font-medium flex items-center gap-1 transition-colors"
        >
          <span>{breakdownOpen ? 'Hide score calculation' : 'How this score was calculated'}</span>
          {breakdownOpen ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        <div className="flex items-center gap-2">
          {onSelectWhyFits && (
            <button
              type="button"
              onClick={onSelectWhyFits}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Why it fits
            </button>
          )}

          {onSelectPlan && (
            <button
              type="button"
              onClick={onSelectPlan}
              className="px-3 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-colors flex items-center gap-1"
            >
              <span>Plan for this</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {breakdownOpen && <ScoreBreakdown opportunity={opportunity} />}
    </div>
  );
}
