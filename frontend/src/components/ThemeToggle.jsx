import React from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle({ className = '', showLabel = true }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to night mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to night mode'}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 cursor-pointer select-none shadow-2xs ${
        isDark
          ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700 hover:border-slate-600 focus:ring-2 focus:ring-amber-400/30'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200/90 hover:border-slate-300 focus:ring-2 focus:ring-indigo-500/20'
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
        {isDark ? (
          <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-once" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-indigo-600" />
        )}
      </div>

      {showLabel && (
        <span className="whitespace-nowrap font-medium text-xs">
          {isDark ? 'Light' : 'Night'}
        </span>
      )}
    </button>
  );
}
