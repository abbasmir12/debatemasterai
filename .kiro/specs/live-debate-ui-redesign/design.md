# Design Document

## Overview

This design document outlines the technical approach for redesigning the DebateMaster AI live debate interface. The redesign focuses on transforming the main content area with two key visual components: a WebGL-based voice visualizer and a cascading transcript display. The existing header (topic, timer, exit) and footer (end session button) remain unchanged, ensuring functional continuity while dramatically enhancing visual engagement.

## Architecture

### Component Structure

```
DebateLive (existing)
├── Header (unchanged)
├── Main Content Area (REDESIGNED)
│   ├── VoiceVisualizer (new WebGL component)
│   └── CascadingTranscript (new component)
└── Footer (unchanged)
```

### Data Flow

1. **Audio Input** → GeminiLiveService → `audioLevel` state → VoiceVisualizer
2. **Transcript Data** → GeminiLiveService → `messages` state → CascadingTranscript
3. **Speaker Detection** → Derived from message role → Both components for color theming

## Components and Interfaces

### VoiceVisualizer Component

A WebGL-based component that renders dynamic visual effects responding to audio input.

```typescript
interface VoiceVisualizerProps {
  audioLevel: number;        // 0-100, current audio amplitude
  isActive: boolean;         // Whether debate session is connected
  activeSpeaker: 'user' | 'model' | 'idle'; // Current speaker for color theming
}
```

**Responsibilities:**
- Initialize WebGL context and shaders
- Render circular/wave-based animations
- Update animation based on audioLevel prop
- Transition colors based on activeSpeaker
- Display gradient background lighting
- Handle cleanup and resource disposal

### CascadingTranscript Component

A component that displays the most recent transcript lines with progressive fade and shortening effects.

```typescript
interface TranscriptLine {
  id: string;
  text: string;
  speaker: 'user' | 'model';
  timestamp: number;
}

interface CascadingTranscriptProps {
  messages: ChatMessage[];   // Full message history from parent
  activeSpeaker: 'user' | 'model' | 'idle'; // Current speaker
}
```

**Responsibilities:**
- Extract the 3 most recent final messages
- Apply progressive opacity (100%, 60%, 30%)
- Apply progressive width (100%, 85%, 70%)
- Truncate text with ellipsis when needed
- Animate transitions between states
- Clear lines when speaker changes

### DebateLive Component Updates

The existing DebateLive component will be modified to:
- Replace the scrolling messages container with the new visual components
- Derive `activeSpeaker` from the most recent message
- Pass appropriate props to VoiceVisualizer and CascadingTranscript
- Maintain all existing functionality (connection, timing, error handling)

## Data Models

### Speaker State

```typescript
type Speaker = 'user' | 'model' | 'idle';

// Derived from messages array
function getActiveSpeaker(messages: ChatMessage[]): Speaker {
  const recentMessages = messages.filter(m => m.role !== 'system');
  if (recentMessages.length === 0) return 'idle';
  
  const lastMessage = recentMessages[recentMessages.length - 1];
  return lastMessage?.role === 'user' ? 'user' : 'model';
}
```

### Color Schemes

```typescript
interface ColorScheme {
  primary: string;      // Main visualizer color
  secondary: string;    // Accent color
  gradient: string[];   // Background gradient stops
}

const COLOR_SCHEMES: Record<Speaker, ColorScheme> = {
  user: {
    primary: '#a3e635',      // lime-400
    secondary: '#84cc16',    // lime-500
    gradient: ['#365314', '#3f6212', '#4d7c0f'] // lime dark tones
  },
  model: {
    primary: '#a78bfa',      // violet-400
    secondary: '#8b5cf6',    // violet-500
    gradient: ['#4c1d95', '#5b21b6', '#6d28d9'] // violet dark tones
  },
  idle: {
    primary: '#94a3b8',      // slate-400
    secondary: '#64748b',    // slate-500
    gradient: ['#1e293b', '#334155', '#475569'] // slate dark tones
  }
};
```

## 
## 
WebGL Implementation Details

### Shader Architecture

**Vertex Shader:**
```glsl
attribute vec2 position;
varying vec2 vUv;

void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
```

