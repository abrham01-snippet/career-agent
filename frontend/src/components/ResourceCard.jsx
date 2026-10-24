import React from 'react';
import { BookOpen, Dumbbell, Clock, Tag } from 'lucide-react';

export default function ResourceCard({ resource, isUncovered = false, uncoveredSkill = 'Figma' }) {
  if (isUncovered) {
    return (
      <div className="p-4 bg-slate-100 border border-slate-200/80 rounded-xl space-y-1.5 opacity-90">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-mono font-bold text-slate-400">UNCOVERED</span>
          <span className="text-[11px] font-medium text-slate-500">Self-guided</span>
        </div>
        <h4 className="text-xs font-bold text-slate-700">
          No resource available yet for {uncoveredSkill}
        </h4>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          We do not have a curated exercise in our catalog for {uncoveredSkill} yet. We recommend independent project practice and tutorial docs.
        </p>
      </div>
    );
  }

  const isExercise = resource.type === 'exercise';

  return (
    <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2 hover:border-slate-300 transition-colors">
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
          {resource.id}
        </span>
        <div className="flex items-center gap-1 text-slate-500 text-[11px] font-mono tabular-nums">
          <Clock className="w-3 h-3" />
          <span>{resource.minutes} min</span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          {isExercise ? (
            <Dumbbell className="w-3 h-3 text-indigo-500" />
          ) : (
            <BookOpen className="w-3 h-3 text-emerald-500" />
          )}
          <span className="capitalize">{resource.type}</span>
          <span aria-hidden="true">·</span>
          <span className="text-indigo-600 font-semibold">{resource.tag}</span>
        </div>

        <h4 className="text-xs font-bold text-slate-900 leading-snug">
          {resource.title}
        </h4>

        {resource.description && (
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {resource.description}
          </p>
        )}
      </div>
    </div>
  );
}
