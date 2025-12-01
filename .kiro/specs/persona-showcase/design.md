# Design Document

## Overview

The Persona Showcase feature creates an immersive, next-generation UI experience for users to discover and explore their debate personas. The design leverages modern web technologies including 3D interactive elements (Spline), advanced CSS techniques (glassmorphism, spotlight effects), and sophisticated animations (framer-motion) while maintaining the DebateMaster AI dark theme aesthetic.

The feature integrates seamlessly with the existing React/TypeScript architecture, following shadcn/ui patterns for component structure and Tailwind CSS for styling. The persona system analyzes historical debate performance to identify user archetypes and presents this information through an engaging, interactive interface.

## Architecture

### Component Hierarchy

```
App.tsx
└── PersonaShowcase.tsx (new view)
    ├── PersonaHero.tsx
    │   ├── SplineScene (3D robot)
    │   └── PersonaIntro
    ├── PersonaDetails.tsx
    │   ├── ArchetypeCard
    │   ├── TraitsGrid
    │   └── StrengthsWeaknesses
    ├── PersonaEvolution.tsx
    │   ├── TimelineChart
    │   └── MilestonesBadges
    └── ArchetypeExplorer.tsx
        └── ArchetypeComparisonCards
```

### Technology Stack Integration

**Core Technologies:**
- React 18 with TypeScript (existing)
- Tailwind CSS (existing)
- Framer Motion (new - for advanced animations)
- Spline Runtime (new - for 3D scenes)
- shadcn/ui patterns (new - for component structure)

**New Dependencies:**
- `@splinetool/runtime`: ^1.0.0
- `@splinetool/react-spline`: ^2.0.0
- `framer-motion`: ^10.0.0
- `lucide-react`: ^0.300.0 (professional icons)

### State Management

The persona feature will extend the existing App.tsx state management pattern:

```typescript
// Add to AppView enum
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  DEBATE_LIVE = 'DEBATE_LIVE',
  SUMMARY = 'SUMMARY',
  SETTINGS = 'SETTINGS',
  ACTIVITY = 'ACTIVITY',
  PERSONA = 'PERSONA', // NEW
}

// New persona-specific types
export interface PersonaArchetype {
  id: string;
  name: string;
  description: string;
  icon: string;
  traits: PersonaTrait[];
  strengths: string[];
  weaknesses: string[];
  color: string; // accent color for this archetype
}

export interface PersonaTrait {
  name: string;
  value: number; // 0-100
  description: string;
}

export interface PersonaEvolution {
  date: string;
  archetypeId: string;
  traits: PersonaTrait[];
  milestone?: string;
}

export interface UserPersona {
  currentArchetype: PersonaArchetype;
  traits: PersonaTrait[];
  evolution: PersonaEvolution[];
  calculatedAt: number;
}
```

### Routing Integration

Add persona navigation to the existing sidebar in App.tsx:

```typescript
const goToPersona = () => {
  setCurrentView(AppView.PERSONA);
};

// In sidebar nav
<button
  onClick={goToPersona}
  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition mt-2 ${
    currentView === AppView.PERSONA
      ? 'bg-lime-400 text-void'
      : 'text-slate-400 hover:bg-white/5 hover:text-white'
  }`}
>
  <UserCircle className="w-5 h-5" />
  <span className="font-medium">Persona</span>
</button>
```

## Components and Interfaces

### 1. PersonaShowcase Component

**Purpose:** Main container component for the persona feature
**Location:** `src/components/PersonaShowcase.tsx`

```typescript
interface PersonaShowcaseProps {
  onBack: () => void;
}

