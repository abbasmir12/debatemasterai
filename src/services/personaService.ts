/**
 * PersonaService - Analyzes debate session history to calculate user personas
 * and track evolution over time
 */

import type {
  SessionHistoryItem,
  PersonaArchetype,
  PersonaTrait,
  PersonaEvolution,
} from '../types';

/**
 * Result of persona calculation with confidence score
 */
export interface PersonaCalculationResult {
  archetype: PersonaArchetype;
  traits: PersonaTrait[];
  confidence: number; // 0-1, how confident we are in this classification
}

/**
 * Aggregated metrics used for archetype matching
 */
interface AggregatedMetrics {
  confidence: number;
  vocabulary: number;
  clarity: number;
  argumentStrength: number;
  persuasion: number;
}

/**
 * Predefined archetype definitions covering the spectrum of debate styles
 */
export const ARCHETYPE_DEFINITIONS: PersonaArchetype[] = [
  {
    id: 'analytical-strategist',
    name: 'Analytical Strategist',
    description:
      'You approach debates with logic, careful planning, and methodical reasoning. Your strength lies in building structured arguments backed by evidence and data. You excel at identifying logical fallacies and constructing airtight cases. Your debates are characterized by clarity of thought, systematic analysis, and strategic positioning. You prefer to win through intellectual rigor rather than emotional appeal.',
    icon: 'brain',
    traits: [],
    strengths: [
      'Logical reasoning and structured thinking',
      'Evidence-based argumentation',
      'Strategic planning and positioning',
      'Identifying logical fallacies',
      'Clear and methodical presentation',
    ],
    weaknesses: [
      'May lack emotional appeal',
      'Can be overly cautious or rigid',
      'Sometimes too focused on details',
    ],
    color: '#3b82f6', // blue
    unlockRequirements: [], // Always unlocked (starter archetype)
    isLocked: false,
  },
  {
    id: 'passionate-advocate',
    name: 'Passionate Advocate',
    description:
      'You debate with emotion, conviction, and inspiring rhetoric. Your arguments resonate on a human level, connecting with audiences through powerful storytelling and genuine passion. You excel at making people care about the issues at hand, using vivid language and compelling narratives. Your debates are characterized by energy, authenticity, and the ability to move hearts as well as minds. You believe that conviction and passion are just as important as logic.',
    icon: 'heart',
    traits: [],
    strengths: [
      'Emotional connection with audience',
      'Persuasive and inspiring delivery',
      'Compelling storytelling ability',
      'Authentic and genuine expression',
      'Ability to energize discussions',
    ],
    weaknesses: [
      'May overlook logical rigor',
      'Can be perceived as too aggressive',
      'Sometimes emotion overrides evidence',
    ],
    color: '#ef4444', // red
    unlockRequirements: [
      { type: 'sessions', value: 3, description: 'Complete 3 debate sessions' },
      { type: 'trait', value: 70, description: 'Achieve 70+ in Persuasion' },
    ],
    isLocked: true,
  },
  {
    id: 'diplomatic-mediator',
    name: 'Diplomatic Mediator',
    description:
      'You excel at finding common ground and building consensus through balanced, thoughtful discourse. Your approach emphasizes understanding multiple perspectives and crafting solutions that address various concerns. You are skilled at de-escalating tensions while maintaining productive dialogue. Your debates are characterized by fairness, empathy, and the ability to bridge divides. You believe the best outcomes come from collaboration rather than confrontation.',
    icon: 'scale',
    traits: [],
    strengths: [
      'Balanced perspective and fairness',
      'Consensus-building abilities',
      'Empathetic understanding',
      'De-escalation and conflict resolution',
      'Inclusive communication style',
    ],
    weaknesses: [
      'May avoid taking strong positions',
      'Can be seen as indecisive',
      'Sometimes too accommodating',
    ],
    color: '#8b5cf6', // purple
    unlockRequirements: [
      { type: 'sessions', value: 5, description: 'Complete 5 debate sessions' },
      { type: 'trait', value: 75, description: 'Achieve 75+ in Clarity' },
    ],
    isLocked: true,
  },
  {
    id: 'aggressive-challenger',
    name: 'Aggressive Challenger',
    description:
      'You debate with directness, intensity, and unwavering confidence. Your style is confrontational and assertive, challenging opponents head-on and exposing weaknesses in their arguments. You thrive in high-pressure situations and are not afraid to take controversial positions. Your debates are characterized by boldness, quick thinking, and the ability to dominate discussions. You believe that debate is a competitive arena where only the strongest arguments survive.',
    icon: 'sword',
    traits: [],
    strengths: [
      'Confident and assertive delivery',
      'Quick thinking under pressure',
      'Effective at exposing weaknesses',
      'Dominates discussions',
      'Unafraid of controversy',
    ],
    weaknesses: [
      'Can alienate audiences',
      'May come across as hostile',
      'Sometimes prioritizes winning over truth',
    ],
    color: '#f97316', // orange
    unlockRequirements: [
      { type: 'sessions', value: 7, description: 'Complete 7 debate sessions' },
      { type: 'trait', value: 80, description: 'Achieve 80+ in Confidence' },
      { type: 'score', value: 70, description: 'Achieve average score of 70+' },
    ],
    isLocked: true,
  },
  {
    id: 'creative-innovator',
    name: 'Creative Innovator',
    description:
      'You bring fresh perspectives and unconventional thinking to debates. Your approach is characterized by creativity, originality, and the ability to reframe issues in unexpected ways. You excel at finding novel solutions and challenging conventional wisdom. Your debates are characterized by innovation, thought-provoking insights, and the ability to see connections others miss. You believe that the best arguments come from thinking outside the box.',
    icon: 'lightbulb',
    traits: [],
    strengths: [
      'Original and innovative thinking',
      'Ability to reframe issues',
      'Thought-provoking insights',
      'Challenges conventional wisdom',
      'Creative problem-solving',
    ],
    weaknesses: [
      'May be too unconventional',
      'Can lack practical grounding',
      'Sometimes difficult to follow',
    ],
    color: '#eab308', // yellow
    unlockRequirements: [
      { type: 'sessions', value: 10, description: 'Complete 10 debate sessions' },
      { type: 'trait', value: 75, description: 'Achieve 75+ in Vocabulary' },
    ],
    isLocked: true,
  },
  {
    id: 'scholarly-expert',
    name: 'Scholarly Expert',
    description:
      'You debate from a foundation of deep knowledge and authoritative expertise. Your arguments are grounded in research, historical context, and comprehensive understanding of the subject matter. You excel at providing detailed analysis and citing credible sources. Your debates are characterized by intellectual depth, accuracy, and the weight of expertise. You believe that knowledge and scholarship are the ultimate foundations for persuasive arguments.',
    icon: 'book',
    traits: [],
    strengths: [
      'Deep subject matter expertise',
      'Research-backed arguments',
      'Historical and contextual awareness',
      'Credible and authoritative',
      'Comprehensive analysis',
    ],
    weaknesses: [
      'May be overly academic',
      'Can overwhelm with details',
      'Sometimes lacks accessibility',
    ],
    color: '#06b6d4', // cyan
    unlockRequirements: [
      { type: 'sessions', value: 15, description: 'Complete 15 debate sessions' },
      { type: 'trait', value: 85, description: 'Achieve 85+ in Vocabulary' },
      { type: 'trait', value: 80, description: 'Achieve 80+ in Argument Strength' },
    ],
    isLocked: true,
  },
  {
    id: 'charismatic-performer',
    name: 'Charismatic Performer',
    description:
      'You captivate audiences with engaging delivery, humor, and natural charisma. Your debates are entertaining as well as informative, using wit, timing, and stage presence to win over listeners. You excel at making complex topics accessible and memorable. Your debates are characterized by energy, entertainment value, and the ability to hold attention. You believe that effective communication is as much about delivery as content.',
    icon: 'star',
    traits: [],
    strengths: [
      'Engaging and entertaining delivery',
      'Natural charisma and presence',
      'Makes topics accessible',
      'Excellent timing and wit',
      'Memorable presentations',
    ],
    weaknesses: [
      'May prioritize style over substance',
      'Can be seen as superficial',
      'Sometimes relies too much on charm',
    ],
    color: '#ec4899', // pink
    unlockRequirements: [
      { type: 'sessions', value: 12, description: 'Complete 12 debate sessions' },
      { type: 'trait', value: 85, description: 'Achieve 85+ in Persuasion' },
      { type: 'trait', value: 80, description: 'Achieve 80+ in Confidence' },
    ],
    isLocked: true,
  },
  {
    id: 'tactical-debater',
    name: 'Tactical Debater',
    description:
      'You are highly adaptive, reading the room and adjusting your strategy in real-time. Your approach is flexible and responsive, using different techniques depending on the situation and opponent. You excel at identifying opportunities and exploiting them strategically. Your debates are characterized by versatility, situational awareness, and tactical precision. You believe that the best debaters are those who can adapt to any circumstance.',
    icon: 'target',
    traits: [],
    strengths: [
      'Highly adaptive and flexible',
      'Strong situational awareness',
      'Strategic opportunity identification',
      'Versatile technique repertoire',
      'Tactical precision',
    ],
    weaknesses: [
      'May lack consistent identity',
      'Can be seen as opportunistic',
      'Sometimes too calculated',
    ],
    color: '#10b981', // green
    unlockRequirements: [
      { type: 'sessions', value: 20, description: 'Complete 20 debate sessions' },
      { type: 'score', value: 75, description: 'Achieve average score of 75+' },
      { type: 'trait', value: 80, description: 'Achieve 80+ in all traits' },
    ],
    isLocked: true,
  },
];

