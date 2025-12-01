/**
 * Storage service for managing persistent data in browser localStorage
 */

import { UserStats, SessionHistoryItem, DebateAnalysis, UserPersona } from '../types';

// Storage keys as constants
const STORAGE_KEYS = {
  STATS: 'debate_master_stats',
  HISTORY: 'debate_master_history',
  PERSONA: 'debate_master_persona',
} as const;

/**
 * Default user statistics when none exist
 */
const DEFAULT_STATS: UserStats = {
  totalSessions: 0,
  totalMinutes: 0,
  points: 0,
  badges: [],
};

/**
 * Retrieves user statistics from localStorage
 * @returns UserStats object, or default stats if none exist
 */
export function getStats(): UserStats {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STATS);
    if (!stored) {
      return { ...DEFAULT_STATS };
    }
    return JSON.parse(stored) as UserStats;
  } catch (error) {
    console.error('Error reading stats from localStorage:', error);
    return { ...DEFAULT_STATS };
  }
}

/**
 * Retrieves session history from localStorage
 * @returns Array of SessionHistoryItem, or empty array if none exist
 */
export function getHistory(): SessionHistoryItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!stored) {
      return [];
    }
    return JSON.parse(stored) as SessionHistoryItem[];
  } catch (error) {
    console.error('Error reading history from localStorage:', error);
    return [];
  }
}

/**
 * Saves a completed session, updating statistics and history
 * @param topic - The debate topic
 * @param durationSeconds - Session duration in seconds
 * @param analysis - Optional debate analysis data
 * @returns Object containing updated stats and the new history item
 */
export function saveSession(
  topic: string,
  durationSeconds: number,
  analysis?: DebateAnalysis
): { stats: UserStats; newItem: SessionHistoryItem } {
  // Get current stats and history
  const currentStats = getStats();
  const currentHistory = getHistory();

  // Calculate new statistics
  const durationMinutes = Math.floor(durationSeconds / 60);
  const sessionPoints = 10 + durationMinutes * 2;

  const updatedStats: UserStats = {
    totalSessions: currentStats.totalSessions + 1,
    totalMinutes: currentStats.totalMinutes + durationMinutes,
    points: currentStats.points + sessionPoints,
    badges: [...currentStats.badges],
  };

  // Award badges based on milestones
  if (updatedStats.totalSessions === 1 && !updatedStats.badges.includes('Debate Novice')) {
    updatedStats.badges.push('Debate Novice');
  }
  if (updatedStats.totalSessions >= 5 && !updatedStats.badges.includes('Consistency King')) {
    updatedStats.badges.push('Consistency King');
  }
  if (updatedStats.points >= 100 && !updatedStats.badges.includes('Century Club')) {
    updatedStats.badges.push('Century Club');
  }

  // Create new history item with analysis data if available
  const newItem: SessionHistoryItem = {
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    date: new Date().toISOString(),
    topic,
    durationSeconds,
    score: analysis?.score ?? Math.floor(Math.random() * 41) + 60,
    confidenceLevel: analysis?.confidenceLevel,
    englishProficiency: analysis?.englishProficiency,
    vocabularyScore: analysis?.vocabularyScore,
    clarityScore: analysis?.clarityScore,
    argumentStrength: analysis?.argumentStrength,
    persuasionScore: analysis?.persuasionScore,
  };

  // Add to history (prepend to show most recent first)
  const updatedHistory = [newItem, ...currentHistory];

  // Persist to localStorage
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updatedStats));
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }

  return { stats: updatedStats, newItem };
}

/**
 * Saves user persona data to localStorage
 * @param persona - The UserPersona object to persist
 */
export function savePersona(persona: UserPersona): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PERSONA, JSON.stringify(persona));
  } catch (error) {
    console.error('Error saving persona to localStorage:', error);
  }
}

/**
 * Retrieves user persona data from localStorage
 * @returns UserPersona object, or null if none exists
 */
export function loadPersona(): UserPersona | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PERSONA);
    if (!stored) {
      return null;
    }
    return JSON.parse(stored) as UserPersona;
  } catch (error) {
    console.error('Error reading persona from localStorage:', error);
    return null;
  }
}
