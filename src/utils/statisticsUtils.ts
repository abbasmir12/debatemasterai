/**
 * Statistics calculation utilities for Activity View
 * Requirements: 5.1, 5.2, 5.3, 5.4
 */

import { SessionHistoryItem } from '../types';

/**
 * Calculate total number of sessions
 * Requirement 5.1
 * @param sessions - Array of session history items
 * @returns Total count of sessions
 */
export function calculateTotalSessions(sessions: SessionHistoryItem[]): number {
  return sessions.length;
}

/**
 * Calculate total practice time from session durations
 * Requirement 5.2
 * @param sessions - Array of session history items
 * @returns Total practice time in minutes
 */
export function calculateTotalPracticeTime(sessions: SessionHistoryItem[]): number {
  const totalSeconds = sessions.reduce((sum, session) => sum + session.durationSeconds, 0);
  return Math.floor(totalSeconds / 60);
}

/**
 * Calculate average score across all sessions
 * Requirement 5.3
 * @param sessions - Array of session history items
 * @returns Average score (0-100), or 0 if no sessions
 */
export function calculateAverageScore(sessions: SessionHistoryItem[]): number {
  if (sessions.length === 0) {
    return 0;
  }
  
  const totalScore = sessions.reduce((sum, session) => sum + session.score, 0);
  return Math.round(totalScore / sessions.length);
}

/**
 * Calculate current streak of consecutive practice days
 * Requirement 5.4
 * 
 * The streak counts consecutive calendar days with at least one session,
 * starting from the most recent session and working backwards.
 * The streak ends when a day with no sessions is encountered.
 * 
 * @param sessions - Array of session history items
 * @returns Current streak count in days
 */
export function calculateCurrentStreak(sessions: SessionHistoryItem[]): number {
  if (sessions.length === 0) {
    return 0;
  }

  // Sort sessions by date descending (most recent first)
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Get unique dates (calendar days) with sessions
  const sessionDates = new Set<string>();
  sortedSessions.forEach(session => {
    const date = new Date(session.date);
    // Normalize to calendar day (YYYY-MM-DD)
    const dateKey = date.toISOString().split('T')[0];
    if (dateKey) {
      sessionDates.add(dateKey);
    }
  });

  // Convert to sorted array (most recent first)
  const uniqueDates = Array.from(sessionDates).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  if (uniqueDates.length === 0) {
    return 0;
  }

  // Start with the most recent date
  const firstDate = uniqueDates[0];
  if (!firstDate) {
    return 0;
  }
  
  let streak = 1;
  let currentDate = new Date(firstDate);

  // Check each subsequent day
  for (let i = 1; i < uniqueDates.length; i++) {
    const nextDateStr = uniqueDates[i];
    if (!nextDateStr) {
      break;
    }
    const nextDate = new Date(nextDateStr);
    
    // Calculate expected previous day
    const expectedPrevDay = new Date(currentDate);
    expectedPrevDay.setDate(expectedPrevDay.getDate() - 1);
    
    // Normalize both dates to compare only the date part
    const expectedDateKey = expectedPrevDay.toISOString().split('T')[0];
    const nextDateKey = nextDate.toISOString().split('T')[0];
    
    if (expectedDateKey === nextDateKey) {
      // Consecutive day found
      streak++;
      currentDate = nextDate;
    } else {
      // Gap found, streak ends
      break;
    }
  }

  return streak;
}

/**
 * Identify top 3 highest-scoring sessions
 * Requirements: 7.1, 7.4, 7.5
 * 
 * Returns the top 3 sessions with the highest scores.
 * Ties are broken by prioritizing more recent sessions (later dates first).
 * If fewer than 3 sessions exist, returns all available sessions.
 * 
 * @param sessions - Array of session history items
 * @returns Array of top 3 (or fewer) sessions sorted by score descending, then date descending
 */
export function getTopPerformers(sessions: SessionHistoryItem[]): SessionHistoryItem[] {
  if (sessions.length === 0) {
    return [];
  }

  // Sort by score descending, then by date descending for tie-breaking
  const sorted = [...sessions].sort((a, b) => {
    // First compare by score (higher is better)
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // If scores are equal, prioritize more recent sessions
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Return top 3 or fewer
  return sorted.slice(0, 3);
}
