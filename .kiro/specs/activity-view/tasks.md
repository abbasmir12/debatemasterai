# Implementation Plan

- [x] 1. Create Activity component structure and navigation integration






  - Create `src/components/Activity.tsx` with basic component structure
  - Add `ACTIVITY` to `AppView` enum in `src/types.ts`
  - Update `App.tsx` to handle Activity view navigation
  - Wire Activity button in sidebar to navigate to Activity view
  - Implement view highlighting for active Activity button
  - _Requirements: 1.1, 1.5_

- [x] 2. Implement data loading and time filtering logic






  - [x] 2.1 Create data loading and state management

    - Load session history from localStorage using `getHistory()`
    - Set up state for sessions, timeFilter, and filteredSessions
    - Implement empty state detection and rendering
    - _Requirements: 1.2, 1.3_


  - [x] 2.2 Implement time filter functionality





    - Create time filter UI with 7d, 30d, 90d, and all-time options
    - Implement filter logic to compute filteredSessions based on selected period
    - Add visual indication of active filter
    - Handle empty filtered results with appropriate messaging
    - _Requirements: 4.1, 4.3, 4.5_

  - [ ]* 2.3 Write property test for time filter consistency
    - **Property 2: Time filter consistency across components**
    - **Validates: Requirements 4.2**

- [x] 3. Implement statistics calculation and display






  - [x] 3.1 Create statistics calculation utilities

    - Implement function to calculate total sessions count
    - Implement function to calculate total practice time from durations
    - Implement function to calculate average score
    - Implement function to calculate current streak from session dates
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ]* 3.2 Write property test for total practice time calculation
    - **Property 3: Total practice time calculation accuracy**
    - **Validates: Requirements 5.2**

  - [ ]* 3.3 Write property test for average score calculation
    - **Property 4: Average score calculation accuracy**
    - **Validates: Requirements 5.3**

  - [ ]* 3.4 Write property test for streak calculation
    - **Property 5: Current streak calculation correctness**
    - **Validates: Requirements 5.4**

  - [x] 3.5 Create StatCard component


    - Build reusable StatCard component with icon, title, value, and optional trend
    - Support color variants (lime, indigo, emerald, amber)
    - Apply dark theme styling with lime-400 accents
    - _Requirements: 5.5_

  - [x] 3.6 Create StatisticsGrid section


    - Render grid of StatCards for total sessions, total time, average score, and current streak
    - Pass calculated statistics to StatCards
    - Implement responsive grid layout
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 4. Implement chart visualizations





  - [x] 4.1 Install and configure Recharts library


    - Add Recharts dependency to package.json
    - Create chart utility functions for data transformation
    - _Requirements: 2.1, 2.3_

  - [x] 4.2 Create ScoreTrendChart component


    - Build line chart component using Recharts
    - Transform session data to chart data points
    - Implement tooltip with session details
    - Style with lime-400 line color and dark theme
    - Handle insufficient data case with message
    - _Requirements: 2.1, 2.2, 2.4, 2.5_

  - [ ]* 4.3 Write property test for chart data integrity
    - **Property 1: Session data integrity across all visualizations**
    - **Validates: Requirements 1.2, 2.2, 3.2**

  - [x] 4.4 Create DurationDistributionChart component


    - Build bar chart component using Recharts
    - Group sessions into duration ranges (0-5, 5-10, 10-15 min)
    - Implement tooltip with count details
    - Style with lime-400 bars and dark theme
    - _Requirements: 2.3_

  - [x] 4.5 Create ChartsSection container


    - Create container component for all charts
    - Arrange charts in responsive grid layout
    - Pass filtered sessions to each chart
    - _Requirements: 2.1, 2.3_

- [x] 5. Implement activity heat map





  - [x] 5.1 Create ActivityHeatMap component


    - Build calendar grid using CSS Grid (7 columns for days)
    - Calculate date range to display (last 12 weeks or custom range)
    - Generate cells for each date in range
    - _Requirements: 3.1_

  - [x] 5.2 Implement heat map intensity calculation

    - Count sessions per date from filtered sessions
    - Calculate intensity level (0-4 scale) based on session count
    - Apply color gradient from slate-800 to lime-400 based on intensity
    - _Requirements: 3.2, 3.3, 3.4_

  - [ ]* 5.3 Write property test for heat map intensity
    - **Property 6: Heat map intensity proportionality**
    - **Validates: Requirements 3.3**

  - [x] 5.4 Add heat map interactivity

    - Implement hover tooltip showing date and session count
    - Add smooth hover transitions
    - _Requirements: 3.5_

- [x] 6. Implement session history list






  - [x] 6.1 Create SessionListItem component

    - Build collapsible session item component
    - Display topic, date, duration, and score
    - Implement expand/collapse functionality
    - Show additional details when expanded
    - _Requirements: 6.2, 6.4_

  - [ ]* 6.2 Write property test for session display completeness
    - **Property 8: Session display completeness**
    - **Validates: Requirements 6.2, 7.2**


  - [x] 6.3 Create SessionHistoryList component

    - Render list of SessionListItem components
    - Sort sessions by date descending
    - Implement pagination or infinite scroll for >10 items
    - Handle empty state with encouraging message
    - _Requirements: 6.1, 6.3, 6.5_

  - [ ]* 6.4 Write property test for session list sorting
    - **Property 7: Session list sorting correctness**
    - **Validates: Requirements 6.1**

- [x] 7. Implement top performers section




  - [x] 7.1 Create top performers identification logic


    - Implement function to identify top 3 highest-scoring sessions
    - Handle tie-breaking by prioritizing more recent sessions
    - Handle cases with fewer than 3 sessions
    - _Requirements: 7.1, 7.4, 7.5_

  - [ ]* 7.2 Write property test for top performers ranking
    - **Property 9: Top performers ranking with tie-breaking**
    - **Validates: Requirements 7.1, 7.5**

  - [x] 7.3 Create TopPerformersSection component


    - Render top 3 sessions with visual emphasis
    - Display topic, score, and date for each
    - Apply special styling (borders, background colors)
    - _Requirements: 7.2, 7.3_

- [x] 8. Implement responsive design and polish






  - [x] 8.1 Add responsive layout adjustments

    - Implement single-column layout for mobile (<768px)
    - Adjust chart sizing for mobile readability
    - Adjust heat map cell sizes for touch interaction
    - Stack statistics cards vertically on mobile
    - _Requirements: 8.1, 8.2, 8.3, 8.4_


  - [x] 8.2 Add animations and transitions

    - Implement fadeIn animation for Activity view
    - Add smooth transitions for filter changes
    - Add hover effects for interactive elements
    - Add staggered entry animations for charts
    - _Requirements: 4.4_

  - [x] 8.3 Final styling and theme consistency


    - Ensure all components use dark theme (void, card backgrounds)
    - Apply lime-400 accents consistently
    - Use rounded-[2rem] for cards
    - Verify typography hierarchy and spacing
    - _Requirements: 1.4_

- [ ] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
