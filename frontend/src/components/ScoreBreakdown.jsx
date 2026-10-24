import React from 'react';

export default function ScoreBreakdown({ opportunity }) {
  if (!opportunity || !opportunity.breakdown) return null;

  return (
    <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-xs animate-fade-in">
      <div className="flex items-center justify-between text-slate-700">
        <span className="font-semibold">Calculation Breakdown</span>
        <span className="text-[11px] text-slate-500 font-mono">
          Required wt=2, Preferred wt=1
        </span>
      </div>

      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-slate-100/80 border-b border-slate-200 font-semibold text-slate-600">
            <tr>
              <th className="p-2">Skill</th>
              <th className="p-2">Weight</th>
              <th className="p-2">Your Level</th>
              <th className="p-2 text-right">Credit</th>
              <th className="p-2 text-right">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {opportunity.breakdown.map((row) => (
              <tr key={row.skill} className="hover:bg-slate-50/60">
                <td className="p-2 font-medium text-slate-900">
                  {row.skill} <span className="text-[10px] text-slate-400">({row.type})</span>
                </td>
                <td className="p-2 font-mono tabular-nums text-slate-600">
                  {row.weight}x
                </td>
                <td className="p-2 capitalize">
                  {row.level === 'none' ? (
                    <span className="text-amber-700 font-medium">Missing</span>
                  ) : (
                    <span className="text-slate-800">{row.level}</span>
                  )}
                </td>
                <td className="p-2 text-right font-mono tabular-nums text-slate-600">
                  {row.credit}%
                </td>
                <td className="p-2 text-right font-mono font-bold tabular-nums text-indigo-700">
                  +{row.points}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-slate-900">
            <tr>
              <td colSpan={4} className="p-2">Total Fit Score</td>
              <td className="p-2 text-right font-mono text-xs text-indigo-700 tabular-nums">
                {opportunity.score}%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="text-[10px] text-slate-500 italic leading-snug">
        Formula: <code>round(100 × sum(weight × credit) / sum(weight))</code>. Strong = 100%, Working = 70%, Beginner = 40%, Absent = 0%.
      </p>
    </div>
  );
}
