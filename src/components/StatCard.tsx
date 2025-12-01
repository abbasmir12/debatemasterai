/**
 * StatCard Component
 * Reusable card component for displaying statistics with icon, title, value, and optional trend
 * Requirement 5.5
 */

import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: 'lime' | 'indigo' | 'emerald' | 'amber';
}

function StatCard({ title, value, subtitle, icon, trend, color = 'lime' }: StatCardProps) {
  // Color variant classes
  const colorClasses = {
    lime: {
      iconBg: 'bg-lime-400/10',
      iconText: 'text-lime-400',
      valueText: 'text-lime-400',
      trendUp: 'text-lime-400',
      trendDown: 'text-red-400',
    },
    indigo: {
      iconBg: 'bg-indigo-500/10',
      iconText: 'text-indigo-400',
      valueText: 'text-indigo-400',
      trendUp: 'text-indigo-400',
      trendDown: 'text-red-400',
    },
    emerald: {
      iconBg: 'bg-emerald-500/10',
      iconText: 'text-emerald-400',
      valueText: 'text-emerald-400',
      trendUp: 'text-emerald-400',
      trendDown: 'text-red-400',
    },
    amber: {
      iconBg: 'bg-amber-500/10',
      iconText: 'text-amber-400',
      valueText: 'text-amber-400',
      trendUp: 'text-amber-400',
      trendDown: 'text-red-400',
    },
  };

  const colors = colorClasses[color];

  return (
    <div className="bg-card border border-white/5 rounded-[2rem] p-4 md:p-6 hover:border-white/10 hover:scale-[1.02] hover:shadow-xl transition-all duration-300">
      {/* Icon */}
      <div className={`w-10 h-10 md:w-12 md:h-12 ${colors.iconBg} rounded-xl flex items-center justify-center mb-3 md:mb-4`}>
        <div className={colors.iconText}>{icon}</div>
      </div>

      {/* Title */}
      <h3 className="text-xs md:text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">
        {title}
      </h3>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-1">
        <p className={`text-3xl md:text-4xl font-black tracking-tighter ${colors.valueText}`}>
          {value}
        </p>
        
        {/* Trend indicator */}
        {trend && (
          <span
            className={`text-sm font-bold flex items-center gap-1 ${
              trend.direction === 'up' ? colors.trendUp : colors.trendDown
            }`}
          >
            {trend.direction === 'up' ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {Math.abs(trend.value)}%
          </span>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
      )}
    </div>
  );
}

export default StatCard;