export default function PersonaShowcase({ onBack }: PersonaShowcaseProps) {
  const [persona, setPersona] = useState<UserPersona | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
  
  // Calculate persona from session history
  useEffect(() => {
    const calculated = calculatePersonaFromHistory();
    setPersona(calculated);
    setLoading(false);
  }, []);
  
  // Render sections
}
```

### 2. PersonaHero Component

**Purpose:** Immersive hero section with 3D Spline scene and persona introduction
**Location:** `src/components/PersonaHero.tsx`

**Features:**
- Full-width hero section with split layout
- Left: Gradient text heading, persona name, description
- Right: Interactive 3D Spline robot that tracks mouse
- Spotlight effect following cursor
- Parallax scrolling effect

```typescript
interface PersonaHeroProps {
  archetype: PersonaArchetype;
  traits: PersonaTrait[];
}

export function PersonaHero({ archetype, traits }: PersonaHeroProps) {
  return (
    <Card className="relative overflow-hidden h-[600px]">
      <Spotlight className="-top-40 left-0 md:left-60" fill="white" />
      
      <div className="flex h-full">
        {/* Left: Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 p-12 relative z-10"
        >
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Your Debate Persona
          </h1>
          <h2 className="text-4xl font-bold text-lime-400 mt-4">
            {archetype.name}
          </h2>
          <p className="text-slate-300 mt-6 text-lg max-w-lg">
            {archetype.description}
          </p>
        </motion.div>
        
        {/* Right: 3D Scene */}
        <div className="flex-1 relative">
          <SplineScene 
            scene="https://prod.spline.design/[SCENE_ID]/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  );
}
```

### 3. SplineScene Component (UI Utility)

**Purpose:** Lazy-loaded wrapper for Spline 3D scenes
**Location:** `src/components/ui/splite.tsx`

```typescript
interface SplineSceneProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense fallback={
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-400"></div>
      </div>
    }>
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}
```

### 4. Spotlight Component (UI Utility)

**Purpose:** Dynamic spotlight effect that follows cursor
**Location:** `src/components/ui/spotlight.tsx`

Two implementations provided:
- **aceternity/spotlight**: Static SVG spotlight with animation
- **ibelick/spotlight**: Interactive spotlight that follows mouse with spring physics

```typescript
interface SpotlightProps {
  className?: string;
  size?: number;
  springOptions?: SpringOptions;
}

export function Spotlight({ 
  className, 
  size = 200,
  springOptions = { bounce: 0 }
}: SpotlightProps) {
  // Mouse tracking with framer-motion springs
  // Radial gradient that follows cursor
}
```

### 5. Card Components (UI Utilities)

**Purpose:** shadcn/ui card components for consistent layout
**Location:** `src/components/ui/card.tsx`

```typescript
export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-[2rem] border border-white/5 bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
);

// Also: CardHeader, CardTitle, CardDescription, CardContent, CardFooter
```

### 6. PersonaDetails Component

**Purpose:** Display archetype details with glassmorphism cards
**Location:** `src/components/PersonaDetails.tsx`

**Features:**
- Glassmorphism effect cards with backdrop-blur
- Animated trait bars with counting numbers
- Tilt effect on hover
- Professional icons from lucide-react

```typescript
interface PersonaDetailsProps {
  archetype: PersonaArchetype;
  traits: PersonaTrait[];
}

export function PersonaDetails({ archetype, traits }: PersonaDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {traits.map((trait, index) => (
        <motion.div
          key={trait.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <GlassmorphicCard trait={trait} />
        </motion.div>
      ))}
    </div>
  );
}
```

### 7. GlassmorphicCard Component

**Purpose:** Reusable card with glassmorphism effect and tilt interaction
**Location:** `src/components/GlassmorphicCard.tsx`

```typescript
interface GlassmorphicCardProps {
  trait: PersonaTrait;
}

export function GlassmorphicCard({ trait }: GlassmorphicCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      x: (y - 0.5) * 10, // tilt range: -5 to 5 degrees
      y: (x - 0.5) * -10
    });
  };
  
  return (
    <motion.div
      className="relative p-6 rounded-[2rem] backdrop-blur-xl bg-white/5 border border-white/10"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      whileHover={{ scale: 1.05 }}
    >
      <Spotlight size={150} />
      {/* Trait content */}
    </motion.div>
  );
}
```

### 8. PersonaEvolution Component

**Purpose:** Timeline visualization of persona changes over time
**Location:** `src/components/PersonaEvolution.tsx`

**Features:**
- Vertical timeline with animated milestones
- Line chart showing trait evolution
- Badge components for achievements
- Scroll-triggered animations

```typescript
interface PersonaEvolutionProps {
  evolution: PersonaEvolution[];
}

