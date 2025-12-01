# Design Document

## Overview

DebateMaster AI is a React-based single-page application that provides real-time voice debate practice through integration with Google's Gemini Live API. The application architecture follows a component-based design with clear separation between UI components, service layers, and utility functions. The system manages complex real-time audio streaming, bidirectional communication with AI services, and rich data visualization through a modern, responsive interface.

The application consists of three primary views (Dashboard, Live Arena, Analysis Report) orchestrated by a central App component that manages global state and view transitions. Audio processing is handled through Web Audio API with custom PCM encoding/decoding, while persistent data is managed through browser localStorage.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         App.tsx                              │
│  (View Router, Global State, API Key Validation)            │
└────────────┬────────────────────────────────────────────────┘
             │
    ┌────────┴────────┬──────────────┬────────────────┐
    │                 │              │                │
┌───▼────┐    ┌──────▼──────┐  ┌───▼────────┐  ┌───▼─────────┐
│Dashboard│    │ DebateLive  │  │  Session   │  │   Sidebar   │
│         │    │             │  │  Summary   │  │ Navigation  │
└───┬────┘    └──────┬──────┘  └────────────┘  └─────────────┘
    │                │
    │         ┌──────▼──────────────────┐
    │         │  GeminiLiveService      │
    │         │  (Audio I/O, WebSocket) │
    │         └──────┬──────────────────┘
    │                │
    │         ┌──────▼──────────┐
    │         │  Audio Utils    │
    │         │  (PCM Encoding) │
    │         └─────────────────┘
    │
┌───▼─────────────────┐
│  Storage Service    │
│  (localStorage)     │
└─────────────────────┘
```

### Technology Stack

- **Frontend Framework**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 6.2.0
- **AI Service**: Google Gemini 2.5 Flash with Live API (@google/genai 1.30.0)
- **Audio Processing**: Web Audio API (native browser)
- **State Management**: React useState hooks (component-level)
- **Styling**: Tailwind CSS (inline utility classes)
- **Data Persistence**: Browser localStorage API

### Component Hierarchy

```
App
├── Sidebar (Navigation)
├── Header (Search, Upgrade, Notifications)
└── Main Content Area
    ├── Dashboard
    │   ├── Statistics Cards (6 cards)
    │   ├── Session Start Form
    │   └── History List
    ├── DebateLive
    │   ├── Header (Topic, Timer, Exit)
    │   ├── Chat Messages Container
    │   │   └── Message Bubbles
    │   └── Footer Controls
    │       ├── AudioVisualizer
    │       └── End Session Button
    └── SessionSummary
        ├── Score Card
        ├── Archetype Card
        ├── Metrics Grid (Linguistics, Strategy)
        └── Feedback Lists (Strengths, Suggestions)
```

## Design System

### Color Palette

**Primary Colors:**
- `void` (Background): `#18181b` - Main dark background
- `lime-400` (Primary Accent): `#d9f85f` - Primary action color, highlights, active states
- `card` (Surface): `#1e1e21` or `rgb(30, 30, 33)` - Card backgrounds

**Neutral Colors:**
- `white`: `#ffffff` - Text, buttons, high contrast elements
- `slate-200`: `#e2e8f0` - Light backgrounds (History card)
- `slate-300`: `#cbd5e1` - Secondary text
- `slate-400`: `#94a3b8` - Tertiary text, placeholders
- `slate-500`: `#64748b` - Muted text, labels
- `slate-600`: `#475569` - Inactive states
- `slate-700`: `#334155` - Borders, dividers
- `slate-800`: `#1e293b` - Dark elements within cards

**Accent Colors:**
- `indigo-400`: `#818cf8` - Visualizer bars, secondary accent
- `indigo-500`: `#6366f1` - Coach mode highlight, ROI indicator
- `emerald-400`: `#34d399` - Success states
- `emerald-500`: `#10b981` - Strategy section accent
- `red-400`: `#f87171` - Error states
- `red-500`: `#ef4444` - Fierce mode highlight, errors
- `amber-400`: `#fbbf24` - Warning states, suggestions
- `amber-500`: `#f59e0b` - Opportunities section

