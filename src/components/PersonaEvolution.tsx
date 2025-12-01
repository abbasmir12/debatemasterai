/**
 * PersonaEvolution - Timeline visualization of persona changes over time
 * Displays evolution history with dates, archetypes, trait changes, and milestones
 */

import { motion, useInView } from 'framer-motion';
import { useRef, memo } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  Calendar,
  Brain,
  Heart,
  Scale,
  Sword,
  Lightbulb,
  Book,
  Star,
  Target,
} from 'lucide-react';
import type { PersonaEvolution as PersonaEvolutionType } from '../types';
import { Card } from './ui/card';

interface PersonaEvolutionProps {
  evolution: PersonaEvolutionType[];
}

/**
 * Map archetype IDs to their corresponding icons
 */
const ARCHETYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'analytical-strategist': Brain,
  'passionate-advocate': Heart,
  'diplomatic-mediator': Scale,
  'aggressive-challenger': Sword,
  'creative-innovator': Lightbulb,
  'scholarly-expert': Book,
  'charismatic-performer': Star,
  'tactical-debater': Target,
};

/**
 * Map archetype IDs to their display names
 */
const ARCHETYPE_NAMES: Record<string, string> = {
  'analytical-strategist': 'Analytical Strategist',
  'passionate-advocate': 'Passionate Advocate',
  'diplomatic-mediator': 'Diplomatic Mediator',
  'aggressive-challenger': 'Aggressive Challenger',
  'creative-innovator': 'Creative Innovator',
  'scholarly-expert': 'Scholarly Expert',
  'charismatic-performer': 'Charismatic Performer',
  'tactical-debater': 'Tactical Debater',
};

/**
 * Compare trait values between two evolution entries
 * Returns 'up', 'down', or 'same' for each trait
 */
export function compareTraits(
  current: PersonaEvolutionType,
  previous: PersonaEvolutionType | undefined
): Map<string, 'up' | 'down' | 'same'> {
  const comparison = new Map<string, 'up' | 'down' | 'same'>();

  if (!previous) {
    // First entry - all traits are neutral
    current.traits.forEach((trait) => {
      comparison.set(trait.name, 'same');
    });
    return comparison;
  }

  // Compare each trait with previous entry
  current.traits.forEach((currentTrait) => {
    const previousTrait = previous.traits.find((t) => t.name === currentTrait.name);

    if (!previousTrait) {
      comparison.set(currentTrait.name, 'same');
      return;
    }

    const diff = currentTrait.value - previousTrait.value;
    if (diff > 2) {
      comparison.set(currentTrait.name, 'up');
    } else if (diff < -2) {
      comparison.set(currentTrait.name, 'down');
    } else {
      comparison.set(currentTrait.name, 'same');
    }
  });

  return comparison;
}

/**
 * Get the appropriate indicator icon for trait change
 */
function getTraitIndicator(direction: 'up' | 'down' | 'same') {
  switch (direction) {
    case 'up':
      return <TrendingUp className="w-4 h-4 text-lime-400" />;
    case 'down':
      return <TrendingDown className="w-4 h-4 text-red-400" />;
    case 'same':
      return <Minus className="w-4 h-4 text-slate-500" />;
  }
}

/**
 * Format date string to readable format
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
}

/**
 * PersonaEvolution Component
 * Displays a vertical timeline of persona changes with animations
 * Memoized for performance
 */
const PersonaEvolutionComponent = ({ evolution }: PersonaEvolutionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  if (evolution.length === 0) {
    return null;
  }

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={prefersReducedMotion ? {} : (inView ? { opacity: 1 } : { opacity: 0 })}
      transition={prefersReducedMotion ? {} : { duration: 0.5 }}
      className="w-full"
      role="region"
      aria-label="Persona Evolution Timeline"
    >
      <h2 id="persona-evolution-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6 md:mb-8">Your Evolution</h2>

      <div className="relative">
        {/* Timeline line - adjusted position for mobile */}
        <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 bg-white/10" aria-hidden="true" />

        {/* Timeline entries - adjusted spacing for mobile */}
        <nav className="space-y-6 md:space-y-8" aria-label="Evolution timeline">
          {evolution.map((entry, index) => {
            const Icon = ARCHETYPE_ICONS[entry.archetypeId] || Brain;
            const archetypeName = ARCHETYPE_NAMES[entry.archetypeId] || entry.archetypeId;
            const previousEntry = index > 0 ? evolution[index - 1] : undefined;
            const traitComparison = compareTraits(entry, previousEntry);

            return (
              <motion.div
                key={`${entry.date}-${entry.archetypeId}`}
                initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                animate={prefersReducedMotion ? {} : (inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 })}
                transition={prefersReducedMotion ? {} : { duration: 0.3, delay: index * 0.1 }}
                className="relative pl-12 sm:pl-20"
              >
                {/* Timeline dot with icon - adjusted size for mobile */}
                <div className="absolute left-0 sm:left-4 top-4 w-8 h-8 rounded-full bg-lime-400 flex items-center justify-center z-10" aria-hidden="true">
                  <Icon className="w-4 h-4 text-void" />
                </div>

                {/* Content card - adjusted padding for mobile */}
                <Card className="p-4 sm:p-6 bg-card backdrop-blur-sm hover:border-lime-400/30 transition-colors" role="article" aria-label={`Evolution entry: ${archetypeName} on ${formatDate(entry.date)}`}>
                  {/* Date and archetype - responsive layout */}
                  <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-2 sm:gap-0">
                    <div>
                      <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm mb-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                        <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-lime-400">{archetypeName}</h3>
                    </div>

                    {/* Milestone badge - responsive sizing */}
                    {entry.milestone && (
                      <motion.div
                        initial={prefersReducedMotion ? { scale: 1 } : { scale: 0 }}
                        animate={prefersReducedMotion ? { scale: 1 } : (inView ? { scale: 1 } : { scale: 0 })}
                        transition={prefersReducedMotion ? {} : { duration: 0.3, delay: index * 0.1 + 0.2 }}
                        className="flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/30"
                        role="status"
                        aria-label={`Milestone: ${entry.milestone}`}
                      >
                        <Award className="w-3 h-3 sm:w-4 sm:h-4 text-lime-400" aria-hidden="true" />
                        <span className="text-xs sm:text-sm text-lime-400 font-medium">
                          {entry.milestone}
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* Trait changes - responsive grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3" role="list" aria-label="Trait values">
                    {entry.traits.map((trait) => {
                      const direction = traitComparison.get(trait.name) || 'same';
                      const showPositiveIndicator = direction === 'up';

                      return (
                        <div
                          key={trait.name}
                          className="flex items-center justify-between p-2 sm:p-3 rounded-xl bg-white/5 border border-white/5"
                          role="listitem"
                          aria-label={`${trait.name}: ${trait.value}, ${direction === 'up' ? 'increased' : direction === 'down' ? 'decreased' : 'unchanged'}`}
                        >
                          <div className="flex items-center gap-1 sm:gap-2">
                            <span aria-hidden="true">{getTraitIndicator(direction)}</span>
                            <span className="text-xs sm:text-sm text-slate-300">{trait.name}</span>
                          </div>
                          <span
                            className={`text-xs sm:text-sm font-bold ${
                              showPositiveIndicator ? 'text-lime-400' : 'text-slate-400'
                            }`}
                          >
                            {trait.value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </nav>
      </div>
    </motion.div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const PersonaEvolution = memo(PersonaEvolutionComponent);