export function PersonaEvolution({ evolution }: PersonaEvolutionProps) {
  const { ref, inView } = useInView({ threshold: 0.3 });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
    >
      <Timeline evolution={evolution} />
      <MilestonesBadges evolution={evolution} />
    </motion.div>
  );
}
```

### 9. ArchetypeExplorer Component

**Purpose:** Browse and compare different persona archetypes
**Location:** `src/components/ArchetypeExplorer.tsx`

**Features:**
- Grid of archetype cards
- Hover effects with glow
- Comparison mode
- Smooth transitions between selections

```typescript
interface ArchetypeExplorerProps {
  currentArchetype: PersonaArchetype;
  allArchetypes: PersonaArchetype[];
  onSelectArchetype: (id: string) => void;
}

export function ArchetypeExplorer({ 
  currentArchetype, 
  allArchetypes,
  onSelectArchetype 
}: ArchetypeExplorerProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {allArchetypes.map((archetype) => (
        <ArchetypeCard
          key={archetype.id}
          archetype={archetype}
          isActive={archetype.id === currentArchetype.id}
          onClick={() => onSelectArchetype(archetype.id)}
        />
      ))}
    </div>
  );
}
```

## Data Models

### Persona Calculation Service

**Location:** `src/services/personaService.ts`

```typescript
export interface PersonaCalculationResult {
  archetype: PersonaArchetype;
  traits: PersonaTrait[];
  confidence: number; // 0-1, how confident we are in this classification
}

export class PersonaService {
  /**
   * Calculate user persona from session history
   * Analyzes patterns in debate performance metrics
   */
  static calculatePersona(sessions: SessionHistoryItem[]): PersonaCalculationResult {
    if (sessions.length === 0) {
      return this.getDefaultPersona();
    }
    
    // Aggregate metrics across sessions
    const avgConfidence = this.calculateAverage(sessions, 'confidenceLevel');
    const avgVocabulary = this.calculateAverage(sessions, 'vocabularyScore');
    const avgClarity = this.calculateAverage(sessions, 'clarityScore');
    const avgArgumentStrength = this.calculateAverage(sessions, 'argumentStrength');
    const avgPersuasion = this.calculateAverage(sessions, 'persuasionScore');
    
    // Determine archetype based on dominant traits
    const archetype = this.matchArchetype({
      confidence: avgConfidence,
      vocabulary: avgVocabulary,
      clarity: avgClarity,
      argumentStrength: avgArgumentStrength,
      persuasion: avgPersuasion
    });
    
    // Build trait list
    const traits: PersonaTrait[] = [
      { name: 'Confidence', value: avgConfidence, description: '...' },
      { name: 'Vocabulary', value: avgVocabulary, description: '...' },
      { name: 'Clarity', value: avgClarity, description: '...' },
      { name: 'Argument Strength', value: avgArgumentStrength, description: '...' },
      { name: 'Persuasion', value: avgPersuasion, description: '...' }
    ];
    
    return {
      archetype,
      traits,
      confidence: sessions.length >= 5 ? 0.9 : sessions.length / 5
    };
  }
  
  /**
   * Track persona evolution over time
   */
  static calculateEvolution(sessions: SessionHistoryItem[]): PersonaEvolution[] {
    // Group sessions by time periods (weekly/monthly)
    // Calculate persona for each period
    // Return timeline of changes
  }
  
  /**
   * Get all available archetypes
   */
  static getAllArchetypes(): PersonaArchetype[] {
    return ARCHETYPE_DEFINITIONS;
  }
}

