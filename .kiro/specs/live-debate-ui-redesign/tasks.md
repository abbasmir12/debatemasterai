# Implementation Plan

- [x] 1. Create VoiceVisualizer component with WebGL rendering





  - Create new file `src/components/VoiceVisualizer.tsx`
  - Implement WebGL context initialization
  - Create vertex and fragment shaders for circular wave pattern
  - Implement shader compilation and program linking
  - Add uniform handling for time, audioLevel, and colors
  - Implement animation loop with requestAnimationFrame
  - Add proper cleanup and resource disposal
  - _Requirements: 1.1, 1.2, 1.3, 6.1, 6.2, 6.3_

- [ ]* 1.1 Write property test for audio level responsiveness
  - **Property 1: Audio level responsiveness**
  - **Validates: Requirements 1.2, 1.3**

- [x] 2. Add Canvas 2D fallback renderer





  - Create fallback renderer class for browsers without WebGL
  - Implement circular gradient visualization using Canvas 2D
  - Add WebGL detection and automatic fallback logic
  - Test fallback behavior when WebGL is unavailable
  - _Requirements: 6.4_

- [x] 3. Implement gradient background lighting





  - Add gradient background div with blur effect
  - Implement color scheme transitions based on speaker
  - Add smooth color interpolation over 500ms
  - Create COLOR_SCHEMES constant with user/model/idle colors
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ]* 3.1 Write property test for speaker-to-color mapping
  - **Property 7: Speaker-to-color mapping**
  - **Validates: Requirements 2.3, 2.4, 2.5, 5.1, 5.2, 5.4**

- [x] 4. Create CascadingTranscript component





  - Create new file `src/components/CascadingTranscript.tsx`
  - Implement getDisplayLines function to extract last 3 messages
  - Apply progressive opacity (100%, 60%, 30%)
  - Apply progressive width (100%, 85%, 70%)
  - Add CSS transitions for smooth line movements
  - _Requirements: 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 4.5_

- [ ]* 4.1 Write property test for cascading line progression
  - **Property 2: Cascading line progression**
  - **Validates: Requirements 3.2, 3.3**

- [ ]* 4.2 Write property test for maximum three lines
  - **Property 3: Maximum three lines displayed**
  - **Validates: Requirements 3.4**

- [x] 5. Implement text truncation logic





  - Create truncateText utility function
  - Use canvas measureText for accurate width calculation
  - Implement binary search for optimal truncation point
  - Add ellipsis to truncated text
  - _Requirements: 4.4_

- [ ]* 5.1 Write property test for text truncation
  - **Property 5: Text truncation with ellipsis**
  - **Validates: Requirements 4.4**

- [x] 6. Add speaker change detection and line clearing





  - Implement getActiveSpeaker utility function
  - Detect speaker changes in CascadingTranscript
  - Clear all lines with fade-out animation when speaker changes
  - Reset line state for new speaker
  - _Requirements: 3.5_

- [ ]* 6.1 Write property test for speaker change clearing
  - **Property 4: Speaker change clears transcript**
  - **Validates: Requirements 3.5**

- [x] 7. Integrate new components into DebateLive





  - Import VoiceVisualizer and CascadingTranscript
  - Replace existing message container with new components
  - Derive activeSpeaker from messages state
  - Pass audioLevel, isActive, and activeSpeaker props
  - Preserve existing header and footer
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 8. Add mobile responsive styling





  - Add media queries for mobile devices
  - Scale VoiceVisualizer appropriately on small screens
  - Adjust font sizes for CascadingTranscript on mobile
  - Test on various screen sizes
  - _Requirements: 7.1, 7.2, 7.3_

- [ ]* 8.1 Write property test for consistent width percentages
  - **Property 6: Line width percentages remain consistent**
  - **Validates: Requirements 7.3**

- [x] 9. Add accessibility features





  - Add ARIA labels to VoiceVisualizer canvas
  - Add ARIA live region to CascadingTranscript
  - Implement reduced motion support
  - Test with screen readers

- [x] 10. Performance optimization





  - Memoize VoiceVisualizer component
  - Memoize CascadingTranscript component
  - Optimize WebGL uniform updates
  - Add performance monitoring

- [ ]* 11. Integration testing
  - Test VoiceVisualizer with varying audio levels
  - Test CascadingTranscript with message sequences
  - Test speaker transitions
  - Test error handling preservation
  - Test on multiple browsers

- [ ] 12. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