**Opacity Modifiers:**
- `/5`: 5% opacity (subtle borders, overlays)
- `/10`: 10% opacity (backgrounds, hover states)
- `/20`: 20% opacity (active backgrounds)
- `/50`: 50% opacity (medium transparency)
- `/60`: 60% opacity (images, overlays)

### Typography

**Font Family:**
- Primary: `font-sans` - System sans-serif stack
- Monospace: `font-mono` - For timer, duration display

**Font Sizes:**
- `text-xs`: 0.75rem (12px) - Labels, badges, metadata
- `text-sm`: 0.875rem (14px) - Body text, buttons
- `text-base`: 1rem (16px) - Default text
- `text-lg`: 1.125rem (18px) - Subheadings
- `text-xl`: 1.25rem (20px) - Section titles
- `text-2xl`: 1.5rem (24px) - Page headers
- `text-3xl`: 1.875rem (30px) - Large scores
- `text-4xl`: 2.25rem (36px) - Archetype titles
- `text-7xl`: 4.5rem (72px) - Main score display
- `text-8xl`: 6rem (96px) - Analysis overall score

**Font Weights:**
- `font-medium`: 500 - Navigation, labels
- `font-semibold`: 600 - Subheadings
- `font-bold`: 700 - Headings, buttons, emphasis
- `font-black`: 900 - Large display numbers

**Text Styles:**
- `tracking-tight`: Tight letter spacing for large numbers
- `tracking-tighter`: Extra tight for display text
- `tracking-wide`: Wide spacing for labels
- `tracking-wider`: Extra wide for uppercase labels
- `uppercase`: All caps for labels
- `italic`: Emphasis, quotes

### Spacing & Layout

**Border Radius:**
- `rounded-md`: 0.375rem (6px) - Small elements
- `rounded-lg`: 0.5rem (8px) - Buttons, inputs
- `rounded-xl`: 0.75rem (12px) - Medium cards, buttons
- `rounded-2xl`: 1rem (16px) - Large buttons, containers
- `rounded-[2rem]`: 2rem (32px) - Major cards
- `rounded-[2.5rem]`: 2.5rem (40px) - Premium cards
- `rounded-full`: 50% - Circles, pills, badges

**Padding:**
- `p-1`: 0.25rem (4px)
- `p-2`: 0.5rem (8px)
- `p-3`: 0.75rem (12px)
- `p-4`: 1rem (16px)
- `p-6`: 1.5rem (24px)
- `p-8`: 2rem (32px)

**Gaps:**
- `gap-1`: 0.25rem (4px)
- `gap-2`: 0.5rem (8px)
- `gap-3`: 0.75rem (12px)
- `gap-4`: 1rem (16px)
- `gap-6`: 1.5rem (24px)
- `gap-8`: 2rem (32px)

### Component Styles

**Cards:**
- Background: `bg-card` with `border border-white/5`
- Padding: `p-6` or `p-8`
- Border radius: `rounded-[2rem]` or `rounded-[2.5rem]`
- Shadow: `shadow-lg` for elevated cards

**Buttons:**
- Primary: `bg-lime-400 text-void font-bold rounded-xl hover:bg-lime-500`
- Secondary: `bg-white text-void font-bold rounded-xl hover:bg-slate-200`
- Outline: `border border-slate-700 text-slate-400 rounded-xl hover:border-slate-500`
- Icon: `w-10 h-10 rounded-xl border border-slate-700`

**Inputs:**
- Text: `bg-void/50 border border-white/10 rounded-xl px-4 py-3 focus:border-lime-400`
- Range: `h-1 bg-slate-700 rounded-lg accent-lime-400`

**Badges:**
- Small: `text-xs px-2 py-1 rounded-full border`
- Medium: `text-xs px-3 py-1 rounded-full`

**Message Bubbles:**
- User: `bg-lime-400 text-void rounded-3xl rounded-tr-md p-5`
- AI: `bg-void border border-white/10 text-slate-300 rounded-3xl rounded-tl-md p-5`

**Progress Bars:**
- Container: `h-3 bg-void rounded-full border border-white/5`
- Fill: `h-full bg-lime-400 rounded-full transition-all duration-1000`