// Predefined archetype definitions
const ARCHETYPE_DEFINITIONS: PersonaArchetype[] = [
  {
    id: 'analytical-strategist',
    name: 'Analytical Strategist',
    description: 'You approach debates with logic and careful planning...',
    icon: 'brain',
    traits: [...],
    strengths: ['Logical reasoning', 'Evidence-based arguments', 'Strategic thinking'],
    weaknesses: ['May lack emotional appeal', 'Can be overly cautious'],
    color: '#3b82f6' // blue
  },
  {
    id: 'passionate-advocate',
    name: 'Passionate Advocate',
    description: 'You debate with emotion and conviction...',
    icon: 'heart',
    traits: [...],
    strengths: ['Emotional connection', 'Persuasive delivery', 'Inspiring rhetoric'],
    weaknesses: ['May overlook logic', 'Can be too aggressive'],
    color: '#ef4444' // red
  },
  // ... more archetypes
];
```

### Storage Integration

Extend `storageService.ts` to persist persona data:

```typescript
export function savePersona(persona: UserPersona): void {
  localStorage.setItem('debate_master_persona', JSON.stringify(persona));
}

export function loadPersona(): UserPersona | null {
  const data = localStorage.getItem('debate_master_persona');
  return data ? JSON.parse(data) : null;
}
```

## Co
rrectness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Based on the requirements analysis, the following correctness properties must hold for the Persona Showcase feature:

### Property 1: Persona calculation completeness
*For any* set of valid session history data with at least one session, the persona calculation SHALL return a valid PersonaArchetype with all required fields (id, name, description, traits, strengths, weaknesses).
**Validates: Requirements 1.5**

### Property 2: Tilt calculation bounds
*For any* mouse position within a card's bounding rectangle, the calculated tilt rotation values SHALL be within the range of -10 to +10 degrees for both X and Y axes.
**Validates: Requirements 3.5**

### Property 3: Archetype display completeness
*For any* valid PersonaArchetype object, when rendered in the PersonaDetails component, the display SHALL include the archetype name, description, and all trait entries from the traits array.
**Validates: Requirements 4.1**

### Property 4: Archetype navigation availability
*For any* collection of archetypes where the count is greater than 1, the ArchetypeExplorer component SHALL render navigation controls that allow selection of each archetype.
**Validates: Requirements 4.5**

### Property 5: Evolution timeline completeness
*For any* PersonaEvolution array with one or more entries, the timeline visualization SHALL display an entry for each evolution record with its associated date.
**Validates: Requirements 7.1**

### Property 6: Improvement indicator correctness
*For any* two PersonaEvolution entries where a trait value in the later entry is greater than the same trait value in the earlier entry, the comparison view SHALL display a positive visual indicator for that trait.
**Validates: Requirements 7.3**

## Error Handling

### Insufficient Data Scenarios

**No Session History:**
- Display empty state with encouraging message
- Show default "Novice Explorer" archetype
- Provide call-to-action to start first debate
- Hide evolution timeline section

**Incomplete Session Data:**
- Use default values for missing metrics (0 or null)
- Calculate persona with available data
- Display confidence indicator showing data quality
- Show warning if confidence < 0.5

### Loading States

**Spline Scene Loading:**
- Display animated loading spinner in Suspense fallback
- Prevent layout shift with fixed height container
- Timeout after 10 seconds with fallback static image
- Error boundary catches Spline runtime errors

**Persona Calculation:**
- Show skeleton UI while calculating
- Animate transition when data loads
- Handle calculation errors gracefully
- Fallback to cached persona if calculation fails

### Component Errors

**Error Boundaries:**
```typescript
<ErrorBoundary fallback={<PersonaErrorFallback />}>
  <PersonaShowcase />
