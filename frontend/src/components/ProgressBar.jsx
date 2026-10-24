import React from 'react';

export default function ProgressBar({ completed, total, label = 'done' }) {
  const percentage = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

  return (
    <div className="space-y-1.5 text-xs">
      <div className="flex items-center justify-between text-slate-600 font-medium">
        <span>Progress</span>
        <span className="font-mono tabular-nums text-indigo-700 font-bold">
          {completed} of {total} {label} ({percentage}%)
        </span>
      </div>
      <div className="w-full h-2.5 bg-slate-100 border border-slate-200/80 rounded-full overflow-hidden p-0.5">
        <div
          className="h-full bg-indigo-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
