# Requirements Document

## Introduction

DebateMaster AI is a real-time AI debate coaching application that enables users to practice debating skills through voice interaction with an AI opponent powered by Google's Gemini Live API. The system listens to user arguments via microphone, provides real-time audio counter-arguments, analyzes rhetorical performance, and presents comprehensive feedback through an elegant dashboard interface. The application supports two debate modes (Coach and Fierce), tracks user statistics, maintains session history, and provides detailed post-debate analysis including linguistic metrics, strategic assessment, and personalized improvement suggestions.

## Glossary

- **System**: The DebateMaster AI web application
- **User**: A person using the application to practice debate skills
- **Gemini Live API**: Google's real-time audio AI service that powers voice interactions
- **Session**: A single debate interaction between the User and the AI with a defined topic and duration
- **Dashboard**: The main interface view displaying statistics, session controls, and history
- **Live Arena**: The active debate interface where real-time voice interaction occurs
- **Analysis Report**: Post-session feedback displaying performance metrics and insights
- **Coach Mode**: A supportive debate style where the AI provides constructive feedback
- **Fierce Mode**: An aggressive debate style where the AI acts as a hostile opponent
- **Archetype**: A creative personality label assigned to the User based on debate style
- **Audio Visualizer**: A visual component displaying real-time audio input levels
- **Transcript**: The text representation of spoken conversation during a Session

## Requirements

### Requirement 1

**User Story:** As a user, I want to view my debate statistics and performance history on a dashboard, so that I can track my progress over time.

#### Acceptance Criteria

1. WHEN the User opens the application THEN the System SHALL display the Dashboard view with statistics cards
2. WHEN displaying statistics THEN the System SHALL show total score, total sessions, total minutes, and win rate
3. WHEN displaying history THEN the System SHALL show the five most recent sessions with topic, score, and date
4. THE System SHALL persist user statistics to browser local storage
5. THE System SHALL persist session history to browser local storage

### Requirement 2

**User Story:** As a user, I want to start a new debate session with customizable parameters, so that I can practice on topics that interest me.

#### Acceptance Criteria

1. WHEN the User enters a debate topic THEN the System SHALL enable the start debate button
2. WHEN the User attempts to start without a topic THEN the System SHALL keep the start button disabled
3. WHEN the User selects a debate style THEN the System SHALL highlight the selected style (Coach or Fierce)
4. WHEN the User adjusts the duration slider THEN the System SHALL display the selected duration in minutes
5. WHEN the User clicks start debate THEN the System SHALL transition to the Live Arena view with the specified parameters

### Requirement 3

**User Story:** As a user, I want to engage in real-time voice debate with an AI opponent, so that I can practice my argumentation skills naturally.

#### Acceptance Criteria

1. WHEN the Live Arena loads THEN the System SHALL request microphone permission from the browser
2. WHEN microphone access is granted THEN the System SHALL establish connection to Gemini Live API
3. WHEN connection is established THEN the System SHALL display a connected status indicator
4. WHEN the User speaks THEN the System SHALL capture audio input at 16000 Hz sample rate
5. WHEN the User speaks THEN the System SHALL stream audio data to Gemini Live API in real-time
6. WHEN the AI responds THEN the System SHALL play audio output at 24000 Hz sample rate
7. WHEN audio is playing THEN the System SHALL decode base64 audio data from the API response

### Requirement 4

**User Story:** As a user, I want to see transcriptions of the debate conversation, so that I can review what was said during the session.

#### Acceptance Criteria

1. WHEN the User speaks THEN the System SHALL display interim transcription text in real-time
2. WHEN the User finishes speaking THEN the System SHALL finalize the user transcription message
3. WHEN the AI responds THEN the System SHALL display interim AI transcription text in real-time
4. WHEN the AI finishes responding THEN the System SHALL finalize the AI transcription message
5. WHEN new messages appear THEN the System SHALL auto-scroll to the latest message
6. WHEN displaying user messages THEN the System SHALL show them in lime-colored bubbles aligned right
7. WHEN displaying AI messages THEN the System SHALL show them in dark bubbles with borders aligned left

### Requirement 5

**User Story:** As a user, I want visual feedback of audio activity, so that I know the system is capturing my voice.

#### Acceptance Criteria

1. WHEN audio input is detected THEN the System SHALL calculate the RMS audio level
2. WHEN audio level changes THEN the System SHALL update the Audio Visualizer component
3. WHEN the connection is active THEN the System SHALL display animated visualizer bars
4. WHEN the connection is inactive THEN the System SHALL display static visualizer bars at minimum height
5. THE System SHALL render five visualizer bars with heights proportional to audio level

### Requirement 6

**User Story:** As a user, I want the AI to behave differently based on the selected debate style, so that I can practice against various opponent types.

#### Acceptance Criteria

1. WHEN Coach Mode is selected THEN the System SHALL configure Gemini with constructive coaching instructions
2. WHEN Coach Mode is active THEN the System SHALL use the "Puck" voice configuration
3. WHEN Fierce Mode is selected THEN the System SHALL configure Gemini with aggressive opponent instructions
4. WHEN Fierce Mode is active THEN the System SHALL use the "Fenrir" voice configuration
5. WHEN Fierce Mode is active THEN the System SHALL instruct the AI to use strong language and interrupt frequently

### Requirement 7

**User Story:** As a user, I want the debate session to automatically end after the specified duration, so that I can practice time management.

#### Acceptance Criteria

1. WHEN the Live Arena starts THEN the System SHALL initialize a countdown timer
2. WHEN the connection is active THEN the System SHALL decrement the timer every second
3. WHEN the timer displays THEN the System SHALL show remaining time in MM:SS format
4. WHEN the timer reaches zero THEN the System SHALL automatically end the session
5. WHEN the session ends THEN the System SHALL trigger the analysis generation process

