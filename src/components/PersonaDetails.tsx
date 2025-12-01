import { useMemo, memo } from "react";
import { motion } from "framer-motion";
import { GlassmorphicCard } from "@/components/GlassmorphicCard";
import { PersonaArchetype, PersonaTrait } from "@/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface PersonaDetailsProps {
  archetype: PersonaArchetype;
  traits: PersonaTrait[];
}

/**
 * PersonaDetails component displays persona traits in a responsive grid
 * with glassmorphic cards and staggered animations
 * 
 * Layout:
 * - Desktop (lg): 3 columns
 * - Tablet (md): 2 columns
 * - Mobile: 1 column
 * Memoized for performance
 */
const PersonaDetailsComponent = ({ archetype, traits }: PersonaDetailsProps) => {
  const prefersReducedMotion = useReducedMotion();
  
  // Memoize validated traits to prevent recalculation
  const validTraits = useMemo(() => 
    traits.filter(
      (trait) =>
        trait &&
        typeof trait.name === 'string' &&
        trait.name.trim() !== '' &&
        typeof trait.value === 'number' &&
        !isNaN(trait.value) &&
        typeof trait.description === 'string'
    ),
    [traits]
  );

  // Memoize archetype name
  const archetypeName = useMemo(() => archetype?.name || 'Unknown', [archetype?.name]);
  
  return (
    <section className="w-full" role="region" aria-label="Persona Details">
      {/* Section Header - responsive sizing */}
      <div className="mb-6 md:mb-8">
        <h2 id="persona-details-heading" className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Your Traits
        </h2>
        <p className="text-slate-400 text-base sm:text-lg">
          Discover the characteristics that define your {archetypeName} persona
        </p>
      </div>

      {/* Responsive Grid: 1 col mobile, 2 cols tablet, 3 cols desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {validTraits.map((trait, index) => (
          <motion.div
            key={trait.name}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? {} : {
              delay: index * 0.1, // Staggered delay: 0s, 0.1s, 0.2s, etc.
              duration: 0.5,
              ease: "easeOut"
            }}
            className="will-change-transform-opacity"
            style={{ transform: 'translateZ(0)' }}
          >
            <GlassmorphicCard trait={trait} />
          </motion.div>
        ))}
      </div>

      {/* Empty State - responsive text */}
      {validTraits.length === 0 && (
        <div className="text-center py-8 md:py-12">
          <p className="text-slate-400 text-base sm:text-lg">
            No traits available. Complete more debate sessions to build your persona.
          </p>
        </div>
      )}
    </section>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const PersonaDetails = memo(PersonaDetailsComponent);
