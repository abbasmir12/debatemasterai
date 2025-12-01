# Requirements Document

## Introduction

This document specifies the requirements for redesigning the visual interface of the DebateMaster AI live debate screen. The current implementation functions correctly for voice interaction and transcription, but the visual presentation is minimal and lacks engagement. This redesign will transform the interface with an interactive WebGL voice visualization component and a cascading transcript display system, creating a visually stunning and immersive debate experience.

## Glossary

- **System**: The DebateMaster AI live debate interface (DebateLive component)
- **Voice Visualizer**: An interactive WebGL-based visual component that animates in response to audio input
- **Cascading Transcript**: A transcript display where text appears in progressively fading and shortening lines
- **Active Speaker**: The participant (user or AI) currently producing audio
- **Turn**: A continuous speech segment by a single speaker
- **Audio Level**: The amplitude of audio input, ranging from 0-100
- **WebGL**: Web Graphics Library for rendering interactive graphics

## Requirements

### Requirement 1

**User Story:** As a user, I want to see a dynamic voice visualization in the center of the debate screen, so that the interface feels alive and responsive to the conversation.

#### Acceptance Criteria

1. WHEN the debate screen loads THEN the System SHALL display a WebGL-based voice visualizer in the center area
2. WHEN audio input is detected THEN the Voice Visualizer SHALL animate based on the Audio Level
3. WHEN the Audio Level increases THEN the Voice Visualizer SHALL expand or intensify proportionally
4. WHEN no audio is detected THEN the Voice Visualizer SHALL display a subtle idle animation
5. WHEN the component renders THEN the Voice Visualizer SHALL use circular or wave-based visual patterns

### Requirement 2

**User Story:** As a user, I want gradient background lighting behind the voice visualizer, so that the visual experience matches the aesthetic shown in the reference images.

#### Acceptance Criteria

1. WHEN the Voice Visualizer renders THEN the System SHALL display gradient background lighting effects
2. WHEN audio input is detected THEN the gradient SHALL pulse or shift based on the Audio Level
3. WHEN the user is speaking THEN the gradient SHALL use lime/green color tones
4. WHEN the AI is speaking THEN the gradient SHALL use purple/blue color tones
5. WHEN no one is speaking THEN the gradient SHALL use neutral gray/white tones

### Requirement 3

**User Story:** As a user, I want transcripts to appear below the voice visualizer with a cascading fade effect, so that I can read recent dialogue in a visually elegant way.

#### Acceptance Criteria

1. WHEN a speaker produces text THEN the System SHALL display it as the first line below the Voice Visualizer at full opacity
2. WHEN new text appears THEN the previous line SHALL move down to become the second line with reduced opacity and shorter width
3. WHEN the second line is pushed down THEN it SHALL become the third line with further reduced opacity and width
4. WHEN a fourth line would appear THEN the System SHALL remove the third line
5. WHEN the Active Speaker changes THEN the System SHALL clear all existing lines and start fresh

### Requirement 4

**User Story:** As a user, I want each transcript line to progressively fade and shorten, so that my attention is naturally drawn to the most recent text.

#### Acceptance Criteria

1. WHEN the first line is displayed THEN the System SHALL render it at 100% opacity and full width
2. WHEN the second line is displayed THEN the System SHALL render it at 60% opacity and 85% width
3. WHEN the third line is displayed THEN the System SHALL render it at 30% opacity and 70% width
4. WHEN text exceeds the line width THEN the System SHALL truncate it with an ellipsis
5. WHEN lines transition THEN the System SHALL animate opacity and width changes over 300 milliseconds

### Requirement 5

**User Story:** As a user, I want the voice visualizer to differentiate between my voice and the AI's voice visually, so that I can easily see who is speaking.

#### Acceptance Criteria

1. WHEN the user is speaking THEN the Voice Visualizer SHALL use lime/green color schemes
2. WHEN the AI is speaking THEN the Voice Visualizer SHALL use purple/blue color schemes
3. WHEN the Active Speaker changes THEN the Voice Visualizer SHALL transition colors over 500 milliseconds
4. WHEN both are silent THEN the Voice Visualizer SHALL use neutral colors

### Requirement 6

**User Story:** As a developer, I want the voice visualizer to use WebGL for performance, so that animations remain smooth even with complex visual effects.

#### Acceptance Criteria

1. WHEN the Voice Visualizer initializes THEN the System SHALL create a WebGL rendering context
2. WHEN rendering frames THEN the System SHALL use WebGL shaders for visual effects
3. WHEN the component unmounts THEN the System SHALL dispose of WebGL resources properly
4. WHEN WebGL is unavailable THEN the System SHALL fall back to Canvas 2D or CSS animations

### Requirement 7

**User Story:** As a user, I want the redesigned interface to work well on mobile devices, so that the experience is consistent across all screen sizes.

#### Acceptance Criteria

1. WHEN viewed on mobile THEN the Voice Visualizer SHALL scale to fit the screen appropriately
2. WHEN viewed on mobile THEN the Cascading Transcript SHALL use proportional font sizes
3. WHEN viewed on mobile THEN the line width percentages SHALL remain consistent
4. WHEN device orientation changes THEN the System SHALL re-layout components smoothly

### Requirement 8

**User Story:** As a user, I want the existing header and footer controls to remain functional, so that the redesign enhances rather than replaces the working interface.

#### Acceptance Criteria

1. WHEN the redesigned interface loads THEN the System SHALL preserve the existing header with topic, timer, and exit button
2. WHEN the redesigned interface loads THEN the System SHALL preserve the existing footer with end session button
3. WHEN the Voice Visualizer and Cascading Transcript are displayed THEN they SHALL occupy the main content area between header and footer
4. WHEN errors occur THEN the System SHALL continue to display error messages as currently implemented
