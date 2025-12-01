/**
 * Core type definitions for DebateMaster AI
 */

/**
 * Represents a single message in the chat conversation
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: number;
  isFinal?: boolean;
}

/**
 * User statistics tracked across sessions
 */
export interface UserStats {
  totalSessions: number;
  totalMinutes: number;
  points: number;
  badges: string[];
}

/**
 * A single session entry in the history
 */
export interface SessionHistoryItem {
  id: string;
  date: string; // ISO string
  topic: string;
  durationSeconds: number;
  score: number; // 0-100
  confidenceLevel?: 'Low' | 'Medium' | 'High' | 'Unstoppable';
  englishProficiency?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native';
  vocabularyScore?: number;
  clarityScore?: number;
  argumentStrength?: number;
  persuasionScore?: number;
}

/**
 * Comprehensive debate performance analysis
 */
export interface DebateAnalysis {
  score: number; // 0-100
  confidenceLevel: 'Low' | 'Medium' | 'High' | 'Unstoppable';
  englishProficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native';
  vocabularyScore: number; // 0-100
  clarityScore: number; // 0-100
  argumentStrength: number; // 0-100
  persuasionScore: number; // 0-100
  strategicAdaptability: number; // 0-100
  archetype: string;
  wildcardInsight: string;
  emotionalState: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

/**
 * Application view states
 */
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  DEBATE_LIVE = 'DEBATE_LIVE',
  SUMMARY = 'SUMMARY',
  SETTINGS = 'SETTINGS',
  ACTIVITY = 'ACTIVITY',
  PERSONA = 'PERSONA',
}

/**
 * Debate style modes
 */
export enum DebateStyle {
  COACH = 'COACH',
  AGGRESSIVE = 'AGGRESSIVE',
}

/**
 * Audio configuration settings
 */
export interface AudioConfig {
  inputSampleRate: number;
  outputSampleRate: number;
}

/**
 * Represents a single trait of a persona
 */
export interface PersonaTrait {
  name: string;
  value: number; // 0-100
  description: string;
}

/**
 * Unlock requirements for an archetype
 */
export interface ArchetypeUnlockRequirement {
  type: 'sessions' | 'score' | 'trait' | 'streak' | 'time';
  value: number;
  description: string;
}

/**
 * Represents a persona archetype with characteristics
 */
export interface PersonaArchetype {
  id: string;
  name: string;
  description: string;
  icon: string;
  traits: PersonaTrait[];
  strengths: string[];
  weaknesses: string[];
  color: string; // accent color for this archetype
  unlockRequirements?: ArchetypeUnlockRequirement[]; // Requirements to unlock this archetype
  isLocked?: boolean; // Whether this archetype is currently locked
}

/**
 * Represents a snapshot of persona evolution at a point in time
 */
export interface PersonaEvolution {
  date: string; // ISO string
  archetypeId: string;
  traits: PersonaTrait[];
  milestone?: string;
}

/**
 * Complete user persona data
 */
export interface UserPersona {
  currentArchetype: PersonaArchetype;
  traits: PersonaTrait[];
  evolution: PersonaEvolution[];
  calculatedAt: number; // timestamp
}