### Visual Effects

**Shadows:**
- `shadow-sm`: Subtle elevation
- `shadow-lg`: Medium elevation
- `shadow-xl`: High elevation
- `shadow-lime-400/10`: Colored glow effect

**Transitions:**
- Default: `transition` (all properties, 150ms)
- Duration: `duration-500`, `duration-1000` for animations
- Easing: Default ease-in-out

**Animations:**
- `animate-pulse`: Loading states, connection indicators
- `animate-spin`: Loading spinners

**Gradients:**
- `bg-gradient-to-tr from-lime-400 to-emerald-400`: Avatar ring
- `bg-gradient-to-t from-void via-void/50 to-transparent`: Image overlays
- `bg-gradient-to-r from-void via-card to-transparent`: Text overlays

**Backdrop Effects:**
- `backdrop-blur-md`: Glass morphism effect
- `backdrop-blur-xl`: Strong blur for overlays

### Responsive Design

**Breakpoints:**
- `md:`: 768px and up (tablet)
- Desktop-first approach with mobile adaptations

**Mobile Adaptations:**
- Hide sidebar: `hidden md:flex`
- Single column grids: `grid-cols-1 md:grid-cols-3`
- Reduced padding: `p-4 md:p-8`
- Hide search: `hidden md:block`

### Icons

**Style:**
- Heroicons outline style
- Stroke width: 1.5 or 2
- Size: `w-4 h-4` to `w-6 h-6` depending on context

**Common Icons:**
- Dashboard: Grid squares
- Activity: Document
- Schedule: Calendar
- Settings: Sliders
- Bell: Notifications
- Search: Magnifying glass
- Arrow Left: Back navigation
- Arrow Up Right: External link
- Fire: Fierce mode
- Academic Cap: Coach mode
- Bolt: Energy/points
- Chart: Analytics
- Download: Export

### Special Visual Elements

