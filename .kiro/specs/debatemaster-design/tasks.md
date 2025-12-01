# Implementation Plan

- [x] 1. Set up project structure and dependencies





  - Initialize Vite + React + TypeScript project
  - Install dependencies: @google/genai, react, react-dom
  - Configure TypeScript with strict mode
  - Set up Tailwind CSS with custom color configuration
  - Create folder structure: components/, services/, utils/
  - _Requirements: 13.1, 13.2, 13.6_

- [x] 2. Implement core type definitions





  - Create types.ts with all interfaces and enums
  - Define ChatMessage, UserStats, SessionHistoryItem, DebateAnalysis interfaces
  - Define AppView and DebateStyle enums
  - Define AudioConfig interface
  - _Requirements: All (foundational)_

- [x] 3. Implement audio utility functions





  - Create utils/audioUtils.ts
  - Implement createBlob() for PCM encoding
  - Implement decode() for base64 decoding
  - Implement decodeAudioData() for audio buffer creation
  - Define INPUT_SAMPLE_RATE and OUTPUT_SAMPLE_RATE constants
  - _Requirements: 3.4, 3.6, 3.7_

- [ ]* 3.1 Write property test for audio encoding/decoding
  - **Property 10: Audio encoding/decoding round-trip**
  - **Validates: Requirements 3.7**

- [x] 4. Implement storage service




  - Create services/storageService.ts
  - Implement getStats() with default fallback
  - Implement getHistory() with empty array fallback
  - Implement saveSession() with stats calculation and badge logic
  - Define storage keys as constants
  - _Requirements: 1.4, 1.5, 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ]* 4.1 Write property test for data persistence round-trip
  - **Property 3: Data persistence round-trip consistency**
  - **Validates: Requirements 1.4, 1.5, 14.6, 14.7**

- [ ]* 4.2 Write property test for statistics calculation
  - **Property 28: Session completion updates statistics correctly**
  - **Validates: Requirements 14.1, 14.2, 14.3**

- [ ]* 4.3 Write property test for history item creation
  - **Property 29: Session completion creates history item**
  - **Validates: Requirements 14.4**

- [ ]* 4.4 Write property test for badge awards
  - **Property 30: Badge awards at milestones**
  - **Validates: Requirements 14.5**

- [x] 5. Implement Gemini Live service core structure





  - Create services/geminiLiveService.ts
  - Define GeminiLiveService class with constructor
  - Set up callback properties (onTranscript, onStatusChange, onAudioLevel, onError)
  - Initialize GoogleGenAI client
  - Define private properties for audio contexts and processing nodes
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 6. Implement Gemini Live service connection logic





  - Implement connect() method with microphone access
  - Create input and output AudioContexts with correct sample rates
  - Configure Gemini Live session with system instructions
  - Implement handleOpen() for audio pipeline setup
  - Set up ScriptProcessorNode for audio capture
  - Implement RMS audio level calculation
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 5.1_

- [ ]* 6.1 Write property test for audio context sample rates
  - **Property 9: Audio contexts use correct sample rates**
  - **Validates: Requirements 3.4, 3.6**

- [ ]* 6.2 Write property test for RMS calculation
  - **Property 14: RMS audio level calculation correctness**
  - **Validates: Requirements 5.1**

- [x] 7. Implement Gemini Live service message handling





  - Implement handleMessage() for processing server messages
  - Handle audio output decoding and playback scheduling
  - Handle transcription updates (interim and final)
  - Handle interruption events
  - Manage audio source cleanup
  - _Requirements: 3.6, 3.7, 4.1, 4.2, 4.3, 4.4_

- [x] 8. Implement debate style configuration




  - Add system instruction generation based on DebateStyle
  - Configure Coach mode with constructive instructions and "Puck" voice
  - Configure Fierce mode with aggressive instructions and "Fenrir" voice
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ]* 8.1 Write property test for Coach mode configuration
  - **Property 18: Coach mode configuration correctness**
  - **Validates: Requirements 6.1, 6.2**

- [ ]* 8.2 Write property test for Fierce mode configuration
  - **Property 19: Fierce mode configuration correctness**
  - **Validates: Requirements 6.3, 6.4, 6.5**

- [x] 9. Implement analysis generation





  - Implement analyzeDebate() method in GeminiLiveService
  - Format transcript from ChatMessage array
  - Configure Gemini with JSON schema for structured output
  - Parse and return DebateAnalysis object
  - Implement fallback analysis for error cases
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 9.10, 9.11, 9.12, 9.13, 9.14, 11.5_

- [ ]* 9.1 Write property test for transcript formatting
  - **Property 22: Analysis transcript includes all conversation messages**
  - **Validates: Requirements 9.1**

- [ ]* 9.2 Write property test for analysis structure
  - **Property 23: Analysis structure completeness**
  - **Validates: Requirements 9.3-9.14**

