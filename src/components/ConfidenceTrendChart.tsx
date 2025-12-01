/**
 * ConfidenceTrendChart component - Displays confidence level progression over time
 */

import { SessionHistoryItem } from '../types';

interface ConfidenceTrendChartProps {
  sessions: SessionHistoryItem[];
}

export default function ConfidenceTrendChart({ sessions }: ConfidenceTrendChartProps) {
  // Filter sessions that have confidence data and sort by date
  const sessionsWithConfidence = sessions
    .filter(s => s.confidenceLevel)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-10); // Show last 10 sessions

  if (sessionsWithConfidence.length === 0) {
    return (
      <div className="bg-card border border-white/5 rounded-[2rem] p-6 md:p-8">
        <h3 className="text-white text-lg md:text-xl font-bold mb-4">Confidence Trend</h3>
        <div className="text-center py-8">
          <p className="text-slate-400 text-sm">No confidence data available yet</p>
        </div>
      </div>
    );
  }

  // Convert confidence levels to numeric values for charting
  const confidenceToValue = (level: string | undefined): number => {
    switch (level) {
      case 'Low': return 25;
      case 'Medium': return 50;
      case 'High': return 75;
      case 'Unstoppable': return 100;
      default: return 0;
    }
  };

  const maxValue = 100;
  const chartHeight = 200;

  return (
    <div className="bg-card border border-white/5 rounded-[2rem] p-6 md:p-8">
      <h3 className="text-white text-lg md:text-xl font-bold mb-6">Confidence Progression</h3>
      
      {/* Chart */}
      <div className="relative" style={{ height: `${chartHeight}px` }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-500 pr-2">
          <span>Unstoppable</span>
          <span>High</span>
          <span>Medium</span>
          <span>Low</span>
        </div>

        {/* Chart area */}
        <div className="ml-20 h-full relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="border-t border-white/5" />
            ))}
          </div>

          {/* Data visualization */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            {/* Area fill */}
            <defs>
              <linearGradient id="confidenceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(163, 230, 53)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="rgb(163, 230, 53)" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {sessionsWithConfidence.length > 1 && (
              <>
                {/* Area path */}
                <path
                  d={`
                    M 0,${chartHeight}
                    ${sessionsWithConfidence.map((session, index) => {
                      const x = (index / (sessionsWithConfidence.length - 1)) * 100;
                      const value = confidenceToValue(session.confidenceLevel);
                      const y = chartHeight - (value / maxValue) * chartHeight;
                      return `L ${x}%,${y}`;
                    }).join(' ')}
                    L 100%,${chartHeight}
                    Z
                  `}
                  fill="url(#confidenceGradient)"
                />

                {/* Line path */}
                <path
                  d={sessionsWithConfidence.map((session, index) => {
                    const x = (index / (sessionsWithConfidence.length - 1)) * 100;
                    const value = confidenceToValue(session.confidenceLevel);
                    const y = chartHeight - (value / maxValue) * chartHeight;
                    return `${index === 0 ? 'M' : 'L'} ${x}%,${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="rgb(163, 230, 53)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            )}

            {/* Data points */}
            {sessionsWithConfidence.map((session, index) => {
              const x = (index / Math.max(sessionsWithConfidence.length - 1, 1)) * 100;
              const value = confidenceToValue(session.confidenceLevel);
              const y = chartHeight - (value / maxValue) * chartHeight;
              
              return (
                <g key={session.id}>
                  <circle
                    cx={`${x}%`}
                    cy={y}
                    r="5"
                    fill="rgb(163, 230, 53)"
                    stroke="rgb(24, 24, 27)"
                    strokeWidth="2"
                  />
                  <circle
                    cx={`${x}%`}
                    cy={y}
                    r="8"
                    fill="transparent"
                    className="hover:fill-lime-400/20 transition-all cursor-pointer"
                  >
                    <title>{`${session.confidenceLevel} - ${new Date(session.date).toLocaleDateString()}`}</title>
                  </circle>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <span className="text-slate-400">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="text-slate-400">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-lime-400" />
          <span className="text-slate-400">High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="text-slate-400">Unstoppable</span>
        </div>
      </div>

      {/* Stats summary */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {['Low', 'Medium', 'High', 'Unstoppable'].map(level => {
          const count = sessionsWithConfidence.filter(s => s.confidenceLevel === level).length;
          const percentage = Math.round((count / sessionsWithConfidence.length) * 100);
          
          return (
            <div key={level} className="bg-void/50 rounded-xl p-3 text-center">
              <div className="text-slate-400 text-xs mb-1">{level}</div>
              <div className="text-white text-lg font-bold">{count}</div>
              <div className="text-slate-500 text-xs">{percentage}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