**Decorative Patterns:**
- Radial dots: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)` with `background-size: 24px 24px`
- Diagonal stripes: SVG pattern for bar charts

**Circular Decorations:**
- Large circles with borders for visual interest
- Rotated partial circles for dynamic feel
- Blur effects for depth: `blur-2xl`

**Image Treatments:**
- Opacity: `opacity-20` to `opacity-60`
- Grayscale: `grayscale` for background images
- Object fit: `object-cover` for full coverage

### Dark Theme Specifics

**Contrast Ratios:**
- Primary text on void: High contrast (white/slate-200)
- Secondary text: Medium contrast (slate-400/slate-500)
- Disabled states: Low contrast (slate-600)

**Border Strategy:**
- Subtle borders: `border-white/5` for card separation
- Interactive borders: `border-white/10` for inputs
- Hover borders: `border-white/30` for feedback

**Glow Effects:**
- Lime accent glow: `shadow-lime-400/10`
- Used sparingly for emphasis

## Components and Interfaces

### Core Components

#### 1. App Component

**Responsibilities:**
- Root application component
- View routing and state management
- API key validation
- Global state for current view, topic, style, duration, and analysis

**State:**
```typescript
currentView: AppView (DASHBOARD | DEBATE_LIVE | SUMMARY)
currentTopic: string
currentStyle: DebateStyle (COACH | AGGRESSIVE)
currentDuration: number (minutes)
lastAnalysis: DebateAnalysis | null
apiKeyMissing: boolean
```

**Methods:**
- `startDebate(topic, style, duration)`: Transitions to Live Arena
- `handleAnalysisComplete(analysis)`: Stores analysis and shows Summary
- `goBackToDashboard()`: Resets state and returns to Dashboard

#### 2. Dashboard Component

**Props:**
```typescript
interface DashboardProps {
  onStartDebate: (topic: string, style: DebateStyle, duration: number) => void;
}
```

**State:**
```typescript
stats: UserStats | null
history: SessionHistoryItem[]
topic: string
selectedStyle: DebateStyle
duration: number
```

**Layout:**
- 3-column grid on desktop, single column on mobile
- 6 distinct cards: Total Score, Session Start, History, ROI, Persona, Fluency Rate
- Form inputs: text input (topic), style toggle buttons, duration slider

#### 3. DebateLive Component

**Props:**
```typescript
interface DebateLiveProps {
  topic: string;
  style: DebateStyle;
  durationMinutes: number;
  onAnalysisComplete: (analysis: DebateAnalysis) => void;
  onBack: () => void;
}
```

**State:**
```typescript
isConnected: boolean
messages: ChatMessage[]
audioLevel: number
elapsedSeconds: number
errorMsg: string | null
isAnalyzing: boolean
```

**Refs:**
```typescript
serviceRef: GeminiLiveService | null
messagesEndRef: HTMLDivElement | null
messagesRef: ChatMessage[] (for closure access)
```

**Lifecycle:**
- On mount: Initialize GeminiLiveService, request microphone, connect to API
- Timer: Increment elapsed seconds, auto-stop at duration limit
- On unmount: Disconnect service, cleanup audio contexts

#### 4. SessionSummary Component

**Props:**
```typescript
interface SessionSummaryProps {
  analysis: DebateAnalysis;
  onBack: () => void;
}
```

**Sub-components:**
- `MetricBar`: Renders labeled progress bar for scores

**Layout:**
- Top row: Large score card + Archetype card with imagery
- Middle row: Two metric grids (Linguistics, Strategy)
- Bottom row: Two feedback lists (Strengths, Suggestions)

#### 5. AudioVisualizer Component

**Props:**
```typescript
interface AudioVisualizerProps {
  level: number; // 0-100
  isActive: boolean;
}
```

**Rendering:**
- 5 vertical bars with dynamic heights based on audio level
- Sine wave variation for visual interest
- Opacity changes with activity state

### Service Layer

#### GeminiLiveService

**Purpose:** Manages bidirectional real-time communication with Gemini Live API, including audio streaming, transcription, and analysis generation.

**Constructor Parameters:**
```typescript
apiKey: string
onTranscript: (text: string, isUser: boolean, isFinal: boolean) => void
onStatusChange: (isConnected: boolean) => void
onAudioLevel: (level: number) => void
onError: (error: Error) => void
```

**Key Methods:**

1. `connect(topic: string, style: DebateStyle): Promise<void>`
   - Requests microphone access
   - Initializes input/output AudioContexts
   - Configures Gemini Live session with system instructions
   - Sets up audio processing pipeline

2. `handleOpen(stream: MediaStream, topic: string, style: DebateStyle): void`
   - Creates MediaStreamSource from microphone
   - Sets up ScriptProcessorNode for audio capture
   - Sends PCM audio blobs to Gemini in real-time
   - Calculates RMS audio level for visualization

3. `handleMessage(message: LiveServerMessage): void`
   - Decodes base64 audio responses
   - Schedules audio playback with proper timing
   - Processes transcription updates (interim and final)
   - Handles interruption events

4. `analyzeDebate(transcript: ChatMessage[], topic: string): Promise<DebateAnalysis>`
   - Formats conversation transcript
   - Sends to Gemini with structured JSON schema
   - Parses and returns analysis object

5. `disconnect(): Promise<void>`
   - Stops audio processing
   - Closes audio contexts
   - Cleans up audio sources

**Audio Processing Details:**
- Input: 16kHz mono PCM from microphone
- Output: 24kHz mono PCM from Gemini
- Buffer size: 4096 samples
- Audio level calculation: RMS of input buffer scaled by 50

#### StorageService

**Purpose:** Manages persistent data in browser localStorage.

**Functions:**

1. `getStats(): UserStats`
   - Retrieves user statistics from localStorage
   - Returns default stats if none exist

2. `getHistory(): SessionHistoryItem[]`
   - Retrieves session history from localStorage
   - Returns empty array if none exists

3. `saveSession(topic: string, durationSeconds: number): { stats, newItem }`
   - Increments session count and total minutes
   - Calculates and adds points (10 base + 2 per minute)
   - Checks and awards badges (Novice at 1, Consistency at 5, Century at 100 points)
   - Creates new history item with mock score
   - Persists to localStorage

**Storage Keys:**
- `debate_master_stats`: UserStats object
- `debate_master_history`: SessionHistoryItem array

### Utility Functions

#### audioUtils.ts

**Constants:**
```typescript
INPUT_SAMPLE_RATE = 16000
OUTPUT_SAMPLE_RATE = 24000
```

**Functions:**

1. `createBlob(pcmData: Float32Array): Blob`
   - Converts Float32Array to Int16Array PCM
   - Creates Blob for streaming to API

2. `decode(base64: string): ArrayBuffer`
   - Decodes base64 string to ArrayBuffer

3. `decodeAudioData(buffer: ArrayBuffer, context: AudioContext, sampleRate: number, channels: number): Promise<AudioBuffer>`
   - Decodes raw PCM to AudioBuffer for playback

## Data Models

### TypeScript Interfaces

```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: number;
  isFinal?: boolean;
}

