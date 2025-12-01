/**
 * Dashboard component - Main interface for viewing statistics and starting debates
 */

import { useState, useEffect } from 'react';
import { DebateStyle, UserStats, SessionHistoryItem } from '../types';
import { getStats, getHistory } from '../services/storageService';

/**
 * Props for Dashboard component
 */
interface DashboardProps {
  onStartDebate: (topic: string, style: DebateStyle, duration: number) => void;
  onNavigateToPersona?: () => void;
}

/**
 * Dashboard component displaying statistics, session controls, and history
 */
export default function Dashboard({ onStartDebate, onNavigateToPersona }: DashboardProps) {
  // Component state
  const [stats, setStats] = useState<UserStats | null>(null);
  const [history, setHistory] = useState<SessionHistoryItem[]>([]);
  const [topic, setTopic] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<DebateStyle>(DebateStyle.COACH);
  const [duration, setDuration] = useState<number>(5);

  // Load stats and history on mount
  useEffect(() => {
    const loadedStats = getStats();
    const loadedHistory = getHistory();
    setStats(loadedStats);
    setHistory(loadedHistory);
  }, []);

  // Handle start debate button click
  const handleStartDebate = () => {
    if (topic.trim()) {
      onStartDebate(topic.trim(), selectedStyle, duration);
    }
  };

  // Calculate win rate
  const winRate = stats && stats.totalSessions > 0 
    ? Math.round((stats.totalSessions * 0.7) * 100) / 100 // Mock calculation
    : 0;

  // Calculate average scores from recent sessions
  const recentSessions = history.slice(0, 10);
  const avgVocabulary = recentSessions.length > 0
    ? Math.round(recentSessions.reduce((sum, s) => sum + (s.vocabularyScore || 0), 0) / recentSessions.length)
    : 0;
  const avgClarity = recentSessions.length > 0
    ? Math.round(recentSessions.reduce((sum, s) => sum + (s.clarityScore || 0), 0) / recentSessions.length)
    : 0;
  const avgPersuasion = recentSessions.length > 0
    ? Math.round(recentSessions.reduce((sum, s) => sum + (s.persuasionScore || 0), 0) / recentSessions.length)
    : 0;

  // Calculate improvement rate (comparing first half vs second half of sessions)
  const calculateImprovementRate = () => {
    if (history.length < 4) return 0;
    const halfPoint = Math.floor(history.length / 2);
    const recentHalf = history.slice(0, halfPoint);
    const olderHalf = history.slice(halfPoint);
    
    const recentAvg = recentHalf.reduce((sum, s) => sum + s.score, 0) / recentHalf.length;
    const olderAvg = olderHalf.reduce((sum, s) => sum + s.score, 0) / olderHalf.length;
    
    return Math.round(((recentAvg - olderAvg) / olderAvg) * 100);
  };

  const improvementRate = calculateImprovementRate();

  return (
    <div className="w-full h-full overflow-y-auto p-4 md:p-8 scrollbar-thin">
      {/* 3-column responsive grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        
        {/* Row 1, Column 1: Performance Score Card */}
        <div className="bg-lime-400 rounded-[2rem] p-8 relative overflow-hidden h-[300px] flex flex-col justify-center">
          <div className="relative z-10">
            <div className="text-void text-sm font-medium uppercase tracking-wider mb-2">
              Performance Score
            </div>
            <div className="text-void text-7xl font-black tracking-tighter mb-4">
              {history.length > 0 
                ? Math.round(history.reduce((sum, session) => sum + session.score, 0) / history.length)
                : 0
              }
            </div>
            <div className="space-y-1 text-void/80 text-sm">
              <div>{stats?.totalSessions || 0} sessions</div>
              <div>{stats?.totalMinutes || 0} minutes</div>
              <div>{winRate}% win rate</div>
            </div>
          </div>
          {/* Decorative circular elements */}
          <div className="absolute -right-12 -bottom-12 w-48 h-48 border-4 border-void/10 rounded-full" />
          <div className="absolute -right-6 -top-6 w-32 h-32 border-4 border-void/10 rounded-full" />
        </div>

        {/* Row 1, Column 2: Session Start Form */}
        <div className="bg-card border border-white/5 rounded-[2rem] p-6 h-[300px] flex flex-col">
          <h2 className="text-white text-lg font-bold mb-3">Start New Debate</h2>
          
          {/* Topic Input */}
          <div className="mb-2.5">
            <label className="text-slate-400 text-xs font-medium mb-1 block">
              Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter debate topic..."
              className="w-full bg-void/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-lime-400 transition"
            />
          </div>

          {/* Style Selection */}
          <div className="mb-2.5">
            <label className="text-slate-400 text-xs font-medium mb-1 block">
              Style
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedStyle(DebateStyle.COACH)}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition ${
                  selectedStyle === DebateStyle.COACH
                    ? 'bg-indigo-500 text-white'
                    : 'bg-void/50 border border-white/10 text-slate-400 hover:border-slate-500'
                }`}
              >
                Coach
              </button>
              <button
                onClick={() => setSelectedStyle(DebateStyle.AGGRESSIVE)}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition ${
                  selectedStyle === DebateStyle.AGGRESSIVE
                    ? 'bg-red-500 text-white'
                    : 'bg-void/50 border border-white/10 text-slate-400 hover:border-slate-500'
                }`}
              >
                Fierce
              </button>
            </div>
          </div>

          {/* Duration Slider */}
          <div className="mb-3">
            <label className="text-slate-400 text-xs font-medium mb-1 block">
              Duration: <span className="text-white font-mono">{duration} min</span>
            </label>
            <input
              type="range"
              min="1"
              max="15"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-lime-400"
            />
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartDebate}
            disabled={!topic.trim()}
            className={`w-full py-2.5 rounded-lg text-sm font-bold transition mt-auto ${
              topic.trim()
                ? 'bg-lime-400 text-void hover:bg-lime-500'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            Start Debate
          </button>
        </div>

        {/* Row 1, Column 3: History Card */}
        <div className="bg-slate-200 rounded-[2rem] p-8 h-[300px] flex flex-col">
          {/* Tabs */}
          <div className="flex gap-4 mb-4 border-b border-slate-300">
            <button className="text-void text-base font-bold pb-2 border-b-2 border-void">
              Recent
            </button>
            <button className="text-slate-500 text-base font-medium pb-2 border-b-2 border-transparent hover:text-slate-700 transition">
              Saved
            </button>
          </div>
          
          {history.length === 0 ? (
            <div className="text-slate-600 text-center py-8 flex-1 flex items-center justify-center">
              <p className="text-sm">No sessions yet. Start your first debate!</p>
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto scrollbar-custom pr-2 flex-1">
              {history.slice(0, 5).map((session) => (
                <div
                  key={session.id}
                  className="bg-white rounded-xl p-3 border border-slate-300"
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-void font-semibold text-xs line-clamp-2">
                      {session.topic}
                    </div>
                    <div className="text-lime-600 font-bold text-base ml-2">
                      {session.score}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{Math.floor(session.durationSeconds / 60)} min</span>
                    <span>{new Date(session.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Row 2, Column 1: Improvement Rate Card */}
        <div className="bg-card border border-white/5 rounded-[2rem] p-8 relative overflow-hidden h-[280px] flex flex-col justify-center">
          <div className="relative z-10">
            <div className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-4">
              Improvement Rate
            </div>
            <div className="flex items-baseline gap-2 mb-6">
              <div className="text-white text-4xl font-bold">
                {improvementRate > 0 ? '+' : ''}{improvementRate}%
              </div>
              {history.length >= 4 && (
                <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                  improvementRate > 0 
                    ? 'text-emerald-400 bg-emerald-400/10' 
                    : improvementRate < 0 
                    ? 'text-red-400 bg-red-400/10'
                    : 'text-slate-400 bg-slate-400/10'
                }`}>
                  {improvementRate > 0 ? '↑' : improvementRate < 0 ? '↓' : '→'} vs earlier sessions
                </div>
              )}
            </div>
            
            {/* Score progression chart */}
            {history.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-end gap-1 h-24">
                  {history.slice(0, 5).reverse().map((session, idx) => (
                    <div 
                      key={session.id}
                      className="flex-1 bg-indigo-500 rounded-t-lg transition-all hover:bg-indigo-400 cursor-pointer group relative"
                      style={{ height: `${(session.score / 100) * 100}%`, opacity: 0.3 + (idx * 0.15) }}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-void/90 px-2 py-1 rounded text-xs text-white whitespace-nowrap">
                        {session.score}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Oldest</span>
                  <span>Recent</span>
                </div>
              </div>
            ) : (
              <div className="text-slate-500 text-sm text-center py-8">
                Complete more sessions to see your improvement
              </div>
            )}
          </div>
          {/* Decorative element */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl" />
        </div>

        {/* Row 2, Column 2: Persona Card */}
        <div className="bg-card border border-white/5 rounded-[2rem] relative overflow-hidden group cursor-pointer transition-all duration-500 hover:shadow-xl hover:shadow-lime-400/10 hover:border-lime-400/20">
          {/* Background image with overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,_white_1px,_transparent_0)] bg-[length:24px_24px] opacity-5" />
          
          {/* Gradient overlay from bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/80 to-transparent" />
          
          {/* Content */}
          <div className="relative z-10 p-8 h-full flex flex-col justify-end min-h-[280px]">
            <div className="mb-4">
              <div className="inline-block px-3 py-1 bg-lime-400/20 border border-lime-400/30 rounded-full text-lime-400 text-xs font-bold uppercase tracking-wider mb-4">
                New Feature
              </div>
              <h3 className="text-white text-2xl font-bold mb-2">
                Discover Your Debate Persona
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Unlock personalized insights and discover your unique debating archetype based on your performance patterns.
              </p>
            </div>
            
            {/* CTA Button */}
            <button 
              onClick={onNavigateToPersona}
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold py-3 px-6 rounded-xl hover:bg-lime-400 hover:text-void hover:border-lime-400 transition-all duration-300 group-hover:translate-y-0 translate-y-1"
            >
              Explore Personas
              <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-lime-400/10 rounded-full blur-2xl transition-all duration-500 group-hover:scale-150" />
          <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl transition-all duration-500 group-hover:scale-150" />
        </div>

        {/* Row 2, Column 3: Performance Metrics Card */}
        <div className="bg-card border border-white/5 rounded-[2rem] p-8 relative overflow-hidden h-[280px] flex flex-col justify-center">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">
                  Performance Metrics
                </div>
                <div className="text-white text-2xl font-bold">
                  {recentSessions.length > 0 ? 'Last 10 Sessions' : 'No Data Yet'}
                </div>
              </div>
              {recentSessions.length > 0 && (
                <div className="text-lime-400 text-xs font-medium px-2 py-1 bg-lime-400/10 rounded-full">
                  Avg: {Math.round((avgVocabulary + avgClarity + avgPersuasion) / 3)}
                </div>
              )}
            </div>

            {/* Bar chart visualization with real data */}
            {recentSessions.length > 0 ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Vocabulary</span>
                    <span>{avgVocabulary}%</span>
                  </div>
                  <div className="h-3 bg-void rounded-full border border-white/5 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-lime-400 to-emerald-400 rounded-full transition-all duration-1000" 
                      style={{ width: `${avgVocabulary}%` }} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Clarity</span>
                    <span>{avgClarity}%</span>
                  </div>
                  <div className="h-3 bg-void rounded-full border border-white/5 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-lime-400 to-emerald-400 rounded-full transition-all duration-1000" 
                      style={{ width: `${avgClarity}%` }} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Persuasion</span>
                    <span>{avgPersuasion}%</span>
                  </div>
                  <div className="h-3 bg-void rounded-full border border-white/5 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-lime-400 to-emerald-400 rounded-full transition-all duration-1000" 
                      style={{ width: `${avgPersuasion}%` }} 
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-slate-500 text-sm text-center py-8">
                Complete sessions to see your performance metrics
              </div>
            )}
          </div>
          {/* Decorative element */}
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl" />
        </div>

      </div>
    </div>
  );
}