- [x] 10. Implement service disconnect and cleanup




  - Implement disconnect() method
  - Stop audio processing nodes
  - Close audio contexts safely
  - Clean up audio sources
  - Update connection status
  - _Requirements: 8.2, 8.3, 8.4_

- [x] 11. Implement AudioVisualizer component





  - Create components/AudioVisualizer.tsx
  - Accept level and isActive props
  - Render 5 vertical bars
  - Calculate dynamic heights based on audio level
  - Apply sine wave variation for visual interest
  - Style with indigo-400 color and transitions
  - _Requirements: 5.2, 5.3, 5.4, 5.5_

- [ ]* 11.1 Write property test for visualizer bar count
  - **Property 16: Visualizer bar count is constant**
  - **Validates: Requirements 5.5**

- [ ]* 11.2 Write property test for visualizer animation state
  - **Property 17: Visualizer animation matches connection state**
  - **Validates: Requirements 5.3, 5.4**

- [x] 12. Implement Dashboard component structure





  - Create components/Dashboard.tsx
  - Define DashboardProps interface
  - Set up component state (stats, history, topic, selectedStyle, duration)
  - Load stats and history on mount using storage service
  - Create 3-column responsive grid layout
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 13. Implement Dashboard statistics cards





  - Create Total Score card with lime-400 background
  - Display points, sessions, and win rate
  - Add decorative circular elements
  - Create ROI card with mock chart
  - Create Fluency Rate card with bar chart
  - Apply proper styling and spacing
  - _Requirements: 1.2, 13.1, 13.2, 13.3_

- [ ]* 13.1 Write property test for statistics display
  - **Property 1: Dashboard displays all required statistics**
  - **Validates: Requirements 1.2**

- [x] 14. Implement Dashboard session start form




  - Create center card with form inputs
  - Add topic text input with validation
  - Add style toggle buttons (Coach/Fierce)
  - Add duration range slider with display
  - Add start debate button with disabled state
  - Wire up form state and callbacks
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ]* 14.1 Write property test for start button state
  - **Property 4: Start button enabled state matches topic validity**
  - **Validates: Requirements 2.1, 2.2**

- [ ]* 14.2 Write property test for style selection
  - **Property 5: Selected style reflects in UI state**
  - **Validates: Requirements 2.3**

- [ ]* 14.3 Write property test for duration display
  - **Property 6: Duration display matches slider value**
  - **Validates: Requirements 2.4**

- [ ]* 14.4 Write property test for view transition
  - **Property 7: View transition preserves parameters**
  - **Validates: Requirements 2.5**

- [x] 15. Implement Dashboard history card




  - Create history card with slate-200 background
  - Display "Recent" and "Saved" tabs
  - Render list of recent sessions (limit to 5)
  - Show score, topic, and metadata for each session
  - Add custom scrollbar styling
  - Handle empty state
  - _Requirements: 1.3_

- [ ]* 15.1 Write property test for history display limit
  - **Property 2: History display limits to five most recent sessions**
  - **Validates: Requirements 1.3**

- [x] 16. Implement Dashboard remaining cards




  - Create Persona card with background image and CTA
  - Add proper image overlays and gradients
  - Ensure responsive behavior
  - Add hover effects and transitions
  - _Requirements: 13.3, 13.7_

- [x] 17. Implement DebateLive component structure




  - Create components/DebateLive.tsx
  - Define DebateLiveProps interface
  - Set up component state (isConnected, messages, audioLevel, elapsedSeconds, errorMsg, isAnalyzing)
  - Create refs for service, messages end, and messages array
  - _Requirements: 3.1, 3.2, 4.1, 5.1, 7.1_

- [x] 18. Implement DebateLive connection lifecycle





  - Initialize GeminiLiveService on mount
  - Request microphone access
  - Connect to Gemini Live API
  - Set up message callback to update state
  - Set up status callback for connection indicator
  - Set up audio level callback for visualizer
  - Set up error callback for error display
  - Clean up on unmount
  - _Requirements: 3.1, 3.2, 3.3, 11.1, 11.2_

- [ ]* 18.1 Write property test for connection state UI
  - **Property 8: Connection state reflects in UI indicators**
  - **Validates: Requirements 3.3**

- [x] 19. Implement DebateLive timer functionality




  - Set up interval timer on connection
  - Increment elapsed seconds every second
  - Implement formatTime() for MM:SS display
  - Auto-stop session when duration reached
  - Clear interval on unmount or stop
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ]* 19.1 Write property test for timer countdown
  - **Property 20: Timer countdown decrements correctly**
  - **Validates: Requirements 7.2**

- [ ]* 19.2 Write property test for timer formatting
  - **Property 21: Timer format follows MM:SS pattern**
  - **Validates: Requirements 7.3**

