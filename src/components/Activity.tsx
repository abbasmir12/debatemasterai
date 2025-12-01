import { useState, useEffect, useMemo } from 'react';
import { SessionHistoryItem } from '../types';
import { getHistory } from '../services/storageService';
import StatCard from './StatCard';
import ChartsSection from './ChartsSection';
import ActivityHeatMap from './ActivityHeatMap';
import SessionHistoryList from './SessionHistoryList';
import TopPerformersSection from './TopPerformersSection';
import ConfidenceTrendChart from './ConfidenceTrendChart';
import {
  calculateTotalSessions,
  calculateTotalPracticeTime,
  calculateAverageScore,
  calculateCurrentStreak,
  getTopPerformers,
} from '../utils/statisticsUtils';

/**
 * Activity View Component
 * Displays comprehensive analytics and visualization of debate practice history
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 5.1, 5.2, 5.3, 5.4
 */

interface ActivityProps {
  onBack: () => void;
}

type TimeFilter = '7d' | '30d' | '90d' | 'all';

function Activity({ onBack }: ActivityProps) {
  const [sessions, setSessions] = useState<SessionHistoryItem[]>([]);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');

  // Load session history on mount - Requirement 1.2
  useEffect(() => {
    const history = getHistory();
    setSessions(history);
  }, []);

  // Compute filtered sessions based on time filter - Requirement 4.2
  const filteredSessions = useMemo(() => {
    if (timeFilter === 'all') {
      return sessions;
    }

    const now = new Date();
    const cutoffDate = new Date();

    // Calculate cutoff date based on filter
    switch (timeFilter) {
      case '7d':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        cutoffDate.setDate(now.getDate() - 90);
        break;
    }

    // Filter sessions that are after the cutoff date
    return sessions.filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate >= cutoffDate;
    });
  }, [sessions, timeFilter]);

  // Calculate statistics from filtered sessions - Requirements 5.1, 5.2, 5.3, 5.4
  const statistics = useMemo(() => {
    return {
      totalSessions: calculateTotalSessions(filteredSessions),
      totalMinutes: calculateTotalPracticeTime(filteredSessions),
      averageScore: calculateAverageScore(filteredSessions),
      currentStreak: calculateCurrentStreak(filteredSessions),
    };
  }, [filteredSessions]);

  // Get top performers - Requirements 7.1, 7.4, 7.5
  const topPerformers = useMemo(() => {
    return getTopPerformers(filteredSessions);
  }, [filteredSessions]);

  // Check if there are no sessions (empty state) - Requirement 1.3
  const isEmpty = sessions.length === 0;
  
  // Check if filtered results are empty - Requirement 4.5
  const isFilteredEmpty = filteredSessions.length === 0 && !isEmpty;

  return (
    <div className="min-h-full bg-void p-4 md:p-6 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        {/* Empty State - Requirement 1.3 */}
        {isEmpty ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md px-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-lime-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 md:w-10 md:h-10 text-lime-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                No Activity Yet
              </h2>
              <p className="text-sm md:text-base text-slate-400 mb-6">
                Start your first debate session to see your progress and analytics here!
              </p>
              <button
                onClick={onBack}
                className="px-6 py-3 bg-lime-400 text-void font-bold rounded-xl hover:bg-lime-500 hover:scale-105 transition-all duration-300 shadow-lg shadow-lime-400/20"
              >
                Start Practicing
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header with Time Filters */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">Activity Overview</h1>
              
              {/* Time Filter Buttons - Requirements 4.1, 4.3, 4.4, 8.1 */}
              <div className="flex flex-wrap gap-2 md:gap-3">
                <button
                  onClick={() => setTimeFilter('7d')}
                  className={`px-3 md:px-4 py-2 rounded-xl text-sm md:text-base font-medium transition-all duration-300 ${
                    timeFilter === '7d'
                      ? 'bg-lime-400 text-void scale-105 shadow-lg shadow-lime-400/20'
                      : 'bg-card text-slate-400 hover:text-white hover:scale-105 hover:shadow-md border border-white/10'
                  }`}
                >
                  <span className="hidden sm:inline">Last </span>7<span className="hidden sm:inline"> Days</span><span className="sm:hidden">d</span>
                </button>
                <button
                  onClick={() => setTimeFilter('30d')}
                  className={`px-3 md:px-4 py-2 rounded-xl text-sm md:text-base font-medium transition-all duration-300 ${
                    timeFilter === '30d'
                      ? 'bg-lime-400 text-void scale-105 shadow-lg shadow-lime-400/20'
                      : 'bg-card text-slate-400 hover:text-white hover:scale-105 hover:shadow-md border border-white/10'
                  }`}
                >
                  <span className="hidden sm:inline">Last </span>30<span className="hidden sm:inline"> Days</span><span className="sm:hidden">d</span>
                </button>
                <button
                  onClick={() => setTimeFilter('90d')}
                  className={`px-3 md:px-4 py-2 rounded-xl text-sm md:text-base font-medium transition-all duration-300 ${
                    timeFilter === '90d'
                      ? 'bg-lime-400 text-void scale-105 shadow-lg shadow-lime-400/20'
                      : 'bg-card text-slate-400 hover:text-white hover:scale-105 hover:shadow-md border border-white/10'
                  }`}
                >
                  <span className="hidden sm:inline">Last </span>90<span className="hidden sm:inline"> Days</span><span className="sm:hidden">d</span>
                </button>
                <button
                  onClick={() => setTimeFilter('all')}
                  className={`px-3 md:px-4 py-2 rounded-xl text-sm md:text-base font-medium transition-all duration-300 ${
                    timeFilter === 'all'
                      ? 'bg-lime-400 text-void scale-105 shadow-lg shadow-lime-400/20'
                      : 'bg-card text-slate-400 hover:text-white hover:scale-105 hover:shadow-md border border-white/10'
                  }`}
                >
                  All Time
                </button>
              </div>
            </div>

            {/* Empty filtered results - Requirement 4.5 */}
            {isFilteredEmpty ? (
              <div className="bg-card border border-white/5 rounded-[2rem] p-6 md:p-8">
                <div className="text-center max-w-md mx-auto">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-lime-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-7 h-7 md:w-8 md:h-8 text-lime-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                    No Sessions in This Period
                  </h3>
                  <p className="text-sm md:text-base text-slate-400">
                    Try selecting a different time range or start a new debate session.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Statistics Grid - Requirements 5.1, 5.2, 5.3, 5.4, 8.4 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                  {/* Total Sessions */}
                  <div className="animate-slideUp" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                    <StatCard
                      title="Total Sessions"
                      value={statistics.totalSessions}
                      icon={
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      }
                      color="lime"
                    />
                  </div>

                  {/* Total Practice Time */}
                  <div className="animate-slideUp" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                    <StatCard
                      title="Total Time"
                      value={`${statistics.totalMinutes}m`}
                      icon={
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      }
                      color="indigo"
                    />
                  </div>

                  {/* Average Score */}
                  <div className="animate-slideUp" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                    <StatCard
                      title="Average Score"
                      value={statistics.averageScore}
                      icon={
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      }
                      color="emerald"
                    />
                  </div>

                  {/* Current Streak */}
                  <div className="animate-slideUp" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                    <StatCard
                      title="Current Streak"
                      value={`${statistics.currentStreak}d`}
                      icon={
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                          />
                        </svg>
                      }
                      color="amber"
                    />
                  </div>
                </div>

                {/* Charts Section - Requirements 2.1, 2.3 */}
                <ChartsSection sessions={filteredSessions} />

                {/* Confidence Trend Chart */}
                <div className="mt-6 md:mt-8 animate-slideUp" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
                  <ConfidenceTrendChart sessions={filteredSessions} />
                </div>

                {/* Activity Heat Map - Requirements 3.1, 3.2, 3.3, 3.4, 3.5 */}
                <div className="mt-6 md:mt-8 animate-slideUp" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
                  <ActivityHeatMap sessions={filteredSessions} />
                </div>

                {/* Top Performers Section - Requirements 7.1, 7.2, 7.3, 7.4, 7.5 */}
                <div className="mt-6 md:mt-8 animate-slideUp" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
                  <TopPerformersSection sessions={topPerformers} />
                </div>

                {/* Session History List - Requirements 6.1, 6.2, 6.3, 6.4, 6.5 */}
                <div className="mt-6 md:mt-8 animate-slideUp" style={{ animationDelay: '0.9s', animationFillMode: 'both' }}>
                  <SessionHistoryList sessions={filteredSessions} />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Activity;