/**
 * PersonaService - Main service class for persona calculation and management
 */
export class PersonaService {
  /**
   * Calculate user persona from session history
   * Analyzes patterns in debate performance metrics
   */
  static calculatePersona(
    sessions: SessionHistoryItem[]
  ): PersonaCalculationResult {
    // Validate input
    if (!Array.isArray(sessions)) {
      console.error('Invalid sessions input: expected array');
      return this.getDefaultPersona();
    }

    if (sessions.length === 0) {
      return this.getDefaultPersona();
    }

    try {
      // Aggregate metrics across sessions
      const metrics = this.aggregateMetrics(sessions);

      // Validate metrics
      if (!this.validateMetrics(metrics)) {
        console.error('Invalid metrics calculated:', metrics);
        return this.getDefaultPersona();
      }

      // Determine archetype based on dominant traits
      const archetype = this.matchArchetype(metrics);

      // Validate archetype
      if (!archetype || !archetype.id) {
        console.error('Invalid archetype matched');
        return this.getDefaultPersona();
      }

      // Build trait list from aggregated metrics
      const traits = this.buildTraits(metrics);

      // Validate traits
      if (!Array.isArray(traits) || traits.length === 0) {
        console.error('Invalid traits built');
        return this.getDefaultPersona();
      }

      // Calculate confidence based on number of sessions
      const confidence = this.calculateConfidence(sessions.length);

      return {
        archetype,
        traits,
        confidence,
      };
    } catch (error) {
      console.error('Error in calculatePersona:', error);
      return this.getDefaultPersona();
    }
  }