</ErrorBoundary>
```

**Graceful Degradation:**
- If 3D scene fails: Show static hero image
- If animations fail: Display static content
- If icons fail: Use text labels
- If charts fail: Show tabular data

### Data Validation

**Session History Validation:**
```typescript
function validateSessionHistory(sessions: SessionHistoryItem[]): boolean {
  return sessions.every(session => 
    session.id &&
    session.date &&
    session.topic &&
    typeof session.score === 'number' &&
    session.score >= 0 &&
    session.score <= 100
  );
}
```

**Archetype Validation:**
```typescript
function validateArchetype(archetype: PersonaArchetype): boolean {
  return (
    archetype.id &&
    archetype.name &&
    archetype.description &&
    Array.isArray(archetype.traits) &&
    archetype.traits.length > 0 &&
    Array.isArray(archetype.strengths) &&
    Array.isArray(archetype.weaknesses)
  );
}
```

## Testing Strategy

### Unit Testing

The Persona Showcase feature will use Vitest for unit testing, following the existing project patterns. Unit tests will focus on:

**Component Rendering:**
- PersonaShowcase renders without crashing
- PersonaHero displays archetype name and description
- PersonaDetails renders all trait cards
- ArchetypeExplorer renders all archetype options
- PersonaEvolution displays timeline entries

**Calculation Logic:**
- PersonaService.calculatePersona returns valid archetype for various session histories
- Trait averaging calculations are correct
- Evolution tracking correctly groups sessions by time period
- Tilt calculation produces values within expected bounds

**Conditional Rendering:**
- Empty state shown when no session history exists
- Loading state shown during persona calculation
- Error fallback shown when calculation fails
- Encouraging message shown when data is insufficient

**Styling Verification:**
- Components use correct Tailwind classes for theme colors
- Cards have rounded-[2rem] corners
- Accent elements use lime-400 color
- Glassmorphism effects have backdrop-blur classes

### Property-Based Testing

Property-based tests will verify universal properties across randomized inputs using fast-check library (JavaScript PBT library). Each test will run a minimum of 100 iterations.

**PBT Library:** fast-check (https://github.com/dubzzz/fast-check)

**Property Test 1: Persona Calculation Completeness**
- **Feature: persona-showcase, Property 1: Persona calculation completeness**
- Generate random session histories with varying lengths and metric values
- Verify that calculatePersona always returns a valid PersonaArchetype
- Check that all required fields are present and non-empty
- Validates: Requirements 1.5

**Property Test 2: Tilt Calculation Bounds**
- **Feature: persona-showcase, Property 2: Tilt calculation bounds**
- Generate random mouse positions within various card dimensions
- Calculate tilt values for each position
- Verify that tilt.x and tilt.y are always between -10 and +10
- Validates: Requirements 3.5

**Property Test 3: Archetype Display Completeness**
- **Feature: persona-showcase, Property 3: Archetype display completeness**
- Generate random PersonaArchetype objects with varying trait counts
- Render PersonaDetails component with each archetype
- Verify that name, description, and all traits are present in rendered output
- Validates: Requirements 4.1

**Property Test 4: Archetype Navigation Availability**
- **Feature: persona-showcase, Property 4: Archetype navigation availability**
- Generate random arrays of archetypes with length > 1
- Render ArchetypeExplorer with each array
- Verify that navigation controls exist and each archetype is selectable
- Validates: Requirements 4.5

**Property Test 5: Evolution Timeline Completeness**
- **Feature: persona-showcase, Property 5: Evolution timeline completeness**
- Generate random PersonaEvolution arrays with varying lengths
- Render PersonaEvolution component with each array
- Verify that timeline contains an entry for each evolution record
- Validates: Requirements 7.1

**Property Test 6: Improvement Indicator Correctness**
- **Feature: persona-showcase, Property 6: Improvement indicator correctness**
- Generate pairs of PersonaEvolution entries with random trait values
- For each pair where a trait increased, verify positive indicator is shown
- For each pair where a trait decreased, verify no positive indicator
- Validates: Requirements 7.3

### Integration Testing

Integration tests will verify component interactions and data flow:

**Navigation Flow:**
- Clicking persona nav button navigates to persona view
- Back button returns to dashboard
- Archetype selection updates displayed content

**Data Flow:**
- Session history loads from localStorage
- Persona calculation uses loaded sessions
- Calculated persona displays in UI
- Persona saves to localStorage

**Animation Integration:**
- Framer-motion animations trigger on mount
- Scroll-triggered animations activate at correct viewport positions
- Hover effects respond to mouse events
- Transitions occur smoothly between states

### Visual Regression Testing

Given the heavy focus on visual design, consider visual regression testing:

**Tools:** Percy, Chromatic, or Playwright screenshots
**Test Cases:**
- Hero section with 3D scene
- Glassmorphic trait cards
- Timeline visualization
- Archetype comparison grid
- Empty state
- Loading state
- Mobile responsive layouts

## Performance Considerations

### Lazy Loading Strategy

**Code Splitting:**
```typescript
// Lazy load persona view
const PersonaShowcase = lazy(() => import('./components/PersonaShowcase'));

