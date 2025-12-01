import { useState, useMemo } from 'react';
import { SessionHistoryItem } from '../types';
import SessionListItem from './SessionListItem';
import { History, ChevronLeft, ChevronRight } from 'lucide-react';

interface SessionHistoryListProps {
  sessions: SessionHistoryItem[];
}

const ITEMS_PER_PAGE = 10;

export default function SessionHistoryList({ sessions }: SessionHistoryListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Sort sessions by date descending (most recent first)
  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
      // Tie-breaking by session ID if dates are equal
      if (dateCompare === 0) {
        return b.id.localeCompare(a.id);
      }
      return dateCompare;
    });
  }, [sessions]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedSessions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedSessions = sortedSessions.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  // Empty state
  if (sessions.length === 0) {
    return (
      <div className="bg-card rounded-[2rem] p-8 md:p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-lime-400/10 flex items-center justify-center">
            <History className="w-7 h-7 md:w-8 md:h-8 text-lime-400" />
          </div>
        </div>
        <h3 className="text-lg md:text-xl font-bold text-white mb-2">No Sessions Yet</h3>
        <p className="text-sm md:text-base text-slate-400 max-w-md mx-auto">
          Start your first debate to see your session history here. Every practice session helps you
          improve!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 md:w-5 md:h-5 text-lime-400" />
          <h2 className="text-lg md:text-xl font-bold text-white">Session History</h2>
          <span className="text-xs md:text-sm text-slate-400">({sortedSessions.length} total)</span>
        </div>
      </div>

      {/* Session List */}
      <div className="space-y-3">
        {paginatedSessions.map((session) => (
          <SessionListItem key={session.id} session={session} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 gap-2">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-xl text-sm md:text-base font-medium transition-all ${
              currentPage === 1
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-card text-white hover:bg-lime-400/10 hover:text-lime-400'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm text-slate-400">
              <span className="hidden sm:inline">Page </span>{currentPage}<span className="hidden sm:inline"> of {totalPages}</span><span className="sm:hidden">/{totalPages}</span>
            </span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-xl text-sm md:text-base font-medium transition-all ${
              currentPage === totalPages
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-card text-white hover:bg-lime-400/10 hover:text-lime-400'
            }`}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
