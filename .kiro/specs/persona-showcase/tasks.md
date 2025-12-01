# Implementation Plan

- [x] 1. Setup project dependencies and utilities





  - Install required NPM packages: @splinetool/runtime, @splinetool/react-spline, framer-motion, lucide-react, clsx, tailwind-merge, fast-check
  - Create src/lib/utils.ts with cn() utility function for class merging
  - Update tsconfig.json to support @/ path alias if not already configured
  - _Requirements: 8.5_

- [x] 2. Create shadcn/ui base components





  - [x] 2.1 Create Card component with variants (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter)


    - Implement in src/components/ui/card.tsx following shadcn pattern
    - Use forwardRef for proper ref handling
    - Apply rounded-[2rem] corners and border-white/5 borders
    - _Requirements: 5.2, 8.3_
  

  - [x] 2.2 Create Spotlight component (aceternity variant)

    - Implement in src/components/ui/spotlight.tsx
    - SVG-based spotlight with animation
    - Configurable fill color and positioning
    - _Requirements: 2.4_
  

  - [x] 2.3 Create interactive Spotlight component (ibelick variant)

    - Implement mouse-tracking spotlight with framer-motion springs
    - Use useSpring for smooth mouse following
    - Radial gradient that follows cursor position
    - _Requirements: 2.4, 3.2_
  
  - [x] 2.4 Create SplineScene component


    - Implement in src/components/ui/splite.tsx
    - Wrap Spline component with Suspense for lazy loading
    - Add loading spinner fallback
    - Handle scene loading errors gracefully
    - _Requirements: 1.2, 6.1, 6.3_

- [x] 3. Extend type definitions




  - [x] 3.1 Add persona-related types to src/types.ts

    - Add PERSONA to AppView enum
    - Define PersonaArchetype interface
    - Define PersonaTrait interface
    - Define PersonaEvolution interface
    - Define UserPersona interface
    - _Requirements: 1.5, 4.1, 7.1_
  
  - [ ]* 3.2 Write property test for type completeness
    - **Feature: persona-showcase, Property 1: Persona calculation completeness**
    - Generate random session histories
    - Verify calculatePersona returns valid PersonaArchetype with all required fields
    - **Validates: Requirements 1.5**

- [x] 4. Create persona calculation service






  - [x] 4.1 Implement PersonaService class in src/services/personaService.ts

    - Create calculatePersona() method that analyzes session history
    - Implement metric averaging logic (confidence, vocabulary, clarity, etc.)
    - Create matchArchetype() method to determine archetype from metrics
    - Implement calculateEvolution() method for timeline tracking
    - Create getAllArchetypes() method returning predefined archetypes
    - _Requirements: 1.5, 7.1_

  

  - [x] 4.2 Define archetype constants

    - Create ARCHETYPE_DEFINITIONS array with 6-8 distinct archetypes
    - Each archetype includes: id, name, description, icon, traits, strengths, weaknesses, color
    - Cover spectrum: Analytical Strategist, Passionate Advocate, Diplomatic Mediator, Aggressive Challenger, Creative Innovator, Scholarly Expert
    - _Requirements: 4.1, 4.5_
  
  - [ ]* 4.3 Write property test for persona calculation
    - **Feature: persona-showcase, Property 1: Persona calculation completeness**
    - Use fast-check to generate random session histories (100+ iterations)
    - Verify all returned archetypes have required fields
    - Check that traits array is non-empty
    - **Validates: Requirements 1.5**

- [x] 5. Extend storage service




  - [x] 5.1 Add persona persistence to src/services/storageService.ts


    - Implement savePersona() function
    - Implement loadPersona() function
    - Use localStorage key 'debate_master_persona'
    - Handle JSON serialization/deserialization
    - _Requirements: 1.5_

- [ ] 6. Create GlassmorphicCard component


  - [x] 6.1 Implement GlassmorphicCard in src/components/GlassmorphicCard.tsx



    - Accept PersonaTrait as prop
    - Implement tilt effect calculation based on mouse position
    - Apply glassmorphism styling: backdrop-blur-xl, bg-white/5, border-white/10
    - Use framer-motion for hover scale animation
    - Integrate Spotlight component
    - Display trait name, value (animated counter), and description
    - _Requirements: 2.1, 2.3, 3.2, 3.5_
  
  - [ ]* 6.2 Write property test for tilt calculation
    - **Feature: persona-showcase, Property 2: Tilt calculation bounds**
    - Generate random mouse positions within various card dimensions
    - Verify tilt.x and tilt.y are always between -10 and +10 degrees
    - **Validates: Requirements 3.5**