// Lazy load Spline runtime
const Spline = lazy(() => import('@splinetool/react-spline'));
```

**Benefits:**
- Reduces initial bundle size
- Persona feature only loads when accessed
- Spline runtime (large dependency) loads on demand

### Animation Performance

**GPU Acceleration:**
- Use transform and opacity for animations (GPU-accelerated)
- Avoid animating layout properties (width, height, top, left)
- Use will-change CSS property sparingly

**Framer Motion Optimization:**
```typescript
// Use layout animations for smooth transitions
<motion.div layout layoutId="persona-card">

// Reduce motion for accessibility
const shouldReduceMotion = useReducedMotion();
<motion.div animate={shouldReduceMotion ? {} : { scale: 1.05 }}>
```

### 3D Scene Optimization

**Spline Scene Best Practices:**
- Keep polygon count under 50k for smooth performance
- Use texture compression
- Optimize scene lighting (max 3 lights)
- Implement LOD (Level of Detail) if needed

**Fallback Strategy:**
- Detect low-performance devices
- Show static image instead of 3D scene on mobile
- Provide toggle to disable 3D effects

### Memory Management

**Cleanup:**
```typescript
useEffect(() => {
  // Setup animations, event listeners
  
  return () => {
    // Cleanup to prevent memory leaks
    removeEventListeners();
    cancelAnimations();
  };
}, []);
```

**Memoization:**
```typescript
// Memoize expensive calculations
const calculatedPersona = useMemo(
  () => PersonaService.calculatePersona(sessions),
  [sessions]
);

// Memoize callbacks
const handleArchetypeSelect = useCallback(
  (id: string) => setSelectedArchetype(id),
  []
);
```

## Accessibility

### Keyboard Navigation

- All interactive elements accessible via Tab key
- Focus indicators visible on all focusable elements
- Escape key closes modals/overlays
- Arrow keys navigate between archetypes

### Screen Reader Support

**ARIA Labels:**
```typescript
<div role="region" aria-label="Persona Details">
<button aria-label="Select Analytical Strategist archetype">
<div role="progressbar" aria-valuenow={trait.value} aria-valuemin={0} aria-valuemax={100}>
```

**Semantic HTML:**
- Use proper heading hierarchy (h1, h2, h3)
- Use <nav> for navigation sections
- Use <article> for archetype cards
- Use <section> for major content areas

### Reduced Motion

**Respect User Preferences:**
```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<motion.div
  initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
>
```

### Color Contrast

- Ensure text meets WCAG AA standards (4.5:1 for normal text)
- Lime-400 accent on dark backgrounds: 8.2:1 ratio ✓
- White text on void background: 15.3:1 ratio ✓
- Provide visual indicators beyond color alone

## Mobile Responsiveness

### Breakpoint Strategy

**Tailwind Breakpoints:**
- sm: 640px (small tablets)
- md: 768px (tablets)
- lg: 1024px (laptops)
- xl: 1280px (desktops)

### Layout Adaptations

**Hero Section:**
- Desktop: Side-by-side (text left, 3D right)
- Mobile: Stacked (text top, 3D bottom with reduced height)

**Trait Grid:**
- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column

**Archetype Explorer:**
- Desktop: 4 columns
- Tablet: 2 columns
- Mobile: 1 column

### Touch Interactions

**Replace Hover Effects:**
```typescript
// Desktop: hover
// Mobile: tap/touch
<motion.div
  whileHover={isDesktop ? { scale: 1.05 } : {}}
  whileTap={isMobile ? { scale: 0.95 } : {}}
