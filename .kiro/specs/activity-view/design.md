# Activity View Design Document

## Overview

The Activity View is a comprehensive analytics and visualization interface that transforms raw session data into meaningful insights about user debate practice patterns. This view serves as the primary destination for users to understand their progress, identify trends, and stay motivated through visual feedback. The design emphasizes data-driven storytelling through interactive charts, calendar heat maps, and statistical summaries while maintaining the application's dark aesthetic with lime-400 accents.

## Architecture

### Component Structure

```
Activity (Main Container)
├── ActivityHeader (Time filters, export options)
├── StatisticsGrid (Key metrics overview)
│   ├── StatCard (Total Sessions)
│   ├── StatCard (Total Time)
│   ├── StatCard (Average Score)
│   └── StatCard (Current Streak)
├── ChartsSection
│   ├── ScoreTrendChart (Line chart)
│   ├── DurationDistributionChart (Bar chart)
│   └── TopicsBreakdownChart (Pie/Donut chart)
├── ActivityHeatMap (Calendar visualization)
├── TopPerformersSection (Best sessions)
└── SessionHistoryList (Detailed session list)
```

### State Management

The Activity component will manage the following state:

- `sessions`: Array of SessionHistoryItem from localStorage
- `timeFilter`: Current time period filter ('7d' | '30d' | '90d' | 'all')
- `filteredSessions`: Computed sessions based on timeFilter
- `statistics`: Computed stats from filteredSessions
- `expandedSessionId`: ID of currently expanded session in list

### Data Flow

1. Component mounts → Load sessions from localStorage via `getHistory()`
2. Apply time filter → Compute `filteredSessions`
3. Calculate derived statistics → Update `statistics` state
4. Render visualizations with filtered data
5. User interaction (filter change, session click) → Update state → Re-render

## Components and Interfaces

### Activity Component

```typescript
interface ActivityProps {
  // No props needed - reads directly from storage
}

interface ActivityState {
  sessions: SessionHistoryItem[];
  timeFilter: TimeFilter;
  expandedSessionId: string | null;
}

type TimeFilter = '7d' | '30d' | '90d' | 'all';
```

### StatCard Component

```typescript
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: 'lime' | 'indigo' | 'emerald' | 'amber';
}
```

### ScoreTrendChart Component

```typescript
interface ScoreTrendChartProps {
  sessions: SessionHistoryItem[];
  height?: number;
}
```

### ActivityHeatMap Component

```typescript
interface ActivityHeatMapProps {
  sessions: SessionHistoryItem[];
  startDate: Date;
  endDate: Date;
}

interface HeatMapCell {
  date: string;
  count: number;
  intensity: number; // 0-4 scale
}
```

### SessionListItem Component

```typescript
interface SessionListItemProps {
  session: SessionHistoryItem;
  isExpanded: boolean;
  onToggle: () => void;
  rank?: number; // For top performers
}
```

## Data Models

### Extended Session Statistics

```typescript
interface ActivityStatistics {
  totalSessions: number;
  totalMinutes: number;
  averageScore: number;
  averageDuration: number;
  currentStreak: number;
  longestStreak: number;
  bestScore: number;
  mostDebatedTopic: string;
  sessionsThisWeek: number;
  sessionsThisMonth: number;
}
```

### Chart Data Structures