- [x] 7. Create PersonaHero component







  - [x] 7.1 Implement PersonaHero in src/components/PersonaHero.tsx





    - Accept PersonaArchetype and PersonaTrait[] as props
    - Create split layout: content left, 3D scene right
    - Implement gradient text for main heading using bg-clip-text
    - Display archetype name in lime-400
    - Integrate SplineScene component with placeholder URL
    - Add Spotlight effect
    - Use framer-motion for entrance animations
    - _Requirements: 1.1, 1.2, 2.5, 3.1_

- [x] 8. Create PersonaDetails component




  - [x] 8.1 Implement PersonaDetails in src/components/PersonaDetails.tsx


    - Accept PersonaArchetype and PersonaTrait[] as props
    - Create responsive grid layout (3 cols desktop, 2 tablet, 1 mobile)
    - Map traits to GlassmorphicCard components
    - Implement staggered fade-in animations with framer-motion
    - Use lucide-react icons for trait categories
    - _Requirements: 2.2, 3.1, 4.1_
  
  - [ ]* 8.2 Write property test for archetype display
    - **Feature: persona-showcase, Property 3: Archetype display completeness**
    - Generate random PersonaArchetype objects with varying trait counts
    - Render PersonaDetails and verify name, description, all traits present
    - **Validates: Requirements 4.1**

- [x] 9. Create ArchetypeCard component




  - [x] 9.1 Implement ArchetypeCard in src/components/ArchetypeCard.tsx



    - Accept PersonaArchetype and isActive boolean as props
    - Display archetype icon, name, and short description
    - Apply hover effects: scale, glow with archetype color
    - Highlight active archetype with lime-400 border
    - Use framer-motion for interactions
    - _Requirements: 3.2, 4.3, 5.3_

- [x] 10. Create ArchetypeExplorer component





  - [x] 10.1 Implement ArchetypeExplorer in src/components/ArchetypeExplorer.tsx


    - Accept currentArchetype, allArchetypes, onSelectArchetype as props
    - Create responsive grid (4 cols desktop, 2 tablet, 1 mobile)
    - Map archetypes to ArchetypeCard components
    - Handle archetype selection with smooth transitions
    - _Requirements: 4.3, 4.4, 4.5_
  
  - [ ]* 10.2 Write property test for navigation availability
    - **Feature: persona-showcase, Property 4: Archetype navigation availability**
    - Generate random archetype arrays with length > 1
    - Verify navigation controls exist for each archetype
    - **Validates: Requirements 4.5**

- [x] 11. Create PersonaEvolution component





  - [x] 11.1 Implement PersonaEvolution in src/components/PersonaEvolution.tsx


    - Accept PersonaEvolution[] as prop
    - Create vertical timeline visualization
    - Display date, archetype name, and key trait changes for each entry
    - Implement scroll-triggered animations with useInView
    - Show milestones with badge components
    - Use lucide-react icons for achievements
    - _Requirements: 7.1, 7.2, 7.4_
  
  - [ ]* 11.2 Write property test for timeline completeness
    - **Feature: persona-showcase, Property 5: Evolution timeline completeness**
    - Generate random PersonaEvolution arrays
    - Verify timeline contains entry for each evolution record
    - **Validates: Requirements 7.1**
  

  - [x] 11.3 Implement trait comparison logic


    - Create helper function to compare trait values between evolution entries
    - Determine if trait increased, decreased, or stayed same
    - Return appropriate visual indicator (up arrow, down arrow, neutral)
    - _Requirements: 7.3_
  
  - [ ]* 11.4 Write property test for improvement indicators
    - **Feature: persona-showcase, Property 6: Improvement indicator correctness**
    - Generate pairs of PersonaEvolution entries with random trait values
    - Verify positive indicator shown when trait increased
    - Verify no positive indicator when trait decreased or unchanged
    - **Validates: Requirements 7.3**

- [x] 12. Create main PersonaShowcase component





  - [x] 12.1 Implement PersonaShowcase in src/components/PersonaShowcase.tsx


    - Accept onBack callback as prop
    - Manage local state: persona, loading, selectedArchetype
    - Load session history from storageService on mount
    - Calculate persona using PersonaService
    - Handle loading state with skeleton UI
    - Handle empty state (no sessions) with encouraging message
    - Compose PersonaHero, PersonaDetails, PersonaEvolution, ArchetypeExplorer
    - Implement back button navigation
    - _Requirements: 1.1, 1.4, 1.5, 7.5_

