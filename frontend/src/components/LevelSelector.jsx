import React from 'react';

const LEVELS = [
  { key: 'beginner', label: 'Beginner' },
  { key: 'working', label: 'Working' },
  { key: 'strong', label: 'Strong' }
];

export default function LevelSelector({ currentLevel, onSelect, disabled = false }) {
  return (
    <div className="inline-flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs" role="group">
      {LEVELS.map(({ key, label }) => {
        const isSelected = currentLevel === key;
        return (
          <button
            key={key}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(key)}
            className={`px-2.5 py-1 rounded-md font-medium text-[11px] transition-all whitespace-nowrap ${
              isSelected
                ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900 disabled:opacity-40'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
