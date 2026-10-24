import React from 'react';
import ScoreRing from './ScoreRing.jsx';
import { ArrowRight, Quote, CheckCircle2, AlertCircle } from 'lucide-react';

export default function WhyItFits({ opportunity, rank, onBuildPlan }) {
  if (!opportunity) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="font-bold text-indigo-600">#{rank} Top Match</span>
            <span aria-hidden="true">·</span>
            <span>{opportunity.type}</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 leading-tight">
            {opportunity.title}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {opportunity.organization}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <ScoreRing score={opportunity.score} size="md" />
          <button
            type="button"
            onClick={onBuildPlan}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Build a plan for this</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Two columns: From your CV vs From the opportunity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: From your CV */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <Quote className="w-3.5 h-3.5 text-indigo-600" />
            <span>From your CV (Quoted Evidence)</span>
          </div>

          <div className="space-y-2">
            {opportunity.cvQuotes && opportunity.cvQuotes.length > 0 ? (
              opportunity.cvQuotes.map((quote, idx) => (
                <div key={idx} className="p-3 bg-white border border-slate-200/60 rounded-lg text-xs leading-relaxed text-slate-700 italic">
                  "{quote}"
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No specific CV quote recorded.</p>
            )}
          </div>
        </div>

        {/* Right: From the opportunity */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>From the Opportunity Specs</span>
          </div>

          <div className="space-y-2">
            {opportunity.oppQuotes && opportunity.oppQuotes.length > 0 ? (
              opportunity.oppQuotes.map((quote, idx) => (
                <div key={idx} className="p-3 bg-white border border-slate-200/60 rounded-lg text-xs leading-relaxed text-slate-700 italic">
                  "{quote}"
                </div>
              ))
            ) : (
              <div className="p-3 bg-white border border-slate-200/60 rounded-lg text-xs leading-relaxed text-slate-700 italic">
                "{opportunity.description}"
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Skills to build section */}
      <div className="p-4 bg-amber-50/50 border border-amber-200/70 rounded-xl space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>Skills to Build</span>
        </div>

        {opportunity.missing && opportunity.missing.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {opportunity.missing.map((m) => (
              <span
                key={m.name}
                className={`text-xs px-2.5 py-1 rounded-md font-medium border ${
                  m.isRequired
                    ? 'bg-amber-100/70 text-amber-900 border-amber-300 font-semibold'
                    : 'bg-white text-slate-700 border-amber-200'
                }`}
              >
                {m.name} {m.isRequired ? '(Required for role)' : '(Preferred bonus)'}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-emerald-800 font-medium">
            ✓ You have verified evidence for all required and preferred skills for this position!
          </p>
        )}
      </div>
    </div>
  );
}
