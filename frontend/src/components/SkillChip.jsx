import React from 'react';

export default function SkillChip({ name, level, variant = 'default', isRequired = false, onRemove }) {
  if (variant === 'matched') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80">
        <span className="text-[10px]">✓</span>
        <span>{name}</span>
        {level && <span className="text-[10px] text-emerald-600 capitalize">({level})</span>}
      </span>
    );
  }

  if (variant === 'missing') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium border ${
        isRequired
          ? 'bg-amber-50 text-amber-800 border-amber-300'
          : 'bg-slate-100 text-slate-600 border-slate-200'
      }`}>
        <span className="text-[10px] font-bold">!</span>
        <span>Missing {name}</span>
        {isRequired && <span className="text-[10px] text-amber-700 font-bold">(Req)</span>}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-white border border-slate-200 text-slate-800 shadow-2xs">
      <span>{name}</span>
      {level && <span className="text-slate-400 capitalize text-[11px] font-normal">· {level}</span>}
      {onRemove && (
        <button
          onClick={onRemove}
          className="text-slate-400 hover:text-slate-700 focus:outline-none"
          title="Remove"
        >
          ×
        </button>
      )}
    </span>
  );
}
