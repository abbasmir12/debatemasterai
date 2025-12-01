import * as React from "react";
import { motion } from "framer-motion";
import { PersonaArchetype } from "@/types";
import { ArchetypeCard } from "./ArchetypeCard";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ArchetypeExplorerProps {
  currentArchetype: PersonaArchetype;
  allArchetypes: PersonaArchetype[];
  onSelectArchetype: (id: string) => void;
}

/**
 * ArchetypeExplorer component
 * Displays a grid of all available archetypes for exploration
 * Allows users to browse and compare different debate personas
 * Memoized for performance
 */
const ArchetypeExplorerComponent = ({
  currentArchetype,
  allArchetypes,
  onSelectArchetype,
}: ArchetypeExplorerProps) => {
  const prefersReducedMotion = useReducedMotion();
  
  // Memoize keyboard navigation handler
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent, index: number) => {
    const currentIndex = allArchetypes.findIndex(a => a.id === currentArchetype.id);
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        newIndex = (currentIndex + 1) % allArchetypes.length;
        allArchetypes[newIndex]?.id && onSelectArchetype(allArchetypes[newIndex]!.id);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        newIndex = (currentIndex - 1 + allArchetypes.length) % allArchetypes.length;
        allArchetypes[newIndex]?.id && onSelectArchetype(allArchetypes[newIndex]!.id);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        allArchetypes[index]?.id && onSelectArchetype(allArchetypes[index]!.id);
        break;
    }
  }, [allArchetypes, currentArchetype.id, onSelectArchetype]);

  return (
    <section className="w-full" role="region" aria-label="Explore All Archetypes">
      {/* Section Header - responsive sizing */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={prefersReducedMotion ? {} : { duration: 0.5 }}
        className="mb-6 md:mb-8"
      >
        <h2 id="archetype-explorer-heading" className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Explore All Archetypes
        </h2>
        <p className="text-slate-400 text-sm sm:text-base">
          Discover the full spectrum of debate personas and their unique characteristics
        </p>
      </motion.div>

      {/* Archetype Grid: 1 col mobile, 2 cols tablet, 4 cols desktop */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        initial={prefersReducedMotion ? "visible" : "hidden"}
        animate="visible"
        variants={prefersReducedMotion ? {} : {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {allArchetypes.map((archetype, index) => (
          <motion.div
            key={archetype.id}
            variants={prefersReducedMotion ? {} : {
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={prefersReducedMotion ? {} : { duration: 0.3 }}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            <ArchetypeCard
              archetype={archetype}
              isActive={archetype.id === currentArchetype.id}
              onClick={() => onSelectArchetype(archetype.id)}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const ArchetypeExplorer = React.memo(ArchetypeExplorerComponent);