- [x] 20. Implement DebateLive message display





  - Render messages array in scrollable container
  - Style user messages with lime background, right alignment
  - Style AI messages with dark background, left alignment
  - Style system messages as centered labels
  - Show interim indicator for non-final messages
  - Auto-scroll to latest message
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [ ]* 20.1 Write property test for interim message display
  - **Property 11: Interim transcriptions create non-final messages**
  - **Validates: Requirements 4.1, 4.3**

- [ ]* 20.2 Write property test for final message marking
  - **Property 12: Final transcriptions mark messages as complete**
  - **Validates: Requirements 4.2, 4.4**

- [ ]* 20.3 Write property test for message styling
  - **Property 13: Message rendering matches role styling**
  - **Validates: Requirements 4.6, 4.7**

- [x] 21. Implement DebateLive header and controls





  - Create header with topic, timer, and exit button
  - Style with backdrop blur and borders
  - Create footer with AudioVisualizer and end button
  - Wire up end session handler
  - Implement handleStop() to trigger analysis
  - _Requirements: 7.3, 8.1, 8.5_

- [ ]* 21.1 Write property test for audio level updates
  - **Property 15: Audio level updates visualizer**
  - **Validates: Requirements 5.2**

- [x] 22. Implement DebateLive loading and error states





  - Create loading screen for analysis generation
  - Show spinning icon and "Generating Report" message
  - Display error messages when they occur
  - Style error messages with red theme
  - _Requirements: 11.2, 11.3, 11.4, 15.1, 15.2, 15.3, 15.4_

- [x] 23. Implement SessionSummary component structure





  - Create components/SessionSummary.tsx
  - Define SessionSummaryProps interface
  - Create MetricBar sub-component for progress bars
  - Set up grid layout for analysis display
  - _Requirements: 10.1_

- [x] 24. Implement SessionSummary score and archetype cards





  - Create large score card with lime-400 background
  - Display overall score and confidence level
  - Create archetype card with background image
  - Display archetype name and wildcard insight
  - Add decorative elements and overlays
  - _Requirements: 10.2, 10.3_

- [x] 25. Implement SessionSummary metrics display




  - Create Linguistics card with vocabulary and clarity metrics
  - Create Strategy card with argument, persuasion, and adaptability metrics
  - Render MetricBar components for each score
  - Display proficiency level badge
  - Style with proper colors and spacing
  - _Requirements: 10.4_

- [ ]* 25.1 Write property test for progress bar width
  - **Property 24: Metric progress bar width proportional to score**
  - **Validates: Requirements 10.4**

- [x] 26. Implement SessionSummary feedback lists




  - Create Strengths card with checkmark icons
  - Create Suggestions card with arrow icons
  - Render lists from analysis data
  - Style with emerald and amber themes
  - Add return to dashboard button
  - _Requirements: 10.5, 10.6, 10.7_

- [ ]* 26.1 Write property test for strength icons
  - **Property 25: Strength items include checkmark icons**
  - **Validates: Requirements 10.5**

- [ ]* 26.2 Write property test for suggestion icons
  - **Property 26: Suggestion items include arrow icons**
  - **Validates: Requirements 10.6**

- [x] 27. Implement App component structure




  - Create App.tsx as root component
  - Set up global state (currentView, currentTopic, currentStyle, currentDuration, lastAnalysis)
  - Implement API key validation
  - Create error screen for missing API key
  - _Requirements: 11.1_

- [x] 28. Implement App navigation and view routing







  - Implement startDebate() to transition to Live Arena
  - Implement handleAnalysisComplete() to store analysis and show Summary
  - Implement goBackToDashboard() to reset state
  - Render appropriate view based on currentView state
  - _Requirements: 12.1, 12.2, 12.3_

- [ ]* 28.1 Write property test for header title
  - **Property 27: Header title matches current view**
  - **Validates: Requirements 12.4**

- [x] 29. Implement App sidebar and header





  - Create sidebar with logo, user profile, and navigation
  - Add navigation icons and buttons
  - Create header with search, upgrade, and notifications
  - Implement dark mode toggle (visual only)
  - Apply responsive hiding for mobile
  - _Requirements: 12.5, 13.4_

- [x] 30. Implement global styling and theme





  - Create index.html with root element
  - Create index.tsx with React root rendering
  - Add Tailwind CSS configuration with custom colors
  - Define custom CSS classes for scrollbars and patterns
  - Apply dark theme globally
  - _Requirements: 13.1, 13.2, 13.3, 13.6, 13.7_

- [x] 31. Implement environment configuration







  - Create .env.local template
  - Add API key configuration for Vite
  - Update vite.config.ts with React plugin
  - Configure TypeScript for strict mode
  - _Requirements: 11.1_

- [x] 32. Final integration and polish





  - Test complete user flow from Dashboard to Live to Summary
  - Verify all view transitions work correctly
  - Ensure data persistence across page reloads
  - Test error handling scenarios
  - Verify responsive behavior on different screen sizes
  - Polish animations and transitions
  - _Requirements: All_

- [ ] 33. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
