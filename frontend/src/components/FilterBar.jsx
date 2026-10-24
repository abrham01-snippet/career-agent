import React from 'react';
import { Search } from 'lucide-react';

export default function FilterBar({
  searchTerm,
  onSearchChange,
  filterMin60,
  onFilterMin60Change,
  filterHideMissingReq,
  onFilterHideMissingReqChange,
  resultsCount
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs space-y-2.5">
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter opportunities by role, organization, or skill..."
          className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-colors"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 pt-0.5">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 transition-colors">
            <input
              type="checkbox"
              checked={filterMin60}
              onChange={(e) => onFilterMin60Change(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Score &ge; 60%</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 transition-colors">
            <input
              type="checkbox"
              checked={filterHideMissingReq}
              onChange={(e) => onFilterHideMissingReqChange(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Hide jobs missing a required skill</span>
          </label>
        </div>

        <div className="text-[11px] text-slate-400 font-mono tabular-nums">
          Showing {resultsCount} {resultsCount === 1 ? 'role' : 'roles'}
        </div>
      </div>
    </div>
  );
}
