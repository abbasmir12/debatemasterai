# Technology Stack

## Core Technologies

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS with custom dark theme
- **AI Service**: Google Gemini API (@google/generative-ai v0.21.0)
- **Audio Processing**: Web Audio API (AudioContext, ScriptProcessorNode)

## TypeScript Configuration

- Target: ES2020
- Strict mode enabled with `noUncheckedIndexedAccess`
- Module resolution: bundler mode
- JSX: react-jsx

## Build & Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview production build
npm run preview
```

## Key Dependencies

- `react` & `react-dom`: ^18.3.1
- `@google/generative-ai`: ^0.21.0
- `tailwindcss`: ^3.4.17
- `vite`: ^6.2.0
- `typescript`: ^5.6.3

## Environment Variables

- `VITE_GEMINI_API_KEY`: Google Gemini API key (optional, can be set via UI)

## Audio Configuration

- Input sample rate: 16kHz (mono)
- Output sample rate: 24kHz (mono)
- Audio format: PCM
- Buffer size: 4096 samples