```typescript
interface ChartDataPoint {
  x: string | number;
  y: number;
  label?: string;
}

interface ScoreTrendData {
  points: ChartDataPoint[];
  average: number;
  trend: 'improving' | 'declining' | 'stable';
}

interface DurationDistribution {
  ranges: {
    label: string; // "0-5 min", "5-10 min", etc.
    count: number;
  }[];
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Session data integrity across all visualizations

*For any* Activity View render with session data in localStorage, all displayed data in charts, lists, and heat maps should exactly match the stored session data without modification, mock data injection, or data loss.

**Validates: Requirements 1.2, 2.2, 3.2**

### Property 2: Time filter consistency across components

*For any* time filter selection and session dataset, all charts, statistics, heat maps, and lists should display data from the identical filtered session set, with no component showing data outside the selected time range.

**Validates: Requirements 4.2**

### Property 3: Total practice time calculation accuracy

*For any* set of sessions, the total practice time should equal the sum of all session durations, correctly converting seconds to minutes.

**Validates: Requirements 5.2**

### Property 4: Average score calculation accuracy

*For any* non-empty set of sessions, the average score should equal the sum of all session scores divided by the session count, rounded to a reasonable precision.

**Validates: Requirements 5.3**

### Property 5: Current streak calculation correctness

*For any* sequence of sessions ordered by date, the current streak should count consecutive calendar days with at least one session, starting from the most recent session and working backwards, ending when a day with no sessions is encountered.

**Validates: Requirements 5.4**

### Property 6: Heat map intensity proportionality

*For any* date range in the heat map, cells with sessions should have intensity values proportional to session count, with higher counts producing higher intensity values on a consistent scale.

**Validates: Requirements 3.3**

### Property 7: Session list sorting correctness

*For any* set of sessions displayed in the session list, sessions should be ordered by date in descending order (most recent first), with ties broken by session ID.

**Validates: Requirements 6.1**

### Property 8: Session display completeness

*For any* session displayed in the list or top performers section, the rendered output should contain the topic, date, duration, and score fields from the session data.

**Validates: Requirements 6.2, 7.2**

### Property 9: Top performers ranking with tie-breaking

*For any* set of sessions, the top 3 highest-scoring sessions should be correctly identified in descending score order, with ties broken by prioritizing more recent sessions (later dates first).

**Validates: Requirements 7.1, 7.5**

## Error Handling

### Data Loading Errors

- **localStorage unavailable**: Display error message with fallback to empty state
- **Corrupted session data**: Filter out invalid entries, log warning to console
- **Missing required fields**: Skip malformed sessions, continue with valid data

### Computation Errors

- **Division by zero**: Return 0 for averages when no sessions exist
- **Invalid dates**: Filter out sessions with unparseable dates
- **NaN results**: Replace with 0 or appropriate default value

### Rendering Errors

- **Chart library errors**: Wrap charts in error boundaries, show fallback message
- **Insufficient data**: Display "Need more data" message instead of empty charts
- **Overflow/underflow**: Clamp values to reasonable display ranges

## Testing Strategy

### Unit Testing

The Activity View will include unit tests for:

1. **Statistics calculation functions**
   - Test average score calculation with various session sets
   - Test streak calculation with different date patterns
   - Test duration aggregation and formatting

2. **Data filtering logic**
   - Test time filter application for each period
   - Test empty session array handling
   - Test edge cases (single session, sessions on same day)

3. **Chart data transformation**
   - Test session-to-chart-data conversion
   - Test grouping and aggregation logic
   - Test heat map intensity calculation

4. **Component rendering**
   - Test StatCard displays correct values
   - Test empty states render appropriately
   - Test session list expansion/collapse

### Property-Based Testing

Property-based tests will verify:

1. **Property 1: Session data integrity**
   - Generate random session arrays
   - Verify displayed data matches input exactly
   - Check no mock data is injected

2. **Property 2: Time filter consistency**
   - Generate sessions across various dates
   - Apply each time filter
   - Verify all components show same filtered set

3. **Property 3: Statistics calculation accuracy**
   - Generate random session sets
   - Calculate expected statistics manually
   - Verify component calculations match

4. **Property 8: Streak calculation correctness**
   - Generate various date sequences
   - Calculate expected streak
   - Verify streak calculation matches

### Integration Testing

- Test Activity View navigation from sidebar
- Test filter changes update all visualizations
- Test session expansion shows correct details
- Test responsive layout on different screen sizes

## Visual Design Specifications

### Color Palette

- **Primary Background**: `#18181b` (void)
- **Card Background**: `#1e1e21` (card)
- **Accent**: `#a3e635` (lime-400)
- **Secondary Accent**: `#6366f1` (indigo-500)
- **Success**: `#10b981` (emerald-500)
- **Text Primary**: `#ffffff` (white)
- **Text Secondary**: `#94a3b8` (slate-400)

### Typography

- **Stat Values**: 4xl-7xl, font-black, tracking-tighter
- **Card Titles**: lg-xl, font-bold
- **Labels**: xs-sm, font-medium, uppercase, tracking-wider
- **Body Text**: sm-base, font-normal

### Spacing & Layout

- **Card Padding**: p-6 to p-8
- **Card Radius**: rounded-[2rem]
- **Grid Gap**: gap-6
- **Section Spacing**: mb-6 to mb-8

### Chart Styling

- **Line Charts**: lime-400 stroke, 2px width, smooth curves
- **Bar Charts**: lime-400 fill with opacity gradient
- **Heat Map**: 5-level intensity scale from slate-800 to lime-400
- **Tooltips**: Dark background, white text, rounded-lg, shadow-xl

### Animations

- **View Transition**: animate-fadeIn (0.3s ease-in-out)
- **Filter Change**: Smooth data transition (0.5s)
- **Hover Effects**: Scale 1.02, shadow increase
- **Chart Animations**: Staggered entry (0.1s delay per element)

## Implementation Notes

### Chart Library Selection

Use **Recharts** for React-based charting:
- Native React components
- Responsive by default
- Customizable styling
- Good TypeScript support
- Lightweight (~100kb)

Alternative: **Chart.js** with react-chartjs-2 wrapper

### Heat Map Implementation

Custom implementation using CSS Grid:
- 7 columns (days of week)
- Dynamic rows based on date range
- CSS variables for intensity colors
- Tooltip on hover using absolute positioning

### Performance Considerations

- **Memoization**: Use `useMemo` for expensive calculations (statistics, filtered sessions)
- **Lazy Loading**: Render charts only when visible (Intersection Observer)
- **Virtualization**: Use virtual scrolling for long session lists (react-window)
- **Debouncing**: Debounce filter changes to avoid excessive re-renders

### Responsive Breakpoints

- **Mobile**: < 768px (single column, stacked cards)
- **Tablet**: 768px - 1024px (2 columns)
- **Desktop**: > 1024px (3 columns, full layout)

### Accessibility

- **ARIA labels**: All interactive elements
- **Keyboard navigation**: Tab through filters and sessions
- **Screen reader**: Announce filter changes and statistics
- **Color contrast**: Ensure 4.5:1 ratio for text
- **Focus indicators**: Visible focus rings on interactive elements

## Future Enhancements

1. **Export functionality**: Download activity data as CSV/PDF
2. **Goal setting**: Set practice goals and track progress
3. **Comparison view**: Compare performance across time periods
4. **Topic insights**: Deep dive into performance by topic category
5. **Social features**: Share achievements, compare with friends
6. **Advanced filters**: Filter by score range, duration, style
7. **Predictive analytics**: Forecast future performance trends
8. **Custom date ranges**: Select arbitrary start/end dates