- [ ] 13. Integrate persona view into App.tsx
  - [x] 13.1 Add persona navigation to App.tsx





    - Import PersonaShowcase component with lazy loading
    - Add goToPersona() navigation function
    - Add persona button to sidebar navigation with UserCircle icon
    - Update getHeaderTitle() to include 'Persona' case
    - Add PersonaShowcase to view rendering logic
    - Apply fade-in animation on view mount
    - _Requirements: 1.1_

- [x] 14. Apply theme consistency




  - [x] 14.1 Verify color scheme across all persona components


    - Ensure void (#18181b) used for backgrounds
    - Ensure card (#1e1e21) used for card backgrounds
    - Ensure lime-400 (#a3e635) used for accents and highlights
    - Verify rounded-[2rem] applied to all cards
    - Check border-white/5 used for subtle borders
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 15. Implement responsive design




  - [x] 15.1 Add responsive breakpoints to all persona components


    - PersonaHero: stack layout on mobile, side-by-side on desktop
    - PersonaDetails: 1 col mobile, 2 cols tablet, 3 cols desktop
    - ArchetypeExplorer: 1 col mobile, 2 cols tablet, 4 cols desktop
    - PersonaEvolution: adjust timeline spacing for mobile
    - _Requirements: 6.2_
  
  - [x] 15.2 Optimize 3D scene for mobile




    - Detect device capabilities (RAM, GPU)
    - Show static fallback image on low-end devices
    - Reduce 3D scene height on mobile
    - Disable tilt effects on touch devices
    - _Requirements: 6.2_

- [x] 16. Add accessibility features







  - [x] 16.1 Implement keyboard navigation


    - Ensure all interactive elements are keyboard accessible
    - Add visible focus indicators
    - Implement arrow key navigation for archetype selection
    - Add Escape key handler for modals/overlays
    - _Requirements: 3.2_
  

  - [x] 16.2 Add ARIA labels and semantic HTML

    - Add role="region" to major sections
    - Add aria-label to buttons and interactive elements
    - Add aria-valuenow/min/max to progress bars
    - Use proper heading hierarchy (h1, h2, h3)
    - Use semantic elements: nav, article, section
    - _Requirements: 2.1, 4.1_
  

  - [x] 16.3 Implement reduced motion support

    - Detect prefers-reduced-motion media query
    - Disable animations when user prefers reduced motion
    - Provide static alternatives for animated content
    - _Requirements: 3.1, 3.3_

- [x] 17. Add error handling






  - [x] 17.1 Implement error boundaries

    - Create PersonaErrorFallback component
    - Wrap PersonaShowcase in ErrorBoundary
    - Handle Spline loading errors gracefully
    - Provide fallback for calculation errors
    - _Requirements: 1.4_
  
  - [x] 17.2 Add data validation


    - Validate session history data before calculation
    - Validate archetype objects before rendering
    - Handle missing or malformed data gracefully
    - Display appropriate error messages
    - _Requirements: 1.5_

- [x] 18. Performance optimization







  - [x] 18.1 Implement memoization




    - Memoize persona calculation with useMemo
    - Memoize callbacks with useCallback
    - Memoize expensive renders with React.memo
    - _Requirements: 6.4_
  
  - [x] 18.2 Optimize animations


    - Use transform and opacity for GPU acceleration
    - Avoid animating layout properties
    - Implement will-change CSS property where needed
    - _Requirements: 6.4_
  
  - [x] 18.3 Add cleanup for memory management


    - Remove event listeners in useEffect cleanup
    - Cancel animations on unmount
    - Clear timeouts and intervals
    - _Requirements: 6.4_

- [x] 19. Create Spline 3D scene





  - [x] 19.1 Design and export 3D scene

    - Create robot/character model in Spline editor
    - Configure mouse tracking behavior
    - Set dark background matching void color
    - Optimize for web performance (< 5MB)
    - Export scene and obtain public URL
    - Update PersonaHero with actual scene URL
    - _Requirements: 1.2, 1.3_

- [ ] 20. Final integration testing
  - Ensure all tests pass, ask the user if questions arise
  - Test complete user flow: Dashboard → Persona → Explore archetypes → View evolution → Back
  - Verify persona calculation with real session data
  - Test responsive behavior on various screen sizes
  - Verify animations and interactions work smoothly
  - Check accessibility with keyboard navigation and screen reader
  - Test error scenarios (no data, loading failures)
  - Verify theme consistency across all components
  - _Requirements: All_
