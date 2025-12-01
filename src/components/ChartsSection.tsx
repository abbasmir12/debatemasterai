import { SessionHistoryItem } from '../types';
import ScoreTrendChart from './ScoreTrendChart';
import DurationDistributionChart from './DurationDistributionChart';

interface ChartsSectionProps {
  sessions: SessionHistoryItem[];
}

export default function ChartsSection({ sessions }: ChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
      {/* Score Trend Chart - Requirement 8.2 */}
      <div className="bg-card border border-white/5 rounded-[2rem] p-4 md:p-6 animate-slideUp hover:scale-[1.01] hover:border-white/10 transition-all duration-300" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
        <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Score Trend</h3>
        <ScoreTrendChart sessions={sessions} />
      </div>

      {/* Duration Distribution Chart - Requirement 8.2 */}
      <div className="bg-card border border-white/5 rounded-[2rem] p-4 md:p-6 animate-slideUp hover:scale-[1.01] hover:border-white/10 transition-all duration-300" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
        <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Session Duration Distribution</h3>
        <DurationDistributionChart sessions={sessions} />
      </div>
    </div>
  );
}
