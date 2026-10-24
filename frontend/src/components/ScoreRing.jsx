import React from 'react';

export default function ScoreRing({ score, size = 'md' }) {
  const isLg = size === 'lg';
  const isSm = size === 'sm';

  const strokeWidth = isLg ? 6 : isSm ? 3 : 4;
  const radius = isLg ? 26 : isSm ? 16 : 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = 'text-indigo-600';
  let strokeColor = '#4F46E5';
  if (score >= 75) {
    strokeColor = '#16A34A'; // success green
    colorClass = 'text-emerald-600';
  } else if (score < 50) {
    strokeColor = '#D97706'; // warning amber
    colorClass = 'text-amber-600';
  }

  const dim = (radius + strokeWidth) * 2;

  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      <svg width={dim} height={dim} className="-rotate-90 transform">
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className={`absolute inset-0 flex flex-col items-center justify-center font-mono font-bold tabular-nums ${colorClass}`}>
        <span className={isLg ? 'text-lg leading-none' : isSm ? 'text-[11px] leading-none' : 'text-sm leading-none'}>
          {score}%
        </span>
      </div>
    </div>
  );
}
