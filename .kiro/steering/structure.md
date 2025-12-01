# Project Structure

## Directory Organization

```
src/
├── components/          # React UI components
│   ├── Dashboard.tsx    # Main dashboard with stats and session controls
│   ├── DebateLive.tsx   # Live debate interface with audio streaming
│   ├── SessionSummary.tsx # Post-debate analysis display
│   ├── Settings.tsx     # API key and model configuration
│   └── AudioVisualizer.tsx # Real-time audio level visualization
├── services/            # Business logic and external integrations
│   ├── geminiLiveService.ts # Gemini Live API integration
│   └── storageService.ts    # LocalStorage management
├── utils/               # Utility functions
│   └── audioUtils.ts    # Audio processing helpers
├── types.ts             # TypeScript type definitions
├── App.tsx              # Root component with view routing
├── main.tsx             # Application entry point
└── index.css            # Global styles and Tailwind imports
```

## Component Architecture

- **App.tsx**: Central state management and view routing (Dashboard, DebateLive, Summary, Settings)
- **Components**: Functional components with TypeScript props interfaces
- **Services**: Class-based services for complex stateful operations (GeminiLiveService)
- **Storage**: LocalStorage-based persistence for settings, stats, and history

## Key Patterns

- State management: React useState/useEffect hooks
- Props drilling for cross-component communication
- Callback pattern for child-to-parent communication
- Service layer pattern for API and audio handling
- Type-first development with explicit interfaces

## Styling Conventions

- Tailwind utility classes for all styling
- Custom colors: `void` (#18181b), `card` (#1e1e21)
- Responsive design with mobile-first approach
- Dark theme throughout
- Rounded corners: `rounded-[2rem]` for cards
- Accent color: lime-400 (#a3e635)

## File Naming

- Components: PascalCase (Dashboard.tsx)
- Services: camelCase with Service suffix (geminiLiveService.ts)
- Utils: camelCase with Utils suffix (audioUtils.ts)
- Types: camelCase (types.ts)