  /**
   * Validate aggregated metrics
   */
  private static validateMetrics(metrics: AggregatedMetrics): boolean {
    if (!metrics || typeof metrics !== 'object') {
      return false;
    }

    const requiredFields: (keyof AggregatedMetrics)[] = [
      'confidence',
      'vocabulary',
      'clarity',
      'argumentStrength',
      'persuasion',
    ];

    for (const field of requiredFields) {
      const value = metrics[field];
      if (typeof value !== 'number' || isNaN(value) || value < 0 || value > 100) {
        return false;
      }
    }

    return true;
  }

  /**
   * Aggregate metrics across all sessions
   */
  private static aggregateMetrics(
    sessions: SessionHistoryItem[]
  ): AggregatedMetrics {
    const avgConfidence = this.calculateAverage(sessions, 'score');
    const avgVocabulary = this.calculateAverage(sessions, 'vocabularyScore');
    const avgClarity = this.calculateAverage(sessions, 'clarityScore');
    const avgArgumentStrength = this.calculateAverage(
      sessions,
      'argumentStrength'
    );
    const avgPersuasion = this.calculateAverage(sessions, 'persuasionScore');

    return {
      confidence: avgConfidence,
      vocabulary: avgVocabulary,
      clarity: avgClarity,
      argumentStrength: avgArgumentStrength,
      persuasion: avgPersuasion,
    };
  }

