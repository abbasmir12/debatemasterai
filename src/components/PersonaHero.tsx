import * as React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { SplineScene } from "@/components/ui/spline";
import { PersonaArchetype, PersonaTrait } from "@/types";
import { getDeviceCapabilities } from "@/utils/deviceUtils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface PersonaHeroProps {
  archetype: PersonaArchetype;
  traits: PersonaTrait[];
}

/**
 * PersonaHero component - Immersive hero section with 3D Spline scene
 * Features split layout with content on left and interactive 3D scene on right
 * Includes gradient text, spotlight effects, and entrance animations
 * Optimized for mobile with reduced 3D scene height
 * Memoized for performance
 */
const PersonaHeroComponent = ({ archetype, traits }: PersonaHeroProps) => {
  const [deviceCapabilities] = React.useState(() => getDeviceCapabilities());
  const prefersReducedMotion = useReducedMotion();
  
  // Calculate average trait value for display
  const averageScore = React.useMemo(() => {
    if (traits.length === 0) return 0;
    const sum = traits.reduce((acc, trait) => acc + trait.value, 0);
    return Math.round(sum / traits.length);
  }, [traits]);
  
  // Determine 3D scene height based on device
  const sceneHeight = React.useMemo(() => {
    if (deviceCapabilities.isMobile) {
      return '250px'; // Reduced height for mobile
    }
    return 'auto'; // Full height for desktop
  }, [deviceCapabilities.isMobile]);

  return (
    <Card className="relative overflow-hidden h-auto md:h-[600px]" role="region" aria-label="Persona Hero">
      {/* Spotlight effect */}
      <Spotlight className="-top-40 left-0 md:left-60" fill="white" aria-hidden="true" />

      {/* Stack layout on mobile, side-by-side on desktop */}
      <div className="flex flex-col md:flex-row h-full">
        {/* Left: Content */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, x: -50 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
          transition={prefersReducedMotion ? {} : { duration: 0.6, ease: "easeOut" }}
          className="flex-1 p-6 sm:p-8 md:p-12 relative z-10 flex flex-col justify-center will-change-transform-opacity"
          style={{ transform: 'translateZ(0)' }}
        >
          {/* Main heading with gradient text - responsive sizing */}
          <h1 id="persona-hero-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Your Debate Persona
          </h1>

          {/* Archetype name in lime-400 - responsive sizing */}
          <motion.h2
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? {} : { duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-lime-400 mt-3 md:mt-4 will-change-transform-opacity"
            style={{ transform: 'translateZ(0)' }}
          >
            {archetype.name}
          </motion.h2>

          {/* Archetype description - responsive sizing */}
          <motion.p
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? {} : { duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="text-slate-300 mt-4 md:mt-6 text-sm sm:text-base md:text-lg max-w-lg leading-relaxed will-change-transform-opacity"
            style={{ transform: 'translateZ(0)' }}
          >
            {archetype.description}
          </motion.p>

          {/* Overall score indicator - responsive sizing */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? {} : { duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="mt-6 md:mt-8 flex items-center gap-4 will-change-transform-opacity"
            style={{ transform: 'translateZ(0)' }}
            role="status"
            aria-label={`Overall score: ${averageScore} out of 100`}
          >
            <div className="flex items-center gap-2">
              <div className="text-xs sm:text-sm text-slate-400">Overall Score:</div>
              <div className="text-xl sm:text-2xl font-bold text-lime-400" aria-hidden="true">
                {averageScore}
                <span className="text-xs sm:text-sm text-slate-400">/100</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right: 3D Scene - reduced height on mobile, fallback for low-end devices */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
          transition={prefersReducedMotion ? {} : { duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex-1 relative md:h-auto md:min-h-0 will-change-transform-opacity"
          style={{ 
            height: deviceCapabilities.isMobile ? sceneHeight : 'auto',
            transform: 'translateZ(0)'
          }}
        >
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </motion.div>
      </div>
    </Card>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const PersonaHero = React.memo(PersonaHeroComponent);
