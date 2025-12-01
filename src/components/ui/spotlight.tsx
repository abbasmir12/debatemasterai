import * as React from "react";
import { motion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpotlightProps {
  className?: string;
  fill?: string;
}

/**
 * Aceternity variant: SVG-based spotlight with animation
 * Static spotlight effect with configurable fill color and positioning
 */
export function Spotlight({ className, fill = "white" }: SpotlightProps) {
  return (
    <svg
      className={cn(
        "animate-spotlight pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[84%] opacity-0",
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter="url(#filter)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill={fill}
          fillOpacity="0.21"
        ></ellipse>
      </g>
      <defs>
        <filter
          id="filter"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          ></feBlend>
          <feGaussianBlur
            stdDeviation="151"
            result="effect1_foregroundBlur_1065_8"
          ></feGaussianBlur>
        </filter>
      </defs>
    </svg>
  );
}

interface InteractiveSpotlightProps {
  className?: string;
  size?: number;
  springOptions?: {
    stiffness?: number;
    damping?: number;
    bounce?: number;
  };
}

/**
 * ibelick variant: Interactive spotlight that follows mouse with spring physics
 * Mouse-tracking spotlight with framer-motion springs and radial gradient
 */
export function InteractiveSpotlight({
  className,
  size = 200,
  springOptions = { bounce: 0 },
}: InteractiveSpotlightProps) {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  const springX = useSpring(0, springOptions);
  const springY = useSpring(0, springOptions);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
      springX.set(x);
      springY.set(y);
    },
    [springX, springY]
  );

  React.useEffect(() => {
    springX.set(mousePosition.x);
    springY.set(mousePosition.y);
  }, [mousePosition.x, mousePosition.y, springX, springY]);

  return (
    <div
      className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: size,
          height: size,
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          background: `radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}
