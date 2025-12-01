/**
 * Persona Validation Utilities
 * Validates session history data and archetype objects before processing
 */

import type { SessionHistoryItem, PersonaArchetype, PersonaTrait } from '@/types';

/**
 * Validates a single session history item
 */
export function validateSessionHistoryItem(session: unknown): session is SessionHistoryItem {
  if (!session || typeof session !== 'object') {
    return false;
  }

  const s = session as Partial<SessionHistoryItem>;

  // Required fields
  if (!s.id || typeof s.id !== 'string') {
    return false;
  }

  if (!s.date || typeof s.date !== 'string') {
    return false;
  }

  if (!s.topic || typeof s.topic !== 'string') {
    return false;
  }

  if (typeof s.score !== 'number' || s.score < 0 || s.score > 100) {
    return false;
  }

  if (typeof s.durationSeconds !== 'number' || s.durationSeconds < 0) {
    return false;
  }

  // Optional numeric fields should be numbers if present
  const numericFields = [
    'confidenceLevel',
    'vocabularyScore',
    'clarityScore',
    'argumentStrength',
    'persuasionScore',
  ] as const;

  for (const field of numericFields) {
    if (s[field] !== undefined && (typeof s[field] !== 'number' || s[field]! < 0 || s[field]! > 100)) {
      return false;
    }
  }

  return true;
}

/**
 * Validates an array of session history items
 * Returns validated sessions and error messages for invalid ones
 */
export function validateSessionHistory(sessions: unknown): {
  valid: SessionHistoryItem[];
  errors: string[];
} {
  const errors: string[] = [];
  const valid: SessionHistoryItem[] = [];

  if (!Array.isArray(sessions)) {
    errors.push('Session history must be an array');
    return { valid, errors };
  }

  sessions.forEach((session, index) => {
    if (validateSessionHistoryItem(session)) {
      valid.push(session);
    } else {
      errors.push(`Invalid session at index ${index}: ${JSON.stringify(session)}`);
    }
  });

  return { valid, errors };
}

/**
 * Validates a persona trait object
 */
export function validatePersonaTrait(trait: unknown): trait is PersonaTrait {
  if (!trait || typeof trait !== 'object') {
    return false;
  }

  const t = trait as Partial<PersonaTrait>;

  if (!t.name || typeof t.name !== 'string' || t.name.trim() === '') {
    return false;
  }

  if (typeof t.value !== 'number' || t.value < 0 || t.value > 100) {
    return false;
  }

  if (!t.description || typeof t.description !== 'string') {
    return false;
  }

  return true;
}

/**
 * Validates a persona archetype object
 */
export function validatePersonaArchetype(archetype: unknown): archetype is PersonaArchetype {
  if (!archetype || typeof archetype !== 'object') {
    return false;
  }

  const a = archetype as Partial<PersonaArchetype>;

  // Required string fields
  if (!a.id || typeof a.id !== 'string' || a.id.trim() === '') {
    return false;
  }

  if (!a.name || typeof a.name !== 'string' || a.name.trim() === '') {
    return false;
  }

  if (!a.description || typeof a.description !== 'string' || a.description.trim() === '') {
    return false;
  }

  if (!a.icon || typeof a.icon !== 'string') {
    return false;
  }

  if (!a.color || typeof a.color !== 'string') {
    return false;
  }

  // Validate traits array (can be empty for archetype definitions)
  if (!Array.isArray(a.traits)) {
    return false;
  }

  // If traits exist, validate them
  if (a.traits.length > 0 && !a.traits.every(validatePersonaTrait)) {
    return false;
  }

  // Validate strengths array
  if (!Array.isArray(a.strengths) || a.strengths.length === 0) {
    return false;
  }

  if (!a.strengths.every((s) => typeof s === 'string' && s.trim() !== '')) {
    return false;
  }

  // Validate weaknesses array
  if (!Array.isArray(a.weaknesses) || a.weaknesses.length === 0) {
    return false;
  }

  if (!a.weaknesses.every((w) => typeof w === 'string' && w.trim() !== '')) {
    return false;
  }

  return true;
}

/**
 * Validates an array of archetypes
 */
export function validateArchetypes(archetypes: unknown): {
  valid: PersonaArchetype[];
  errors: string[];
} {
  const errors: string[] = [];
  const valid: PersonaArchetype[] = [];

  if (!Array.isArray(archetypes)) {
    errors.push('Archetypes must be an array');
    return { valid, errors };
  }

  if (archetypes.length === 0) {
    errors.push('Archetypes array cannot be empty');
    return { valid, errors };
  }

  archetypes.forEach((archetype, index) => {
    if (validatePersonaArchetype(archetype)) {
      valid.push(archetype);
    } else {
      errors.push(`Invalid archetype at index ${index}: ${JSON.stringify(archetype)?.substring(0, 100)}...`);
    }
  });

  return { valid, errors };
}

/**
 * Sanitizes session history by removing invalid entries
 * Returns only valid sessions with a warning if any were removed
 */
export function sanitizeSessionHistory(sessions: unknown): {
  sessions: SessionHistoryItem[];
  warning: string | null;
} {
  const { valid, errors } = validateSessionHistory(sessions);

  if (errors.length > 0) {
    console.warn('Session history validation warnings:', errors);
    return {
      sessions: valid,
      warning: `${errors.length} invalid session(s) were removed from history`,
    };
  }

  return {
    sessions: valid,
    warning: null,
  };
}
