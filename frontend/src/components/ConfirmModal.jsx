import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  opportunity,
  plan,
  onConfirmSave
}) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isOpen) return null;

  const activeDaysCount = plan ? plan.tasks.filter(t => !t.isRest).length : 0;
  const totalMinutes = plan ? plan.tasks.reduce((acc, t) => acc + t.minutes, 0) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-fade-in">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight">Save this 7-Day Plan?</h3>
              <span className="text-[11px] text-slate-500 font-medium">CareerPath Student Action Plan</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary Details */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Target Opportunity:</span>
            <span className="font-bold text-slate-900 text-right">{opportunity?.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Organization:</span>
            <span className="font-medium text-slate-700">{opportunity?.organization}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Total Activities:</span>
            <span className="font-mono tabular-nums text-slate-700">{activeDaysCount} sessions (1 rest day)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Total Study Time:</span>
            <span className="font-mono tabular-nums text-indigo-700 font-bold">{totalMinutes} minutes</span>
          </div>
        </div>

        {/* Checkbox */}
        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 select-none">
          <input
            type="checkbox"
            checked={isConfirmed}
            onChange={(e) => setIsConfirmed(e.target.checked)}
            className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="leading-snug">
            I confirm this plan and understand this is for student career guidance and skill preparation only.
          </span>
        </label>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!isConfirmed}
            onClick={() => {
              onConfirmSave();
              onClose();
            }}
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors"
          >
            Confirm and Save Plan
          </button>
        </div>
      </div>
    </div>
  );
}