### Requirement 8

**User Story:** As a user, I want to manually end a debate session early, so that I have control over when to stop.

#### Acceptance Criteria

1. WHEN the User clicks the end session button THEN the System SHALL stop audio capture
2. WHEN the session ends THEN the System SHALL disconnect from Gemini Live API
3. WHEN the session ends THEN the System SHALL close audio contexts
4. WHEN the session ends THEN the System SHALL stop all playing audio sources
5. WHEN the session ends THEN the System SHALL trigger analysis generation

### Requirement 9

**User Story:** As a user, I want to receive detailed performance analysis after each debate, so that I can understand my strengths and areas for improvement.

#### Acceptance Criteria

1. WHEN a session ends THEN the System SHALL send the complete transcript to Gemini for analysis
2. WHEN requesting analysis THEN the System SHALL use structured JSON schema for consistent output
3. WHEN analysis is generated THEN the System SHALL include overall score (0-100)
4. WHEN analysis is generated THEN the System SHALL include confidence level (Low, Medium, High, Unstoppable)
5. WHEN analysis is generated THEN the System SHALL include English proficiency level
6. WHEN analysis is generated THEN the System SHALL include vocabulary score (0-100)
7. WHEN analysis is generated THEN the System SHALL include clarity score (0-100)
8. WHEN analysis is generated THEN the System SHALL include argument strength score (0-100)
9. WHEN analysis is generated THEN the System SHALL include persuasion score (0-100)
10. WHEN analysis is generated THEN the System SHALL include strategic adaptability score (0-100)
11. WHEN analysis is generated THEN the System SHALL assign a creative debater archetype
12. WHEN analysis is generated THEN the System SHALL provide a unique wildcard insight
13. WHEN analysis is generated THEN the System SHALL list key strengths
14. WHEN analysis is generated THEN the System SHALL list improvement suggestions

### Requirement 10

**User Story:** As a user, I want to view my debate analysis in a visually appealing format, so that I can easily understand my performance.

#### Acceptance Criteria

1. WHEN analysis is complete THEN the System SHALL display the Analysis Report view
2. WHEN displaying the overall score THEN the System SHALL show it in a large lime-colored card
3. WHEN displaying the archetype THEN the System SHALL show it in a card with background imagery
4. WHEN displaying metric scores THEN the System SHALL render animated progress bars
5. WHEN displaying strengths THEN the System SHALL show them with checkmark icons
6. WHEN displaying suggestions THEN the System SHALL show them with arrow icons
7. WHEN the User clicks return to dashboard THEN the System SHALL navigate back to the Dashboard view

### Requirement 11

**User Story:** As a user, I want the application to handle errors gracefully, so that I understand what went wrong and can take corrective action.

#### Acceptance Criteria

1. WHEN the API key is missing THEN the System SHALL display an error screen with setup instructions
2. WHEN microphone access is denied THEN the System SHALL display an error message
3. WHEN the Gemini connection fails THEN the System SHALL display a connection error message
4. WHEN audio decoding fails THEN the System SHALL log the error without crashing
5. WHEN analysis generation fails THEN the System SHALL return fallback analysis data

### Requirement 12

**User Story:** As a user, I want to navigate between different views of the application, so that I can access all features easily.

#### Acceptance Criteria

1. WHEN the User clicks the dashboard navigation button THEN the System SHALL display the Dashboard view
2. WHEN the User clicks the exit arena button THEN the System SHALL return to the Dashboard view
3. WHEN the User clicks return to dashboard from analysis THEN the System SHALL display the Dashboard view
4. WHEN the current view changes THEN the System SHALL update the header title accordingly
5. THE System SHALL maintain a sidebar with navigation options on desktop screens

### Requirement 13

**User Story:** As a user, I want the interface to be responsive and visually consistent, so that I have a pleasant experience across devices.

#### Acceptance Criteria

1. THE System SHALL use a dark theme with void background color (#18181b)
2. THE System SHALL use lime-400 (#d9f85f) as the primary accent color
3. THE System SHALL use rounded corners (2rem to 2.5rem) for all major cards
4. THE System SHALL hide the sidebar on mobile screens
5. WHEN displaying cards THEN the System SHALL use a grid layout that adapts to screen size
6. THE System SHALL use consistent typography with sans-serif font family
7. THE System SHALL apply smooth transitions to interactive elements

### Requirement 14

**User Story:** As a user, I want my session data to be saved automatically, so that my progress is preserved between visits.

#### Acceptance Criteria

1. WHEN a session completes THEN the System SHALL increment total sessions count
2. WHEN a session completes THEN the System SHALL add session duration to total minutes
3. WHEN a session completes THEN the System SHALL calculate and add points to total score
4. WHEN a session completes THEN the System SHALL create a new history item with topic, duration, and score
5. WHEN a session completes THEN the System SHALL check and award badges based on milestones
6. WHEN statistics are updated THEN the System SHALL save them to local storage
7. WHEN history is updated THEN the System SHALL save it to local storage

### Requirement 15

**User Story:** As a user, I want to see a loading state during analysis generation, so that I know the system is processing my debate.

#### Acceptance Criteria

1. WHEN analysis begins THEN the System SHALL display an animated loading screen
2. WHEN loading THEN the System SHALL show a spinning icon
3. WHEN loading THEN the System SHALL display "Generating Report" message
4. WHEN loading THEN the System SHALL show a descriptive subtitle
5. WHEN analysis completes THEN the System SHALL transition to the Analysis Report view
