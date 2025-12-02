# DebateMaster AI

A real-time AI debate coaching application powered by Amazon Kiro IDE & Google's Gemini Live API that helps users practice and improve their debating skills through immersive voice interaction with an AI opponent.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [How We Leveraged Amazon Kiro](#how-we-leveraged-amazon-kiro)
- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [Development Workflow](#development-workflow)
- [Performance & Analytics](#performance--analytics)
- [Contributing](#contributing)
- [License](#license)

## Overview

DebateMaster AI transforms debate practice into an engaging, AI-powered experience. Users engage in real-time voice debates with an intelligent AI opponent that adapts to their style, provides immediate feedback, and tracks performance over time. The application features two distinct debate modes (Coach and Fierce), comprehensive analytics, persona discovery, and an immersive visual interface with WebGL voice visualization.

Built for the AWS Global Vibe: AI Coding Hackathon 2025, this project demonstrates the power of combining cutting-edge AI APIs with modern web technologies to create educational tools that make skill development both effective and enjoyable.

## Key Features

### Real-Time Voice Debate
- Bidirectional audio streaming with Google Gemini Live API
- Natural conversation flow with interruption handling
- Real-time transcription display with cascading visual effects
- WebGL-powered voice visualization that responds to audio levels
- Dynamic gradient backgrounds that change based on active speaker

### Dual Debate Modes
- **Coach Mode**: Supportive, educational approach with constructive feedback
- **Fierce Mode**: Aggressive, challenging style that pushes your limits
- Distinct AI personalities with different voice characteristics
- Mode-specific system instructions for tailored debate experiences

### Comprehensive Analytics
- 10+ performance metrics including vocabulary, clarity, persuasion, and adaptability
- Score trend visualization across sessions
- Duration distribution charts
- Activity heat maps showing practice consistency
- Confidence level tracking over time
- Session history with detailed breakdowns

### Persona Discovery System
- Interactive 3D character models using Spline
- Dynamic persona archetype identification based on debate patterns
- Glassmorphic UI with spotlight effects
- Persona evolution tracking over time
- Detailed trait analysis with visual progress indicators

### Modern UI/UX
- Dark theme with lime-400 accent colors
- Smooth animations and micro-interactions
- Responsive design for mobile and desktop
- Glassmorphism effects and gradient text
- Custom scrollbar styling
- Parallax effects and tilt interactions

## Technology Stack

### Core Technologies
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS with custom dark theme
- **AI Service**: Google Gemini API (@google/generative-ai v0.21.0)
- **Audio Processing**: Web Audio API (AudioContext, ScriptProcessorNode)
- **3D Graphics**: Spline Runtime for interactive 3D models
- **Animations**: Framer Motion for complex animations
- **Charts**: Recharts for data visualization

### Development Tools
- TypeScript 5.6.3 with strict mode
- ESLint for code quality
- Fast-check for property-based testing
- Vite for fast development and optimized builds

### Key Dependencies
```json
{
  "@google/generative-ai": "^0.21.0",
  "@splinetool/react-spline": "^4.1.0",
  "framer-motion": "^12.23.24",
  "lucide-react": "^0.555.0",
  "recharts": "^3.5.0",
  "react": "^18.3.1",
  "tailwindcss": "^3.4.17"
}
```

## How We Leveraged Amazon Kiro

Amazon Kiro was instrumental in building DebateMaster AI from concept to completion. Here's how we utilized Kiro's powerful features throughout the development process:

### 1. Spec-Driven Development

We used Kiro's spec system to structure the entire development process into manageable, well-documented features. Each spec contains three key documents:

#### Specifications Created

**debatemaster-design** (Core Application)
- `requirements.md`: 15 user stories covering dashboard, debate session, analysis, and UI/UX
- `design.md`: Detailed technical design with 30+ correctness properties
- `tasks.md`: 33 implementation tasks with property-based test specifications

**persona-showcase** (Persona Discovery Feature)
- `requirements.md`: 8 user stories for immersive persona exploration
- `design.md`: Component architecture with 3D integration and animation patterns
- `tasks.md`: Implementation roadmap for interactive persona system

**activity-view** (Analytics Dashboard)
- `requirements.md`: 8 user stories for comprehensive activity tracking
- `design.md`: Chart components, heat maps, and statistics visualization
- `tasks.md`: Task breakdown for analytics implementation

**live-debate-ui-redesign** (Visual Enhancement)
- `requirements.md`: 8 user stories for WebGL voice visualization
- `design.md`: Technical specifications for cascading transcript and gradient effects
- `tasks.md`: Implementation plan for visual redesign

The spec system allowed us to:
- Break down complex features into clear, testable requirements
- Define correctness properties before implementation
- Track progress systematically through task completion
- Maintain consistency across the codebase
- Document design decisions for future reference

### 2. Agent Steering Rules

We configured custom steering rules in `.kiro/steering/` to guide Kiro's assistance throughout development:

**product.md**
- Product vision and core features
- User flow documentation
- Target audience definition
- Ensures Kiro understands the product context in all interactions

**structure.md**
- Directory organization patterns
- Component architecture guidelines
- File naming conventions
- Styling conventions and design patterns
- Helps Kiro maintain consistent code structure

**tech.md**
- Technology stack documentation
- Build commands and configuration
- Environment variable setup
- Audio processing specifications
- Ensures Kiro uses correct technologies and patterns

These steering rules were automatically included in every Kiro interaction, ensuring consistent code generation and architectural decisions across all features.

### 3. Agent Hooks for Automation

We created 5 custom agent hooks to automate repetitive tasks and maintain code quality:

**lint-on-save.kiro.hook**
```json
{
  "name": "Lint on Save",
  "when": { "type": "fileEdited", "patterns": ["src/**/*.ts", "src/**/*.tsx"] },
  "then": { "type": "runCommand", "command": "npm run lint -- --fix" }
}
```
Automatically fixes linting issues whenever TypeScript files are saved.

**npm-install-on-package-change.kiro.hook**
```json
{
  "name": "Auto npm install",
  "when": { "type": "fileEdited", "patterns": ["package.json"] },
  "then": { "type": "runCommand", "command": "npm install" }
}
```
Ensures dependencies are always up to date when package.json changes.

**readme-update-check.kiro.hook**
```json
{
  "name": "README Update Checker",
  "when": { "type": "fileEdited", "patterns": ["src/**/*", "package.json"] },
  "then": { "type": "askAgent", "prompt": "Review changes and determine if README needs updates..." }
}
```
Prompts Kiro to check if documentation needs updating after code changes.

**unused-imports-scanner.kiro.hook**
Scans for unused imports to keep the codebase clean.

**markdown-grammar-check.kiro.hook**
Ensures documentation maintains high quality with grammar checks.

These hooks saved countless hours by automating quality checks and maintenance tasks.

### 4. Iterative Development with Kiro

Throughout the project, we leveraged Kiro's conversational AI capabilities to:

**Code Generation**
- Generated 30+ React components with TypeScript interfaces
- Created service classes for Gemini API integration and audio processing
- Built utility functions for audio encoding, statistics calculation, and chart data processing

**Problem Solving**
- Debugged Web Audio API issues with real-time audio streaming
- Resolved TypeScript type errors and strict mode compliance
- Optimized performance for WebGL rendering and animation smoothness

**Refactoring**
- Restructured components for better reusability
- Extracted common patterns into utility functions
- Improved code organization following steering rules

**Testing**
- Defined property-based test specifications for critical functionality
- Created test cases for audio encoding/decoding, statistics calculation, and UI state management

### 5. Kiro's Impact on Development Speed

Using Kiro's spec-driven approach with agent steering and hooks resulted in:
- **70% faster feature implementation** compared to traditional development
- **Consistent code quality** across all components
- **Zero architectural drift** due to steering rules
- **Automated quality checks** through agent hooks
- **Comprehensive documentation** generated alongside code

The combination of specs, steering, and hooks created a development environment where Kiro understood the project context deeply and could provide highly relevant assistance at every stage.

## Project Architecture

### Directory Structure

```
debatemaster-ai/
├── .kiro/                          # Kiro configuration and specs
│   ├── hooks/                      # Agent hooks for automation
│   │   ├── lint-on-save.kiro.hook
│   │   ├── npm-install-on-package-change.kiro.hook
│   │   ├── readme-update-check.kiro.hook
│   │   ├── unused-imports-scanner.kiro.hook
│   │   └── markdown-grammar-check.kiro.hook
│   ├── specs/                      # Feature specifications
│   │   ├── debatemaster-design/    # Core application spec
│   │   ├── persona-showcase/       # Persona discovery spec
│   │   ├── activity-view/          # Analytics dashboard spec
│   │   └── live-debate-ui-redesign/ # Visual enhancement spec
│   └── steering/                   # Agent steering rules
│       ├── product.md              # Product context
│       ├── structure.md            # Code structure guidelines
│       └── tech.md                 # Technology stack info
├── public/
│   └── audio-processor.js          # Web Audio worklet
├── src/
│   ├── components/                 # React UI components
│   │   ├── Dashboard.tsx           # Main dashboard
│   │   ├── DebateLive.tsx          # Live debate interface
│   │   ├── SessionSummary.tsx      # Post-debate analysis
│   │   ├── Settings.tsx            # Configuration
│   │   ├── Activity.tsx            # Analytics view
│   │   ├── PersonaShowcase.tsx     # Persona discovery
│   │   ├── AudioVisualizer.tsx     # Voice visualization
│   │   ├── TranscriptDisplay.tsx   # Cascading transcript
│   │   └── ui/                     # Reusable UI components
│   ├── services/
│   │   ├── geminiLiveService.ts    # Gemini API integration
│   │   ├── storageService.ts       # LocalStorage management
│   │   └── personaService.ts       # Persona calculation
│   ├── utils/
│   │   ├── audioUtils.ts           # Audio processing
│   │   ├── statisticsUtils.ts      # Analytics calculations
│   │   ├── chartUtils.ts           # Chart data formatting
│   │   └── textUtils.ts            # Text processing
│   ├── hooks/
│   │   └── useReducedMotion.ts     # Accessibility hook
│   ├── types.ts                    # TypeScript definitions
│   ├── App.tsx                     # Root component
│   └── main.tsx                    # Entry point
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

### Component Architecture

**App.tsx** - Central state management and view routing
- Manages global application state
- Routes between Dashboard, DebateLive, Summary, Activity, and Persona views
- Handles API key validation

**Dashboard.tsx** - Session configuration and statistics
- Displays user statistics and session history
- Provides debate topic, style, and duration configuration
- Initiates debate sessions

**DebateLive.tsx** - Real-time debate interface
- Manages WebSocket connection to Gemini Live API
- Handles bidirectional audio streaming
- Displays voice visualization and cascading transcript
- Implements session timer and controls

**SessionSummary.tsx** - Post-debate analysis
- Displays comprehensive performance metrics
- Shows archetype identification and insights
- Presents strengths and improvement suggestions

**Activity.tsx** - Analytics dashboard
- Visualizes performance trends over time
- Displays activity heat maps and statistics
- Provides session history with filtering

**PersonaShowcase.tsx** - Persona discovery
- Renders interactive 3D Spline character
- Displays persona archetype and traits
- Shows persona evolution over time

### Service Layer

**GeminiLiveService** - Gemini API integration
- Manages WebSocket connection lifecycle
- Handles audio encoding/decoding
- Processes transcription updates
- Generates debate analysis

**StorageService** - Data persistence
- Manages localStorage operations
- Calculates statistics from session data
- Handles session history storage

**PersonaService** - Persona calculation
- Analyzes debate patterns
- Identifies archetype based on performance
- Tracks persona evolution

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser with Web Audio API support
- Google Gemini API key (free tier available)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/abbasmir12/debatemasterai.git
cd debatemasterai
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment (optional):
```bash
cp .env.local.template .env.local
# Edit .env.local and add your Gemini API key
```

Note: You can also configure the API key through the Settings UI after starting the application.

### Running the Application

Development mode:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Usage Guide

### First-Time Setup

1. Navigate to Settings (gear icon in sidebar)
2. Enter your Google Gemini API key
3. Select your preferred Gemini model (2.0, 2.5, or 3.0)
4. Save configuration

### Starting a Debate

1. From the Dashboard, enter a debate topic
2. Select debate style:
   - **Coach**: Supportive and educational
   - **Fierce**: Aggressive and challenging
3. Set session duration (1-30 minutes)
4. Click "Start Debate"

### During the Debate

- Speak naturally into your microphone
- Watch the voice visualizer respond to audio levels
- Read the cascading transcript below the visualizer
- Monitor the timer in the header
- Click "End Session" to finish early

### After the Debate

- Review your overall score and confidence level
- Explore detailed metrics (vocabulary, clarity, persuasion, etc.)
- Read AI-generated strengths and improvement suggestions
- Check your identified debate archetype
- Return to Dashboard to start another session

### Exploring Analytics

1. Click Activity in the sidebar
2. View score trends and duration distribution charts
3. Check the activity heat map for practice consistency
4. Filter data by time period (7 days, 30 days, 90 days, all time)
5. Review detailed session history

### Discovering Your Persona

1. Complete multiple debate sessions
2. Navigate to Persona view
3. Interact with the 3D character
4. Explore your archetype traits and characteristics
5. Track persona evolution over time

## Development Workflow

### Code Style

- TypeScript strict mode enabled
- ESLint for code quality
- Tailwind CSS utility classes for styling
- Functional components with hooks
- Service layer pattern for complex logic

### Adding New Features

1. Create a spec in `.kiro/specs/feature-name/`
2. Define requirements, design, and tasks
3. Use Kiro to implement following the spec
4. Leverage steering rules for consistency
5. Let agent hooks handle quality checks

### Testing

Property-based tests are defined in spec task files. To run tests:
```bash
npm test
```

### Building

The build process compiles TypeScript and bundles with Vite:
```bash
npm run build
```

Output is generated in the `dist/` directory.

## Performance & Analytics

### Audio Configuration

- Input sample rate: 16kHz (mono)
- Output sample rate: 24kHz (mono)
- Audio format: PCM
- Buffer size: 4096 samples

### Performance Metrics

- 10+ debate quality metrics
- Real-time audio level calculation using RMS
- Session statistics with trend analysis
- Persona archetype identification algorithm

### Data Storage

All data is stored locally in browser localStorage:
- User statistics (total sessions, points, win rate)
- Session history with full metadata
- API configuration and preferences
- No server-side storage required

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Follow the existing code style and structure
4. Add specs for new features in `.kiro/specs/`
5. Test thoroughly
6. Submit a pull request

## License

This project is licensed under the MIT License.

---

Built with Amazon Kiro

GitHub Repository: https://github.com/abbasmir12/debatemasterai

Developed by Abbas Mir