>
```

**Tilt Effect:**
- Desktop: Mouse position
- Mobile: Device orientation (gyroscope) or disable

### Performance on Mobile

- Disable 3D scene on devices with < 4GB RAM
- Reduce animation complexity on mobile
- Use smaller image assets
- Lazy load below-the-fold content

## Future Enhancements

### Phase 2 Features

**Social Sharing:**
- Generate shareable persona cards
- Export persona as image
- Share on social media

**Persona Challenges:**
- Suggested debate topics based on archetype
- Challenges to develop weak traits
- Achievement system

**AI Recommendations:**
- Personalized training suggestions
- Opponent matching based on archetype
- Learning resources tailored to persona

**Advanced Analytics:**
- Deeper trait analysis
- Comparison with other users (anonymized)
- Predictive modeling for growth

### Technical Improvements

**WebGL Optimization:**
- Implement custom WebGL renderer for better performance
- Progressive enhancement for 3D features

**Real-time Updates:**
- WebSocket connection for live persona updates
- Collaborative features (compare with friends)

**Advanced Animations:**
- Particle effects
- Morphing transitions between archetypes
- Interactive data visualizations

## Dependencies Summary

### New NPM Packages

```json
{
  "dependencies": {
    "@splinetool/runtime": "^1.0.0",
    "@splinetool/react-spline": "^2.0.0",
    "framer-motion": "^10.0.0",
    "lucide-react": "^0.300.0"
  },
  "devDependencies": {
    "fast-check": "^3.15.0"
  }
}
```

### Utility Library Setup

Create `src/lib/utils.ts` for shadcn/ui utilities:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Install required utilities:
```bash
npm install clsx tailwind-merge
```

## Implementation Notes

### Spline Scene Setup

1. Create 3D scene in Spline editor (https://spline.design)
2. Configure mouse tracking behavior in Spline
3. Export scene and get public URL
4. Use URL in SplineScene component

**Scene Requirements:**
- Robot/character model with head tracking
- Dark background matching void color
- Optimized for web (< 5MB)
- Mouse follow behavior configured

### Archetype Definitions

Define 6-8 distinct archetypes covering the spectrum of debate styles:

1. **Analytical Strategist** - Logic-focused, methodical
2. **Passionate Advocate** - Emotion-driven, inspiring
3. **Diplomatic Mediator** - Balanced, consensus-building
4. **Aggressive Challenger** - Confrontational, direct
5. **Creative Innovator** - Unconventional, thought-provoking
6. **Scholarly Expert** - Knowledge-based, authoritative
7. **Charismatic Performer** - Entertaining, engaging
8. **Tactical Debater** - Adaptive, strategic

Each archetype should have:
- Unique color scheme
- Distinct icon
- 5-7 defining traits
- 3-5 strengths
- 2-3 weaknesses
- Detailed description (100-150 words)

### Animation Timing

**Standard Durations:**
- Micro-interactions: 150ms
- Component transitions: 300ms
- Page transitions: 500ms
- Stagger delay: 100ms per item

**Easing Functions:**
- Enter: easeOut
- Exit: easeIn
- Hover: easeInOut
- Spring: { type: "spring", stiffness: 300, damping: 30 }

## Conclusion

The Persona Showcase feature represents a significant enhancement to DebateMaster AI, transforming persona discovery into an immersive, engaging experience. By leveraging modern web technologies (3D graphics, advanced animations, glassmorphism) while maintaining the existing dark theme aesthetic, the feature will provide users with a compelling reason to explore their debating style and track their growth over time.

The design prioritizes performance, accessibility, and maintainability while pushing the boundaries of web UI/UX. The modular component architecture ensures the feature integrates seamlessly with the existing codebase and can be extended with future enhancements.
