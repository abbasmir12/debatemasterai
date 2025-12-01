/**
 * PersonaShowcase - Main container component for the persona feature
 * Displays user's debate persona with interactive 3D elements and analytics
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { PersonaHero } from './PersonaHero';
import { PersonaDetails } from './PersonaDetails';
import { PersonaEvolution } from './PersonaEvolution';
import { ArchetypeExplorer } from './ArchetypeExplorer';
import { PersonaService } from '@/services/personaService';
import { getHistory } from '@/services/storageService';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { sanitizeSessionHistory, validateArchetypes, validatePersonaArchetype } from '@/utils/personaValidation';
import type { PersonaArchetype, PersonaTrait, PersonaEvolution as PersonaEvolutionType } from '@/types';

interface PersonaShowcaseProps {
  onBack: () => void;
}

/**
 * PersonaShowcase Component
 * Main view for exploring user's debate persona
 */
export default function PersonaShowcase({ onBack }: PersonaShowcaseProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [persona, setPersona] = useState<{
    archetype: PersonaArchetype;
    traits: PersonaTrait[];
    evolution: PersonaEvolutionType[];
  } | null>(null);
  const [selectedArchetype, setSelectedArchetype] = useState<PersonaArchetype | null>(null);
  const [allArchetypes, setAllArchetypes] = useState<PersonaArchetype[]>([]);
  const prefersReducedMotion = useReducedMotion();

  // Memoize onBack callback to prevent unnecessary re-renders
  const handleBack = useCallback(() => {
    onBack();
  }, [onBack]);

  // Keyboard navigation: Escape key to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleBack]);

  // Load session history and calculate persona on mount
  useEffect(() => {
    const loadPersona = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load session history from storage
        const rawSessions = getHistory();

        // Validate and sanitize session history data
        const { sessions, warning } = sanitizeSessionHistory(rawSessions);

        if (warning) {
          console.warn('Session history validation:', warning);
        }

        // Calculate persona using PersonaService
        const result = PersonaService.calculatePersona(sessions);

        // Validate calculation result
        if (!result || !result.archetype) {
          throw new Error('Persona calculation failed: invalid result');
        }

        // Validate the returned archetype
        if (!validatePersonaArchetype(result.archetype)) {
          throw new Error('Persona calculation returned invalid archetype data');
        }

        // Validate traits
        if (!Array.isArray(result.traits)) {
          throw new Error('Persona calculation returned invalid traits data');
        }

        // Calculate evolution timeline
        const evolution = PersonaService.calculateEvolution(sessions);

        // Validate evolution data
        if (!Array.isArray(evolution)) {
          throw new Error('Evolution calculation returned invalid data');
        }

        // Get all available archetypes with lock status based on user's progress
        const archetypes = PersonaService.getAllArchetypesWithLockStatus(sessions, result.traits);

        // Validate archetypes
        const { valid: validArchetypes, errors: archetypeErrors } = validateArchetypes(archetypes);

        if (archetypeErrors.length > 0) {
          console.error('Archetype validation errors:', archetypeErrors);
          throw new Error('Failed to load valid archetype definitions');
        }

        if (validArchetypes.length === 0) {
          throw new Error('No valid archetypes available');
        }

        setPersona({
          archetype: result.archetype,
          traits: result.traits,
          evolution,
        });
        setSelectedArchetype(result.archetype);
        setAllArchetypes(validArchetypes);
      } catch (err) {
        console.error('Error calculating persona:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadPersona();
  }, []);

  // Memoize archetype selection handler
  const handleSelectArchetype = useCallback((archetypeId: string) => {
    const archetype = allArchetypes.find((a) => a.id === archetypeId);
    if (archetype) {
      setSelectedArchetype(archetype);
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [allArchetypes]);

  // Memoize display archetype to prevent recalculation
  // MUST be before conditional returns to follow Rules of Hooks
  const displayArchetype = useMemo(() => 
    selectedArchetype || (persona?.archetype ?? null),
    [selectedArchetype, persona?.archetype]
  );

  // Loading state with skeleton UI
  if (loading) {
    return (
      <div className="min-h-screen bg-void text-white p-6">
        <div className="max-w-7xl mx-auto">
          {/* Back button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-8 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-void rounded-lg px-2 py-1"
            aria-label="Go back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>

          {/* Loading spinner */}
          <div className="flex flex-col items-center justify-center min-h-[60vh]" role="status" aria-live="polite">
            <Loader2 className="w-12 h-12 text-lime-400 animate-spin mb-4" aria-hidden="true" />
            <p className="text-slate-400 text-lg">Analyzing your debate persona...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-void text-white p-6">
        <div className="max-w-7xl mx-auto">
          {/* Back button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-8 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-void rounded-lg px-2 py-1"
            aria-label="Go back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>

          {/* Error message */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
          >
            <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mb-6" aria-hidden="true">
              <AlertCircle className="w-12 h-12 text-red-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Unable to Load Persona
            </h2>
            <p className="text-slate-400 text-lg max-w-md mb-2">
              {error}
            </p>
            <p className="text-slate-500 text-sm max-w-md mb-8">
              Please try again or check your session history data.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-lime-400 text-void font-semibold rounded-xl hover:bg-lime-500 transition focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-void"
                aria-label="Retry loading persona"
              >
                Try Again
              </button>
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-white/5 text-white font-semibold rounded-xl hover:bg-white/10 transition border border-white/10 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-void"
                aria-label="Go back to dashboard"
              >
                Back to Dashboard
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Empty state - no sessions
  if (!persona || persona.traits.length === 0) {
    return (
      <div className="min-h-screen bg-void text-white p-6">
        <div className="max-w-7xl mx-auto">
          {/* Back button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-8 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-void rounded-lg px-2 py-1"
            aria-label="Go back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>

          {/* Empty state message */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
          >
            <div className="w-24 h-24 rounded-full bg-lime-400/10 flex items-center justify-center mb-6" aria-hidden="true">
              <span className="text-5xl">🎭</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Your Persona Awaits Discovery
            </h2>
            <p className="text-slate-400 text-lg max-w-md mb-8">
              Complete your first debate session to unlock your unique debate persona and
              discover your strengths, style, and growth potential.
            </p>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-lime-400 text-void font-semibold rounded-xl hover:bg-lime-500 transition focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-void"
              aria-label="Start your first debate"
            >
              Start Your First Debate
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // displayArchetype is already memoized at the top of the component
  // Safe to use here after all conditional returns
  // At this point, persona is guaranteed to exist (checked by empty state above)
  if (!displayArchetype || !persona) {
    return null; // Should never happen, but satisfies TypeScript
  }

  return (
    <div className="min-h-screen bg-void text-white">
      <div className="max-w-7xl mx-auto p-6" role="main" aria-label="Persona Showcase">
        {/* Back button */}
        <motion.button
          initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
          onClick={handleBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-8 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-void rounded-lg px-2 py-1"
          aria-label="Go back to dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </motion.button>

        {/* Hero Section */}
        <motion.section
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? {} : { duration: 0.5 }}
          className="mb-12"
          aria-labelledby="persona-hero-heading"
        >
          <PersonaHero archetype={displayArchetype} traits={persona.traits} />
        </motion.section>

        {/* Persona Details Section */}
        <motion.section
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? {} : { duration: 0.5, delay: 0.2 }}
          className="mb-16"
          aria-labelledby="persona-details-heading"
        >
          <PersonaDetails archetype={displayArchetype} traits={persona.traits} />
        </motion.section>

        {/* Archetype Explorer Section */}
        {allArchetypes.length > 1 && (
          <motion.section
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? {} : { duration: 0.5, delay: 0.3 }}
            className="mb-16"
            aria-labelledby="archetype-explorer-heading"
          >
            <ArchetypeExplorer
              currentArchetype={displayArchetype}
              allArchetypes={allArchetypes}
              onSelectArchetype={handleSelectArchetype}
            />
          </motion.section>
        )}

        {/* Evolution Timeline Section */}
        {persona.evolution.length > 0 && (
          <motion.section
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? {} : { duration: 0.5, delay: 0.4 }}
            className="mb-16"
            aria-labelledby="persona-evolution-heading"
          >
            <PersonaEvolution evolution={persona.evolution} />
          </motion.section>
        )}
      </div>
    </div>
  );
}