  /**
   * Calculate average value for a specific metric across sessions
   */
  private static calculateAverage(
    sessions: SessionHistoryItem[],
    metric: keyof SessionHistoryItem
  ): number {
    const values = sessions
      .map((s) => s[metric])
      .filter((v): v is number => typeof v === 'number');

    if (values.length === 0) return 50; // Default to middle value

    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  }

  /**
   * Match archetype based on aggregated metrics
   * Uses a scoring system to find the best-fitting archetype
   */
  private static matchArchetype(metrics: AggregatedMetrics): PersonaArchetype {
    const scores = ARCHETYPE_DEFINITIONS.map((archetype) => ({
      archetype,
      score: this.calculateArchetypeScore(archetype, metrics),
    }));

    // Sort by score descending and return the best match
    scores.sort((a, b) => b.score - a.score);
    return scores[0]?.archetype ?? ARCHETYPE_DEFINITIONS[0]!;
  }

  /**
   * Calculate how well metrics match a specific archetype
   */
  private static calculateArchetypeScore(
    archetype: PersonaArchetype,
    metrics: AggregatedMetrics
  ): number {
    // Scoring logic based on archetype characteristics
    switch (archetype.id) {
      case 'analytical-strategist':
        return (
          metrics.clarity * 0.3 +
          metrics.argumentStrength * 0.3 +
          metrics.vocabulary * 0.2 +
          metrics.confidence * 0.2
        );

      case 'passionate-advocate':
        return (
          metrics.persuasion * 0.4 +
          metrics.confidence * 0.3 +
          metrics.argumentStrength * 0.2 +
          metrics.clarity * 0.1
        );

      case 'diplomatic-mediator':
        return (
          metrics.clarity * 0.3 +
          metrics.persuasion * 0.25 +
          metrics.vocabulary * 0.25 +
          (100 - Math.abs(metrics.confidence - 70)) * 0.2
        );

      case 'aggressive-challenger':
        return (
          metrics.confidence * 0.4 +
          metrics.argumentStrength * 0.3 +
          metrics.persuasion * 0.2 +
          metrics.clarity * 0.1
        );

      case 'creative-innovator':
        return (
          metrics.vocabulary * 0.3 +
          metrics.persuasion * 0.3 +
          metrics.argumentStrength * 0.2 +
          metrics.clarity * 0.2
        );

      case 'scholarly-expert':
        return (
          metrics.vocabulary * 0.35 +
          metrics.argumentStrength * 0.3 +
          metrics.clarity * 0.25 +
          metrics.confidence * 0.1
        );

      case 'charismatic-performer':
        return (
          metrics.persuasion * 0.35 +
          metrics.confidence * 0.3 +
          metrics.clarity * 0.2 +
          metrics.vocabulary * 0.15
        );

      case 'tactical-debater':
        return (
          metrics.argumentStrength * 0.3 +
          metrics.clarity * 0.25 +
          metrics.persuasion * 0.25 +
          metrics.confidence * 0.2
        );

      default:
        return 0;
    }
  }