**Fragment Shader (Circular Wave Pattern):**
```glsl
precision mediump float;
uniform float time;
uniform float audioLevel;
uniform vec3 primaryColor;
uniform vec3 secondaryColor;
varying vec2 vUv;

void main() {
  vec2 center = vec2(0.5, 0.5);
  float dist = distance(vUv, center);
  
  // Create pulsing circle based on audio level
  float radius = 0.2 + (audioLevel * 0.3);
  float wave = sin(dist * 20.0 - time * 2.0) * 0.5 + 0.5;
  float circle = smoothstep(radius, radius - 0.05, dist);
  
  // Mix colors based on wave pattern
  vec3 color = mix(primaryColor, secondaryColor, wave);
  float alpha = circle * (0.5 + audioLevel * 0.5);
  
  gl_FragColor = vec4(color, alpha);
}
```

### Animation Loop

```typescript
class VoiceVisualizerRenderer {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private animationFrameId: number | null = null;
  private startTime: number = Date.now();
  
  render(audioLevel: number, colorScheme: ColorScheme): void {
    const time = (Date.now() - this.startTime) / 1000;
    
    // Update uniforms
    this.gl.uniform1f(this.uniforms.time, time);
    this.gl.uniform1f(this.uniforms.audioLevel, audioLevel / 100);
    this.gl.uniform3fv(this.uniforms.primaryColor, hexToRgb(colorScheme.primary));
    this.gl.uniform3fv(this.uniforms.secondaryColor, hexToRgb(colorScheme.secondary));
    
    // Draw
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    
    // Continue loop
    this.animationFrameId = requestAnimationFrame(() => this.render(audioLevel, colorScheme));
  }
  
  dispose(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    // Clean up WebGL resources
    this.gl.deleteProgram(this.program);
  }
}
```

## Cascading Transcript Logic

### Line Management

```typescript
interface DisplayLine {
  text: string;
  opacity: number;
  widthPercent: number;
  key: string;
}

function getDisplayLines(messages: ChatMessage[]): DisplayLine[] {
  // Filter to final messages only (exclude interim)
  const finalMessages = messages.filter(m => m.isFinal && m.role !== 'system');
  
  // Take last 3 messages
  const recentMessages = finalMessages.slice(-3);
  
  // Map to display lines with progressive fade/shortening
  return recentMessages.map((msg, index) => {
    const position = recentMessages.length - 1 - index; // 0 = newest, 2 = oldest
    
    const opacities = [1.0, 0.6, 0.3];
    const widths = [100, 85, 70];
    
    return {
      text: msg.text,
      opacity: opacities[position] ?? 0.3,
      widthPercent: widths[position] ?? 70,
      key: msg.id
    };
  }).reverse(); // Reverse so newest is at top
}
```

### Text Truncation

```typescript
function truncateText(text: string, maxWidth: number, fontSize: number): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return text;
  
  ctx.font = `${fontSize}px Inter, sans-serif`;
  const metrics = ctx.measureText(text);
  
  if (metrics.width <= maxWidth) {
    return text;
  }
  
  // Binary search for optimal length
  let left = 0;
  let right = text.length;
  let result = text;
  
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    const truncated = text.slice(0, mid) + '...';
    const width = ctx.measureText(truncated).width;
    
    if (width <= maxWidth) {
      result = truncated;
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  
  return result;
}
```

### Speaker Change Detection

```typescript
function detectSpeakerChange(
  prevMessages: ChatMessage[],
  currentMessages: ChatMessage[]
): boolean {
  const prevSpeaker = getActiveSpeaker(prevMessages);
  const currentSpeaker = getActiveSpeaker(currentMessages);
  
  return prevSpeaker !== currentSpeaker;
}
```

## Layout and Styling

### Main Content Area Layout

```
┌─────────────────────────────────────┐
│         Header (unchanged)          │
├─────────────────────────────────────┤
│                                     │
│                                     │
│         [Voice Visualizer]          │
│          (WebGL Canvas)             │
│                                     │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  Latest transcript line       │  │ ← 100% opacity, 100% width
│  └───────────────────────────────┘  │
│   ┌─────────────────────────────┐   │ ← 60% opacity, 85% width
│   │ Previous line (shorter)     │   │
│   └─────────────────────────────┘   │
│    ┌───────────────────────────┐    │ ← 30% opacity, 70% width
│    │ Oldest line (shortest)    │    │
│    └───────────────────────────┘    │
│                                     │
├─────────────────────────────────────┤
│         Footer (unchanged)          │
└─────────────────────────────────────┘
```

