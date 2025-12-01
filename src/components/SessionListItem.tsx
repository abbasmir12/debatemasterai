import { useState } from 'react';
import { SessionHistoryItem } from '../types';
import { ChevronDown, ChevronUp, Calendar, Clock, Trophy } from 'lucide-react';

interface SessionListItemProps {
  session: SessionHistoryItem;
  rank?: number;
}

export default function SessionListItem({ session, rank }: SessionListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes === 0) {
      return `${remainingSeconds}s`;
    }
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-lime-400';
    if (score >= 60) return 'text-emerald-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-lime-400/10';
    if (score >= 60) return 'bg-emerald-400/10';
    if (score >= 40) return 'bg-amber-400/10';
    return 'bg-red-400/10';
  };

  return (
    <div
      className={`bg-card rounded-2xl p-3 md:p-4 transition-all duration-200 hover:bg-card/80 hover:scale-[1.01] cursor-pointer border ${
        rank ? 'border-2 border-lime-400/30' : 'border-white/5 hover:border-white/10'
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Main Content */}
      <div className="flex items-start justify-between gap-3 md:gap-4">
        <div className="flex-1 min-w-0">
          {/* Topic */}
          <div className="flex items-center gap-2 mb-2">
            {rank && (
              <div className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full bg-lime-400/20 text-lime-400 text-xs font-bold">
                #{rank}
              </div>
            )}
            <h3 className="text-sm md:text-base font-semibold text-white truncate">{session.topic}</h3>
          </div>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(session.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatDuration(session.durationSeconds)}</span>
            </div>
          </div>
        </div>

        {/* Score Badge */}
        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          <div
            className={`flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 rounded-full ${getScoreBgColor(
              session.score
            )}`}
          >
            <Trophy className={`w-3 h-3 ${getScoreColor(session.score)}`} />
            <span className={`text-xs md:text-sm font-bold ${getScoreColor(session.score)}`}>
              {session.score}
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-slate-700/50 animate-fadeIn">
          <div className="grid grid-cols-2 gap-3 md:gap-4 text-sm">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Session ID</p>
              <p className="text-white font-mono text-xs truncate">{session.id}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Time</p>
              <p className="text-white text-xs md:text-sm">{formatTime(session.date)}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Duration</p>
              <p className="text-white text-xs md:text-sm">{formatDuration(session.durationSeconds)}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Performance</p>
              <p className={`font-bold text-xs md:text-sm ${getScoreColor(session.score)}`}>{session.score}/100</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