  /**
   * Build trait list from aggregated metrics
   */
  private static buildTraits(metrics: AggregatedMetrics): PersonaTrait[] {
    return [
      {
        name: 'Confidence',
        value: Math.round(metrics.confidence),
        description:
          'Your level of self-assurance and conviction in presenting arguments',
      },
      {
        name: 'Vocabulary',
        value: Math.round(metrics.vocabulary),
        description:
          'The richness and sophistication of your word choice and language use',
      },
      {
        name: 'Clarity',
        value: Math.round(metrics.clarity),
        description:
          'How clearly and effectively you communicate your ideas and arguments',
      },
      {
        name: 'Argument Strength',
        value: Math.round(metrics.argumentStrength),
        description:
          'The logical soundness and persuasiveness of your reasoning',
      },
      {
        name: 'Persuasion',
        value: Math.round(metrics.persuasion),
        description:
          'Your ability to convince and influence others through your arguments',
      },
    ];
  }

  /**
   * Calculate confidence score based on number of sessions
   * More sessions = higher confidence in the classification
   */
  private static calculateConfidence(sessionCount: number): number {
    if (sessionCount === 0) return 0;
    if (sessionCount >= 10) return 1.0;
    return sessionCount / 10;
  }

  /**
   * Get default persona for users with no session history
   */
  private static getDefaultPersona(): PersonaCalculationResult {
    const defaultArchetype = ARCHETYPE_DEFINITIONS.find(
      (a) => a.id === 'analytical-strategist'
    )!;

    return {
      archetype: defaultArchetype,
      traits: [
        {
          name: 'Confidence',
          value: 50,
          description:
            'Your level of self-assurance and conviction in presenting arguments',
        },
        {
          name: 'Vocabulary',
          value: 50,
          description:
            'The richness and sophistication of your word choice and language use',
        },
        {
          name: 'Clarity',
          value: 50,
          description:
            'How clearly and effectively you communicate your ideas and arguments',
        },
        {
          name: 'Argument Strength',
          value: 50,
          description:
            'The logical soundness and persuasiveness of your reasoning',
        },
        {
          name: 'Persuasion',
          value: 50,
          description:
            'Your ability to convince and influence others through your arguments',
        },
      ],
      confidence: 0,
    };
  }

  /**
   * Track persona evolution over time
   * Groups sessions by time periods and calculates persona for each
   */
  static calculateEvolution(
    sessions: SessionHistoryItem[]
  ): PersonaEvolution[] {
    // Validate input
    if (!Array.isArray(sessions)) {
      console.error('Invalid sessions input for evolution: expected array');
      return [];
    }

    if (sessions.length === 0) return [];

    try {
      // Sort sessions by date
      const sortedSessions = [...sessions].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      // Group sessions by month
      const groupedByMonth = this.groupSessionsByMonth(sortedSessions);

      // Calculate persona for each month
      const evolution: PersonaEvolution[] = [];

      for (const [monthKey, monthSessions] of Object.entries(groupedByMonth)) {
        if (!Array.isArray(monthSessions) || monthSessions.length === 0) {
          continue;
        }

        const result = this.calculatePersona(monthSessions);

        // Validate result before adding to evolution
        if (result && result.archetype && result.archetype.id) {
          evolution.push({
            date: monthKey,
            archetypeId: result.archetype.id,
            traits: result.traits,
            milestone: this.determineMilestone(monthSessions, result),
          });
        }
      }

      return evolution;
    } catch (error) {
      console.error('Error in calculateEvolution:', error);
      return [];
    }
  }

  /**
   * Group sessions by month (YYYY-MM format)
   */
  private static groupSessionsByMonth(
    sessions: SessionHistoryItem[]
  ): Record<string, SessionHistoryItem[]> {
    const grouped: Record<string, SessionHistoryItem[]> = {};

    for (const session of sessions) {
      const date = new Date(session.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey]!.push(session);
    }

    return grouped;
  }

