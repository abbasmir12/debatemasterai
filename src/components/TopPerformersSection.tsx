/**
 * TopPerformersSection Component
 * Requirements: 7.2, 7.3
 * 
 * Displays the top 3 highest-scoring debate sessions with visual emphasis.
 * Shows topic, score, and date for each top performer.
 */

import { SessionHistoryItem } from '../types';

interface TopPerformersSectionProps {
  sessions: SessionHistoryItem[];
}

export default function TopPerformersSection({ sessions }: TopPerformersSectionProps) {
  if (sessions.length === 0) {
    return null;
  }

  // Format date to readable string
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Get medal emoji based on rank
  const getMedal = (index: number): string => {
    const medals = ['🥇', '🥈', '🥉'];
    return medals[index] || '';
  };

  // Get border color based on rank
  const getBorderColor = (index: number): string => {
    const colors = [
      'border-lime-400',
      'border-indigo-400',
      'border-emerald-400'
    ];
    return colors[index] || 'border-slate-600';
  };

  // Get background color based on rank
  const getBackgroundColor = (index: number): string => {
    const colors = [
      'bg-lime-400/5',
      'bg-indigo-400/5',
      'bg-emerald-400/5'
    ];
    return colors[index] || 'bg-slate-800/20';
  };

  return (
    <div className="bg-card border border-white/5 rounded-[2rem] p-6 md:p-8 hover:border-white/10 transition-colors duration-300">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
        🏆 Top Performers
      </h2>
      
      <div className="space-y-4">
        {sessions.map((session, index) => (
          <div
            key={session.id}
            className={`
              border-2 ${getBorderColor(index)} ${getBackgroundColor(index)}
              rounded-2xl p-4 md:p-6
              transition-all duration-300
              hover:scale-[1.03] hover:shadow-xl hover:shadow-lime-400/10
            `}
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left side: Medal and content */}
              <div className="flex items-start gap-3 md:gap-4 flex-1 min-w-0">
                <div className="text-3xl md:text-4xl flex-shrink-0">
                  {getMedal(index)}
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* Topic */}
                  <h3 className="text-base md:text-lg font-bold text-white mb-2 truncate">
                    {session.topic}
                  </h3>
                  
                  {/* Date */}
                  <p className="text-xs md:text-sm text-slate-400 mb-1">
                    {formatDate(session.date)}
                  </p>
                  
                  {/* Duration */}
                  <p className="text-xs md:text-sm text-slate-400">
                    {Math.floor(session.durationSeconds / 60)} min
                  </p>
                </div>
              </div>
              
              {/* Right side: Score */}
              <div className="flex-shrink-0 text-right">
                <div className="text-3xl md:text-4xl font-black text-lime-400">
                  {session.score}
                </div>
                <div className="text-xs md:text-sm text-slate-400 font-medium uppercase tracking-wider">
                  Score
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {sessions.length < 3 && (
        <p className="text-sm text-slate-400 mt-4 text-center">
          Complete more debates to fill your podium! 🎯
        </p>
      )}
    </div>
  );
}
