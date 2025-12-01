import { useMemo, useState } from 'react';
import { SessionHistoryItem } from '../types';

/**
 * ActivityHeatMap Component
 * Displays a calendar heat map showing activity frequency across days
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 */

interface ActivityHeatMapProps {
  sessions: SessionHistoryItem[];
}

interface HeatMapCell {
  date: Date;
  dateString: string;
  count: number;
  intensity: number; // 0-4 scale
}

function ActivityHeatMap({ sessions }: ActivityHeatMapProps) {
  const [hoveredCell, setHoveredCell] = useState<HeatMapCell | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Calculate date range: last 12 weeks - Requirement 3.1
  const { startDate, endDate } = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (12 * 7)); // 12 weeks = 84 days
    return { startDate: start, endDate: end };
  }, []);

  // Generate heat map cells with session counts and intensity - Requirements 3.1, 3.2, 3.3
  const heatMapCells = useMemo(() => {
    // Count sessions per date
    const sessionCountByDate = new Map<string, number>();
    
    sessions.forEach((session) => {
      const sessionDate = new Date(session.date);
      const dateKey = sessionDate.toISOString().split('T')[0] ?? ''; // YYYY-MM-DD
      if (dateKey) {
        sessionCountByDate.set(dateKey, (sessionCountByDate.get(dateKey) || 0) + 1);
      }
    });

    // Find max count for intensity calculation
    const maxCount = Math.max(...Array.from(sessionCountByDate.values()), 1);

    // Generate cells for each date in range
    const cells: HeatMapCell[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0] ?? '';
      const count = sessionCountByDate.get(dateKey) || 0;
      
      // Calculate intensity on 0-4 scale based on session count - Requirement 3.3
      let intensity = 0;
      if (count > 0) {
        // Scale intensity: 1-4 based on count relative to max
        const ratio = count / maxCount;
        if (ratio >= 0.75) intensity = 4;
        else if (ratio >= 0.5) intensity = 3;
        else if (ratio >= 0.25) intensity = 2;
        else intensity = 1;
      }

      cells.push({
        date: new Date(currentDate),
        dateString: dateKey,
        count,
        intensity,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return cells;
  }, [sessions, startDate, endDate]);

  // Get color class based on intensity - Requirement 3.3, 3.4
  const getIntensityColor = (intensity: number): string => {
    switch (intensity) {
      case 0:
        return 'bg-slate-800'; // No activity
      case 1:
        return 'bg-lime-400/20';
      case 2:
        return 'bg-lime-400/40';
      case 3:
        return 'bg-lime-400/70';
      case 4:
        return 'bg-lime-400'; // Highest activity
      default:
        return 'bg-slate-800';
    }
  };

  // Format date for tooltip
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Handle cell hover - Requirement 3.5
  const handleCellHover = (cell: HeatMapCell, event: React.MouseEvent) => {
    setHoveredCell(cell);
    setTooltipPosition({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleCellLeave = () => {
    setHoveredCell(null);
  };

  // Organize cells into weeks (rows of 7 days)
  const weeks: HeatMapCell[][] = [];
  for (let i = 0; i < heatMapCells.length; i += 7) {
    weeks.push(heatMapCells.slice(i, i + 7));
  }

  return (
    <div className="bg-card border border-white/5 rounded-[2rem] p-4 md:p-6 hover:border-white/10 transition-colors duration-300">
      <h2 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Activity Heat Map</h2>
      <p className="text-xs md:text-sm text-slate-400 mb-4 md:mb-6">Last 12 weeks of practice activity</p>

      {/* Heat Map Grid - Requirements 3.1, 8.3 */}
      <div className="overflow-x-auto -mx-2 px-2">
        <div className="space-y-1 min-w-max">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex gap-1">
              {week.map((cell) => (
                <div
                  key={cell.dateString}
                  className={`w-3 h-3 md:w-4 md:h-4 rounded-sm ${getIntensityColor(
                    cell.intensity
                  )} transition-all duration-200 hover:scale-125 hover:ring-2 hover:ring-lime-400 cursor-pointer touch-manipulation`}
                  onMouseEnter={(e) => handleCellHover(cell, e)}
                  onMouseLeave={handleCellLeave}
                  onTouchStart={(e) => handleCellHover(cell, e as any)}
                  onTouchEnd={handleCellLeave}
                  title={`${formatDate(cell.date)}: ${cell.count} session${
                    cell.count !== 1 ? 's' : ''
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 md:mt-6 text-xs text-slate-400">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm bg-slate-800" />
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm bg-lime-400/20" />
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm bg-lime-400/40" />
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm bg-lime-400/70" />
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm bg-lime-400" />
        </div>
        <span>More</span>
      </div>

      {/* Tooltip - Requirement 3.5 */}
      {hoveredCell && (
        <div
          className="fixed z-50 bg-void border border-lime-400/20 rounded-lg px-3 py-2 shadow-xl pointer-events-none"
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y + 10}px`,
          }}
        >
          <div className="text-xs font-medium text-white">
            {formatDate(hoveredCell.date)}
          </div>
          <div className="text-xs text-slate-400">
            {hoveredCell.count} session{hoveredCell.count !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityHeatMap;