### CSS Styling

```css
/* Voice Visualizer Container */
.voice-visualizer-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1;
  margin: 0 auto;
}

/* WebGL Canvas */
.voice-visualizer-canvas {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

/* Gradient Background */
.gradient-background {
  position: absolute;
  inset: -20%;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.6;
  transition: background 500ms ease-in-out;
  z-index: -1;
}

/* Cascading Transcript Container */
.cascading-transcript {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 48px;
  padding: 0 24px;
}

/* Transcript Line */
.transcript-line {
  text-align: center;
  font-size: 18px;
  line-height: 1.4;
  transition: all 300ms ease-in-out;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .voice-visualizer-container {
    max-width: 280px;
  }
  
  .transcript-line {
    font-size: 16px;
  }
  
  .cascading-transcript {
    gap: 8px;
    margin-top: 32px;
  }
}
```

## Error Handling

### WebGL Fallback

```typescript
function initializeVisualizer(canvas: HTMLCanvasElement): Renderer {
  try {
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      throw new Error('WebGL not supported');
    }
    return new WebGLRenderer(gl);
  } catch (error) {
    console.warn('WebGL unavailable, falling back to Canvas 2D:', error);
    return new Canvas2DRenderer(canvas.getContext('2d')!);
  }
}
```

### Canvas 2D Fallback Implementation

```typescript
class Canvas2DRenderer implements Renderer {
  private ctx: CanvasRenderingContext2D;
  
  render(audioLevel: number, colorScheme: ColorScheme): void {
    const { width, height } = this.ctx.canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, width, height);
    
    // Draw pulsing circle
    const radius = 80 + (audioLevel * 1.2);
    const gradient = this.ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radius
    );
    
    gradient.addColorStop(0, colorScheme.primary);
    gradient.addColorStop(1, colorScheme.secondary + '00'); // Transparent
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
}
```

## Testing Strategy

### Unit Tests

1. **VoiceVisualizer Component**
   - Test WebGL context initialization
   - Test fallback to Canvas 2D when WebGL unavailable
   - Test color scheme transitions
   - Test resource cleanup on unmount

2. **CascadingTranscript Component**
   - Test line extraction from messages
   - Test opacity and width calculations
   - Test text truncation logic
   - Test speaker change detection and line clearing

3. **Utility Functions**
   - Test `getActiveSpeaker` with various message arrays
   - Test `truncateText` with different text lengths
   - Test `hexToRgb` color conversion

### Integration Tests

1. Test VoiceVisualizer responds to audioLevel changes
2. Test CascadingTranscript updates when new messages arrive
3. Test speaker change triggers color transitions and line clearing
4. Test mobile responsive behavior

### Visual Regression Tests

1. Capture screenshots of visualizer in different states (idle, user speaking, AI speaking)
2. Capture screenshots of cascading transcript with 1, 2, and 3 lines
3. Verify gradient backgrounds render correctly
4. Verify mobile layouts match design specifications

## Corr
ectness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Audio level responsiveness

*For any* audio level value, when the audio level changes, the voice visualizer SHALL update its visual intensity proportionally to the audio level magnitude.

**Validates: Requirements 1.2, 1.3**

### Property 2: Cascading line progression

*For any* sequence of messages, when a new message is added, the existing lines SHALL move down one position with each line receiving the styling (opacity and width) of its new position.

**Validates: Requirements 3.2, 3.3**

### Property 3: Maximum three lines displayed

*For any* message history, the cascading transcript SHALL display at most three lines, removing the oldest line when a fourth would appear.

**Validates: Requirements 3.4**

### Property 4: Speaker change clears transcript

*For any* message sequence, when the active speaker changes from user to model or model to user, all existing transcript lines SHALL be cleared before displaying the new speaker's text.

**Validates: Requirements 3.5**

### Property 5: Text truncation with ellipsis

*For any* text that exceeds the calculated line width, the system SHALL truncate the text and append an ellipsis to indicate continuation.

**Validates: Requirements 4.4**

### Property 6: Line width percentages remain consistent

*For any* viewport size, the relative width percentages of transcript lines (100%, 85%, 70%) SHALL remain constant regardless of screen dimensions.

