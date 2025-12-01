import * as React from "react";
import { motion, useMotionValue } from "framer-motion";
import { InteractiveSpotlight } from "@/components/ui/spotlight";
import { PersonaTrait } from "@/types";
import { isTouchDevice } from "@/utils/deviceUtils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { 
  TrendingUp, 
  MessageSquare, 
  Target, 
  Zap, 
  Brain,
  Heart,
  Shield,
  Sparkles
} from "lucide-react";

interface GlassmorphicCardProps {
  trait: PersonaTrait;
}

/**
 * Icon mapping for different trait types
 */
const getTraitIcon = (traitName: string) => {
  const name = traitName.toLowerCase();
  
  if (name.includes('confidence')) return TrendingUp;
  if (name.includes('vocabulary')) return MessageSquare;
  if (name.includes('clarity')) return Target;
  if (name.includes('argument') || name.includes('strength')) return Zap;
  if (name.includes('persuasion')) return Heart;
  if (name.includes('strategic') || name.includes('adaptability')) return Brain;
  if (name.includes('defense') || name.includes('resilience')) return Shield;
  
  return Sparkles; // default icon
};

/**
 * Animated counter component that counts up to the target value
 * Includes proper cleanup to prevent memory leaks
 */
function AnimatedCounter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = React.useState(0);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  
  React.useEffect(() => {
    const duration = 1000; // 1 second animation
    const steps = 60; // 60 fps
    const increment = value / steps;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayValue(value);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      } else {
        setDisplayValue(Math.round(increment * currentStep));
      }
    }, stepDuration);
    
    // Cleanup function to clear interval on unmount or value change
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [value]);
  
  return <span>{displayValue}</span>;
}

/**
 * GlassmorphicCard component with tilt effect and spotlight
 * Displays a persona trait with glassmorphism styling and interactive animations
 * Tilt effects are disabled on touch devices for better mobile experience
 * Memoized for performance
 */
const GlassmorphicCardComponent = ({ trait }: GlassmorphicCardProps) => {
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [isTouch] = React.useState(() => isTouchDevice());
  const prefersReducedMotion = useReducedMotion();
  
  // Motion values for smooth tilt animation
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  
  // Cleanup motion values on unmount
  React.useEffect(() => {
    return () => {
      // Reset motion values to prevent memory leaks
      rotateX.destroy();
      rotateY.destroy();
    };
  }, [rotateX, rotateY]);

  // Memoize validated trait data
  const safeTraitName = React.useMemo(() => trait?.name || 'Unknown Trait', [trait?.name]);
  const safeTraitValue = React.useMemo(() => 
    typeof trait?.value === 'number' && !isNaN(trait.value) 
      ? Math.max(0, Math.min(100, trait.value)) 
      : 0,
    [trait?.value]
  );
  const safeTraitDescription = React.useMemo(() => 
    trait?.description || 'No description available',
    [trait?.description]
  );
  
  // Memoize mouse move handler
  const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Disable tilt on touch devices or if user prefers reduced motion
    if (isTouch || prefersReducedMotion || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0 to 1
    const y = (e.clientY - rect.top) / rect.height; // 0 to 1
    
    // Calculate tilt: center is 0, edges are ±10 degrees
    const tiltX = (y - 0.5) * 10; // vertical mouse movement affects X rotation
    const tiltY = (x - 0.5) * -10; // horizontal mouse movement affects Y rotation
    
    setTilt({ x: tiltX, y: tiltY });
    rotateX.set(tiltX);
    rotateY.set(tiltY);
  }, [isTouch, prefersReducedMotion, rotateX, rotateY]);
  
  // Memoize mouse leave handler
  const handleMouseLeave = React.useCallback(() => {
    // Disable tilt on touch devices or if user prefers reduced motion
    if (isTouch || prefersReducedMotion) return;
    
    setTilt({ x: 0, y: 0 });
    rotateX.set(0);
    rotateY.set(0);
  }, [isTouch, prefersReducedMotion, rotateX, rotateY]);
  
  const Icon = getTraitIcon(safeTraitName);
  
  return (
    <motion.div
      ref={cardRef}
      className="relative p-6 rounded-[2rem] backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden focus-within:ring-2 focus-within:ring-lime-400 focus-within:ring-offset-2 focus-within:ring-offset-void will-change-transform-opacity"
      style={{
        // Only apply tilt transform on non-touch devices and when motion is not reduced
        transform: (isTouch || prefersReducedMotion)
          ? 'translateZ(0)' // GPU acceleration even when not tilting
          : `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`,
        transformStyle: (isTouch || prefersReducedMotion) ? 'flat' : 'preserve-3d',
        backfaceVisibility: 'hidden', // GPU acceleration
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
      whileTap={isTouch && !prefersReducedMotion ? { scale: 0.98 } : undefined}
      transition={prefersReducedMotion ? {} : { type: "spring", stiffness: 300, damping: 30 }}
      tabIndex={0}
      role="article"
      aria-label={`${safeTraitName}: ${safeTraitValue} out of 100`}
    >
      {/* Interactive Spotlight Effect */}
      <div aria-hidden="true">
        <InteractiveSpotlight size={150} springOptions={{ bounce: 0 }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Icon and Name */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-lime-400/10 border border-lime-400/20" aria-hidden="true">
            <Icon className="w-5 h-5 text-lime-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">{safeTraitName}</h3>
        </div>
        
        {/* Animated Value */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-lime-400">
              <AnimatedCounter value={safeTraitValue} />
            </span>
            <span className="text-xl text-slate-400">/100</span>
          </div>
          
          {/* Progress Bar */}
          <div 
            className="mt-3 h-2 bg-white/5 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={safeTraitValue}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${safeTraitName} progress`}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-lime-400 to-lime-500 will-change-transform"
              style={{ transformOrigin: 'left', transform: 'translateZ(0)' }}
              initial={prefersReducedMotion ? { scaleX: safeTraitValue / 100 } : { scaleX: 0 }}
              animate={{ scaleX: safeTraitValue / 100 }}
              transition={prefersReducedMotion ? {} : { duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
        
        {/* Description */}
        <p className="text-sm text-slate-300 leading-relaxed">
          {safeTraitDescription}
        </p>
      </div>
      
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" aria-hidden="true" />
    </motion.div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const GlassmorphicCard = React.memo(GlassmorphicCardComponent);
