import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SessionHistoryItem } from '../types';
import { groupSessionsByDuration } from '../utils/chartUtils';

interface DurationDistributionChartProps {
  sessions: SessionHistoryItem[];
}

export default function DurationDistributionChart({ sessions }: DurationDistributionChartProps) {
  // Handle insufficient data case
  if (sessions.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 md:h-64 text-slate-400">
        <div className="text-center px-4">
          <p className="text-base md:text-lg font-medium">No session data</p>
          <p className="text-xs md:text-sm mt-2">Complete some sessions to see duration distribution</p>
        </div>
      </div>
    );
  }

  const chartData = groupSessionsByDuration(sessions);

  return (
    <div className="w-full h-48 md:h-64 lg:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis 
            dataKey="range" 
            stroke="#94a3b8"
            style={{ fontSize: '10px' }}
            tick={{ fontSize: 10 }}
          />
          <YAxis 
            stroke="#94a3b8"
            style={{ fontSize: '10px' }}
            allowDecimals={false}
            tick={{ fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e1e21',
              border: '1px solid #334155',
              borderRadius: '0.5rem',
              color: '#ffffff'
            }}
            labelStyle={{ color: '#a3e635' }}
            formatter={(value: number) => [
              <span key="count" className="font-bold text-lime-400">
                {value} {value === 1 ? 'session' : 'sessions'}
              </span>,
              ''
            ]}
            labelFormatter={(label) => `Duration: ${label}`}
          />
          <Bar 
            dataKey="count" 
            fill="#a3e635"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
