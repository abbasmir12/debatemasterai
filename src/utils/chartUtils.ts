import { SessionHistoryItem } from '../types';

/**
 * Transform session data into chart data points for score trend visualization
 */
export interface ScoreChartDataPoint {
  date: string;
  score: number;
  topic: string;
  dateValue: number;
}

export function transformSessionsToScoreData(sessions: SessionHistoryItem[]): ScoreChartDataPoint[] {
  return sessions
    .map(session => {
      const sessionDate = new Date(session.date);
      return {
        date: sessionDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        score: session.score,
        topic: session.topic,
        dateValue: sessionDate.getTime()
      };
    })
    .sort((a, b) => a.dateValue - b.dateValue);
}

/**
 * Group sessions into duration ranges for distribution chart
 */
export interface DurationRange {
  range: string;
  count: number;
  sessions: SessionHistoryItem[];
}

export function groupSessionsByDuration(sessions: SessionHistoryItem[]): DurationRange[] {
  const ranges = [
    { min: 0, max: 5, label: '0-5 min' },
    { min: 5, max: 10, label: '5-10 min' },
    { min: 10, max: 15, label: '10-15 min' },
    { min: 15, max: Infinity, label: '15+ min' }
  ];

  return ranges.map(range => {
    const sessionsInRange = sessions.filter(session => {
      const minutes = session.durationSeconds / 60;
      return minutes >= range.min && minutes < range.max;
    });

    return {
      range: range.label,
      count: sessionsInRange.length,
      sessions: sessionsInRange
    };
  });
}

/**
 * Calculate chart dimensions based on container size
 */
export function getChartDimensions(containerWidth: number) {
  const isMobile = containerWidth < 768;
  return {
    width: containerWidth,
    height: isMobile ? 250 : 300
  };
}
