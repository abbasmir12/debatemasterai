import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SessionHistoryItem } from '../types';
import { transformSessionsToScoreData } from '../utils/chartUtils';

interface ScoreTrendChartProps {
  sessions: SessionHistoryItem[];
}

export default function ScoreTrendChart({ sessions }: ScoreTrendChartProps) {
  // Handle insufficient data case
  if (sessions.length < 2) {
    return (
      <div className="flex items-center justify-center h-48 md:h-64 text-slate-400">
        <div className="text-center px-4">
          <p className="text-base md:text-lg font-medium">Not enough data yet</p>
          <p className="text-xs md:text-sm mt-2">Complete at least 2 sessions to see your score trend</p>
        </div>
      </div>
    );
  }

  const chartData = transformSessionsToScoreData(sessions);

  return (
    <div className="w-full h-48 md:h-64 lg:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8"
            style={{ fontSize: '10px' }}
            tick={{ fontSize: 10 }}
          />
          <YAxis 
            stroke="#94a3b8"
            style={{ fontSize: '10px' }}
            domain={[0, 100]}
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
            formatter={(value: number, _name: string, props: any) => {
              return [
                <span key="score">
                  Score: <span className="font-bold text-lime-400">{value}</span>
                </span>,
                <span key="topic" className="block text-sm text-slate-400 mt-1">
                  {props.payload.topic}
                </span>
              ];
            }}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#a3e635" 
            strokeWidth={2}
            dot={{ fill: '#a3e635', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