**Validates: Requirements 7.3**

### Property 7: Speaker-to-color mapping

*For any* speaker state (user, model, or idle), the voice visualizer and gradient SHALL use the color scheme corresponding to that speaker.

**Validates: Requirements 2.3, 2.4, 2.5, 5.1, 5.2, 5.4**

## Performance Considerations

### WebGL Optimization

- Use a single shader program for all rendering
- Minimize uniform updates per frame
- Reuse geometry buffers across frames
- Target 60 FPS for smooth animations

### React Optimization

```typescript
// Memoize VoiceVisualizer to prevent unnecessary re-renders
const VoiceVisualizer = React.memo(({ audioLevel, isActive, activeSpeaker }: Props) => {
  // Component implementation
}, (prevProps, nextProps) => {
  return prevProps.audioLevel === nextProps.audioLevel &&
         prevProps.isActive === nextProps.isActive &&
         prevProps.activeSpeaker === nextProps.activeSpeaker;
});

// Memoize CascadingTranscript with custom comparison
const CascadingTranscript = React.memo(({ messages, activeSpeaker }: Props) => {
  // Component implementation
}, (prevProps, nextProps) => {
  const prevLines = getDisplayLines(prevProps.messages);
  const nextLines = getDisplayLines(nextProps.messages);
  
  return JSON.stringify(prevLines) === JSON.stringify(nextLines) &&
         prevProps.activeSpeaker === nextProps.activeSpeaker;
});
```

### Memory Management

- Dispose WebGL resources on component unmount
- Cancel animation frames when component unmounts
- Clear message history periodically if it grows too large
- Use weak references for cached canvas measurements

## Accessibility Considerations

### Screen Reader Support

```typescript
// Add ARIA labels to visualizer
<canvas
  ref={canvasRef}
  className="voice-visualizer-canvas"
  role="img"
  aria-label={`Voice visualization showing ${activeSpeaker} speaking at ${audioLevel}% volume`}
/>

// Add ARIA live region for transcript
<div
  className="cascading-transcript"
  role="log"
  aria-live="polite"
  aria-atomic="false"
>
  {displayLines.map(line => (
    <div key={line.key} aria-label={`${line.speaker}: ${line.text}`}>
      {line.text}
    </div>
  ))}
</div>
```

### Reduced Motion Support

```typescript
// Detect prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Disable animations if user prefers reduced motion
const transitionDuration = prefersReducedMotion ? 0 : 300;

// Simplify visualizer animations
if (prefersReducedMotion) {
  // Use static circle instead of animated waves
  // Reduce color transition speed
}
```

## Migration Strategy

### Phase 1: Component Development
1. Create VoiceVisualizer component with WebGL implementation
2. Create CascadingTranscript component
3. Develop and test components in isolation

### Phase 2: Integration
1. Modify DebateLive to use new components
2. Replace existing message display with cascading transcript
3. Add speaker detection logic
4. Test integration with existing functionality

### Phase 3: Polish
1. Fine-tune animations and transitions
2. Optimize performance
3. Add accessibility features
4. Test on multiple devices and browsers

### Rollback Plan

If issues arise, the original message display can be restored by:
1. Reverting DebateLive component changes
2. Keeping the original scrolling message container
3. Removing VoiceVisualizer and CascadingTranscript imports

The modular design ensures the new components can be easily removed without affecting core functionality.

## Browser Compatibility

### Minimum Requirements

- **WebGL**: Chrome 56+, Firefox 51+, Safari 11+, Edge 79+
- **Canvas 2D**: All modern browsers (fallback)
- **CSS Transitions**: All modern browsers
- **requestAnimationFrame**: All modern browsers

### Polyfills

No polyfills required for target browsers. For older browsers, the Canvas 2D fallback provides basic functionality.

## Future Enhancements

### Potential Additions

1. **Multiple Visual Styles**: Allow users to choose between circular, particle, and wave visualizations
2. **Customizable Colors**: Let users customize color schemes
3. **Audio Waveform**: Display actual audio waveform instead of abstract visualization
4. **Transcript Export**: Allow users to copy or export the full transcript
5. **Replay Mode**: Visualize past debates with synchronized audio and transcript

These enhancements are out of scope for the initial implementation but can be added incrementally.