  /**
   * Determine if a milestone was achieved in this period
   */
  private static determineMilestone(
    sessions: SessionHistoryItem[],
    result: PersonaCalculationResult
  ): string | undefined {
    // First session milestone
    if (sessions.length === 1) {
      return 'First Debate Session';
    }

    // High performance milestone
    const avgScore = this.calculateAverage(sessions, 'score');
    if (avgScore >= 90) {
      return 'Exceptional Performance';
    }

    // High trait milestone
    const maxTrait = Math.max(...result.traits.map((t) => t.value));
    if (maxTrait >= 95) {
      const topTrait = result.traits.find((t) => t.value === maxTrait);
      return `Mastered ${topTrait?.name}`;
    }

    return undefined;
  }

  /**
   * Check if an archetype is unlocked based on user's session history
   */
  static isArchetypeUnlocked(
    archetype: PersonaArchetype,
    sessions: SessionHistoryItem[],
    currentTraits: PersonaTrait[]
  ): boolean {
    // If no unlock requirements, it's always unlocked
    if (!archetype.unlockRequirements || archetype.unlockRequirements.length === 0) {
      return true;
    }

    // Check each requirement
    for (const requirement of archetype.unlockRequirements) {
      switch (requirement.type) {
        case 'sessions':
          if (sessions.length < requirement.value) {
            return false;
          }
          break;

        case 'score':
          const avgScore = sessions.length > 0
            ? sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length
            : 0;
          if (avgScore < requirement.value) {
            return false;
          }
          break;

        case 'trait':
          // Check if any trait meets the requirement
          const hasTrait = currentTraits.some(trait => trait.value >= requirement.value);
          if (!hasTrait) {
            return false;
          }
          break;

        case 'time':
          const totalMinutes = sessions.reduce((sum, s) => sum + s.durationSeconds / 60, 0);
          if (totalMinutes < requirement.value) {
            return false;
          }
          break;

        case 'streak':
          // Check for consecutive sessions (simplified - could be enhanced)
          if (sessions.length < requirement.value) {
            return false;
          }
          break;
      }
    }

    return true;
  }

  /**
   * Get all archetypes with their unlock status
   */
  static getAllArchetypesWithLockStatus(
    sessions: SessionHistoryItem[],
    currentTraits: PersonaTrait[]
  ): PersonaArchetype[] {
    return ARCHETYPE_DEFINITIONS.map(archetype => ({
      ...archetype,
      isLocked: !this.isArchetypeUnlocked(archetype, sessions, currentTraits),
    }));
  }

  /**
   * Get all available archetypes (legacy method - returns all without lock status)
   */
  static getAllArchetypes(): PersonaArchetype[] {
    // Return a copy to prevent external modification
    return [...ARCHETYPE_DEFINITIONS];
  }

  /**
   * Generate dynamic description based on user's actual performance
   */
  static generateDynamicDescription(
    archetype: PersonaArchetype,
    traits: PersonaTrait[],
    sessions: SessionHistoryItem[]
  ): string {
    // Get user's strongest traits
    const sortedTraits = [...traits].sort((a, b) => b.value - a.value);
    const topTrait = sortedTraits[0];
    const secondTrait = sortedTraits[1];

    // Calculate stats
    const avgScore = sessions.length > 0
      ? Math.round(sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length)
      : 0;
    const totalSessions = sessions.length;

    // Build dynamic description
    let description = archetype.description;

    // Add personalized performance summary
    if (topTrait && secondTrait) {
      description += `\n\nYour strongest attributes are ${topTrait.name} (${Math.round(topTrait.value)}/100) and ${secondTrait.name} (${Math.round(secondTrait.value)}/100). `;
    }

    if (totalSessions > 0) {
      description += `Over ${totalSessions} debate${totalSessions > 1 ? 's' : ''}, you've maintained an average score of ${avgScore}/100. `;
    }

    // Add growth insight
    if (avgScore >= 80) {
      description += `You're performing at an exceptional level, consistently demonstrating mastery of this debate style.`;
    } else if (avgScore >= 60) {
      description += `You're developing strong skills in this style and showing steady improvement.`;
    } else {
      description += `You're building your foundation in this debate style with room for growth.`;
    }

    return description;
  }
}