interface UserStats {
  totalSessions: number;
  totalMinutes: number;
  points: number;
  badges: string[];
}

interface SessionHistoryItem {
  id: string;
  date: string; // ISO string
  topic: string;
  durationSeconds: number;
  score: number; // 0-100
}

interface DebateAnalysis {
  score: number; // 0-100
  confidenceLevel: 'Low' | 'Medium' | 'High' | 'Unstoppable';
  englishProficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native';
  vocabularyScore: number; // 0-100
  clarityScore: number; // 0-100
  argumentStrength: number; // 0-100
  persuasionScore: number; // 0-100
  strategicAdaptability: number; // 0-100
  archetype: string;
  wildcardInsight: string;
  emotionalState: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

enum AppView {
  DASHBOARD = 'DASHBOARD',
  DEBATE_LIVE = 'DEBATE_LIVE',
  SUMMARY = 'SUMMARY',
}

enum DebateStyle {
  COACH = 'COACH',
  AGGRESSIVE = 'AGGRESSIVE',
}

interface AudioConfig {
  inputSampleRate: number;
  outputSampleRate: number;
}
```

### Data Flow Diagrams

#### Session Start Flow
```
User fills form → Dashboard validates → App.startDebate() → 
App sets state → DebateLive mounts → GeminiLiveService.connect() →
Microphone access → Audio pipeline setup → Connected state
```

#### Real-Time Audio Flow
```
Microphone → ScriptProcessorNode → PCM encoding → 
Gemini Live API → Base64 audio response → PCM decoding →
AudioBuffer → Scheduled playback → Speaker output
```

#### Transcription Flow
```
Gemini sends interim text → Service updates current transcription →
Callback to component → State update → UI renders interim message →
Gemini sends turn complete → Service finalizes → Final message rendered
```

#### Analysis Flow
```
Session ends → Service.analyzeDebate() → Format transcript →
Gemini generateContent with JSON schema → Parse response →
onAnalysisComplete callback → App stores analysis →
Navigate to Summary view → Render metrics and feedback
```

## Correctnes
s Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After analyzing all acceptance criteria, several properties were identified as logically redundant or combinable:

- Storage persistence properties (1.4, 1.5, 14.6, 14.7) can be unified into a single round-trip property
- Analysis field validation properties (9.3-9.14) can be combined into comprehensive structure validation
- Message styling properties (4.6, 4.7) can be unified based on message role
- Visualizer state properties (5.3, 5.4) can be combined into connection-based behavior
- Debate mode configuration properties (6.1-6.5) can be consolidated per mode
- Session statistics updates (14.1, 14.2, 14.3) can be unified into calculation correctness

### Core Properties

Property 1: Dashboard displays all required statistics
*For any* UserStats object, when rendered in the Dashboard, the output should contain total score, total sessions, total minutes, and win rate fields.
**Validates: Requirements 1.2**

Property 2: History display limits to five most recent sessions
*For any* session history array with length >= 5, when rendered in the Dashboard, the displayed items should be exactly the first 5 elements from the array.
**Validates: Requirements 1.3**

Property 3: Data persistence round-trip consistency
*For any* UserStats object or SessionHistoryItem array, saving to localStorage then retrieving should return data equivalent to the original.
**Validates: Requirements 1.4, 1.5, 14.6, 14.7**

Property 4: Start button enabled state matches topic validity
*For any* topic string, the start debate button should be enabled if and only if the trimmed topic is non-empty.
**Validates: Requirements 2.1, 2.2 (edge case)**

Property 5: Selected style reflects in UI state
*For any* DebateStyle selection, the UI should highlight exactly one style button matching the selected value.
**Validates: Requirements 2.3**

Property 6: Duration display matches slider value
*For any* duration value in the range [1, 15], the displayed duration text should equal the slider value.
**Validates: Requirements 2.4**

Property 7: View transition preserves parameters
*For any* valid combination of topic, style, and duration, starting a debate should transition to DEBATE_LIVE view and pass all three parameters unchanged.
**Validates: Requirements 2.5**

Property 8: Connection state reflects in UI indicators
*For any* connection state change, the UI should display the corresponding status indicator (connected/disconnected).
**Validates: Requirements 3.3**

Property 9: Audio contexts use correct sample rates
*For any* GeminiLiveService instance, the input AudioContext should use 16000 Hz and the output AudioContext should use 24000 Hz.
**Validates: Requirements 3.4, 3.6**

Property 10: Audio encoding/decoding round-trip
*For any* audio buffer, encoding to PCM blob then decoding should preserve the audio data within acceptable tolerance.
**Validates: Requirements 3.7**

Property 11: Interim transcriptions create non-final messages
*For any* interim transcription update, the messages array should contain a message with isFinal=false and the transcription text.
**Validates: Requirements 4.1, 4.3**

Property 12: Final transcriptions mark messages as complete
*For any* transcription that receives a turn complete signal, the corresponding message should have isFinal=true.
**Validates: Requirements 4.2, 4.4**

Property 13: Message rendering matches role styling
*For any* ChatMessage, if role is 'user' then rendered output should have lime background and right alignment, if role is 'model' then dark background with border and left alignment.
**Validates: Requirements 4.6, 4.7**

Property 14: RMS audio level calculation correctness
*For any* audio buffer (Float32Array), the calculated RMS should equal the square root of the mean of squared samples.
**Validates: Requirements 5.1**

Property 15: Audio level updates visualizer
*For any* audio level value, the AudioVisualizer component should receive and reflect that value in its rendering.
**Validates: Requirements 5.2**

Property 16: Visualizer bar count is constant
*For any* audio level and connection state, the AudioVisualizer should render exactly 5 bars.
**Validates: Requirements 5.5**

Property 17: Visualizer animation matches connection state
*For any* connection state, if active then bars should have dynamic heights based on audio level, if inactive then bars should be at minimum height.
**Validates: Requirements 5.3, 5.4**

Property 18: Coach mode configuration correctness
*For any* GeminiLiveService configured with DebateStyle.COACH, the system instruction should contain coaching-related keywords and voice should be "Puck".
**Validates: Requirements 6.1, 6.2**

Property 19: Fierce mode configuration correctness
*For any* GeminiLiveService configured with DebateStyle.AGGRESSIVE, the system instruction should contain aggressive keywords, voice should be "Fenrir", and instructions should include strong language directives.
**Validates: Requirements 6.3, 6.4, 6.5**

Property 20: Timer countdown decrements correctly
*For any* timer state with active connection, after 1 second elapses, the elapsed seconds should increase by 1.
**Validates: Requirements 7.2**

Property 21: Timer format follows MM:SS pattern
*For any* number of seconds, the formatted time string should match the pattern "M:SS" or "MM:SS" where M is minutes and SS is zero-padded seconds.
**Validates: Requirements 7.3**

Property 22: Analysis transcript includes all conversation messages
*For any* messages array, when generating analysis, the formatted transcript should include all messages where role is 'user' or 'model', excluding 'system' messages.
**Validates: Requirements 9.1**

Property 23: Analysis structure completeness
*For any* DebateAnalysis object returned from analyzeDebate(), it should contain all required fields: score (0-100), confidenceLevel (valid enum), englishProficiency (valid enum), vocabularyScore (0-100), clarityScore (0-100), argumentStrength (0-100), persuasionScore (0-100), strategicAdaptability (0-100), archetype (non-empty string), wildcardInsight (non-empty string), strengths (array), and suggestions (array).
**Validates: Requirements 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 9.10, 9.11, 9.12, 9.13, 9.14**

Property 24: Metric progress bar width proportional to score
*For any* metric score value between 0 and 100, the rendered progress bar width should be equal to the score percentage.
**Validates: Requirements 10.4**

Property 25: Strength items include checkmark icons
*For any* strength string in the analysis, the rendered list item should contain a checkmark character or icon.
**Validates: Requirements 10.5**

Property 26: Suggestion items include arrow icons
*For any* suggestion string in the analysis, the rendered list item should contain an arrow character or icon.
**Validates: Requirements 10.6**

Property 27: Header title matches current view
*For any* AppView state, the header title should display "Statistics" for DASHBOARD, "Live Session" for DEBATE_LIVE, or "Analysis" for SUMMARY.
**Validates: Requirements 12.4**

Property 28: Session completion updates statistics correctly
*For any* UserStats object and session with duration D seconds, after saveSession(), the new stats should have totalSessions incremented by 1, totalMinutes incremented by floor(D/60), and points incremented by (10 + floor(D/60) * 2).
**Validates: Requirements 14.1, 14.2, 14.3**

Property 29: Session completion creates history item
*For any* session with topic T and duration D, after saveSession(), the history should contain a new item with matching topic, durationSeconds, and a score between 0 and 100.
**Validates: Requirements 14.4**

Property 30: Badge awards at milestones
*For any* UserStats object, if totalSessions == 1 then badges should include "Debate Novice", if totalSessions >= 5 then badges should include "Consistency King", if points >= 100 then badges should include "Century Club".
**Validates: Requirements 14.5**

## Error Handling

### Error Categories

1. **API Key Errors**
   - Missing API key: Display error screen with setup instructions
   - Invalid API key: Caught by Gemini SDK, display connection error

2. **Microphone Access Errors**
   - Permission denied: Display error message in Live Arena
   - No microphone available: Display error message
   - Microphone in use: Display error message

3. **Connection Errors**
   - Gemini API unavailable: Display connection error, allow retry
   - Network timeout: Display timeout error
   - WebSocket closure: Update connection status, show disconnected state

4. **Audio Processing Errors**
   - Audio decoding failure: Log error, continue without crashing
   - AudioContext creation failure: Display error message
   - Buffer overflow: Handle gracefully, may cause audio glitches

5. **Analysis Errors**
   - API failure: Return fallback analysis with default values
   - JSON parsing error: Return fallback analysis
   - Schema validation error: Return fallback analysis

### Error Handling Strategies

**Graceful Degradation:**
- If audio decoding fails for one chunk, log and continue processing subsequent chunks
- If analysis fails, provide fallback data so user can still navigate

**User Feedback:**
- All errors display user-friendly messages
- Technical details logged to console for debugging
- Error messages include actionable next steps when possible

**State Recovery:**
- Connection errors allow user to return to Dashboard
- Failed sessions don't corrupt localStorage data
- Audio context cleanup prevents resource leaks

**Fallback Analysis Structure:**
```typescript
{
  score: 0,
  confidenceLevel: 'Low',
  englishProficiency: 'Beginner',
  vocabularyScore: 0,
  clarityScore: 0,
  argumentStrength: 0,
  persuasionScore: 0,
  strategicAdaptability: 0,
  archetype: 'The Unknown',
  wildcardInsight: 'Data unavailable due to error.',
  emotionalState: 'Unknown',
  strengths: ['Analysis failed'],
  weaknesses: ['Could not process transcript'],
  suggestions: ['Try again']
}
```

## Testing Strategy

### Dual Testing Approach

The application requires both unit testing and property-based testing to ensure comprehensive coverage:

- **Unit tests** verify specific examples, edge cases, and integration points
- **Property tests** verify universal properties that should hold across all inputs
- Together they provide complete coverage: unit tests catch concrete bugs, property tests verify general correctness

### Property-Based Testing

**Framework:** fast-check (JavaScript/TypeScript property-based testing library)

**Configuration:**
- Minimum 100 iterations per property test
- Each property test must reference its corresponding design property using the format: `**Feature: debatemaster-redesign, Property {number}: {property_text}**`
- Each correctness property must be implemented by a single property-based test

**Key Property Tests:**

1. **Data Persistence (Property 3)**
   - Generate random UserStats and SessionHistoryItem arrays
   - Test round-trip through localStorage
   - Verify deep equality after retrieval

2. **Audio Processing (Property 10)**
   - Generate random audio buffers
   - Test encoding/decoding pipeline
   - Verify data preservation within tolerance

3. **Timer Formatting (Property 21)**
   - Generate random second values [0, 3600]
   - Test formatTime function
   - Verify MM:SS pattern compliance

4. **Statistics Calculation (Property 28)**
   - Generate random UserStats and durations
   - Test saveSession calculations
   - Verify arithmetic correctness

5. **Analysis Structure (Property 23)**
   - Mock Gemini API responses
   - Test analyzeDebate function
   - Verify all required fields present and valid

**Generators:**
- `arbUserStats()`: Generates valid UserStats objects
- `arbSessionHistory()`: Generates SessionHistoryItem arrays
- `arbAudioBuffer()`: Generates Float32Array audio data
- `arbDebateAnalysis()`: Generates valid DebateAnalysis objects
- `arbChatMessage()`: Generates ChatMessage objects with various roles

### Unit Testing

**Framework:** Vitest (fast Vite-native test runner)

**Component Tests:**

1. **Dashboard Component**
   - Renders with empty stats
   - Displays statistics correctly
   - Form validation (empty topic disables button)
   - Style selection toggles
   - Duration slider updates display
   - Start button triggers callback with correct parameters

2. **DebateLive Component**
   - Mounts and requests microphone
   - Displays connection status
   - Renders messages correctly
   - Timer countdown works
   - End button triggers cleanup
   - Error messages display

3. **SessionSummary Component**
   - Renders all analysis fields
   - Progress bars show correct widths
   - Strengths and suggestions display with icons
   - Back button triggers callback

4. **AudioVisualizer Component**
   - Renders 5 bars
   - Bar heights change with audio level
   - Active/inactive states render differently

**Service Tests:**

1. **GeminiLiveService**
   - Connection initialization
   - Audio context creation with correct sample rates
   - Message handling (transcription, audio, interruption)
   - Disconnect cleanup
   - Analysis request formatting

2. **StorageService**
   - getStats returns default when empty
   - getHistory returns empty array when empty
   - saveSession updates stats correctly
   - saveSession creates history item
   - Badge awards at milestones

**Utility Tests:**

1. **audioUtils**
   - createBlob converts Float32 to Int16 correctly
   - decode handles base64 strings
   - decodeAudioData creates valid AudioBuffer

### Integration Testing

**Key Integration Points:**

1. **App → Dashboard → DebateLive Flow**
   - Test complete session start flow
   - Verify state transitions
   - Verify parameter passing

2. **DebateLive → GeminiLiveService → Audio Pipeline**
   - Test with mock microphone stream
   - Verify audio processing pipeline
   - Test transcription callbacks

3. **Session End → Analysis → Summary Flow**
   - Test complete session end flow
   - Verify analysis generation
   - Verify view transition

4. **localStorage Integration**
   - Test data persistence across component remounts
   - Verify data format compatibility

### Test Coverage Goals

- **Line Coverage:** > 80%
- **Branch Coverage:** > 75%
- **Function Coverage:** > 85%
- **Property Coverage:** 100% of defined correctness properties

### Testing Best Practices

1. **Mock External Dependencies:**
   - Mock Gemini API calls
   - Mock microphone access
   - Mock localStorage
   - Mock AudioContext

2. **Test Isolation:**
   - Each test should be independent
   - Clean up after each test
   - Reset mocks between tests

3. **Descriptive Test Names:**
   - Use "should" statements
   - Include context and expected outcome
   - Reference requirement numbers when applicable

4. **Edge Case Coverage:**
   - Empty strings, null, undefined
   - Boundary values (0, 100, max duration)
   - Large arrays, long strings
   - Rapid state changes

5. **Async Testing:**
   - Properly await async operations
   - Test loading states
   - Test error states
   - Test timeout scenarios
