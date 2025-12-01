/**
 * SessionSummary component - Displays post-debate analysis and performance metrics
 */

import { DebateAnalysis } from '../types';
import ConfidenceLevelCard from './ConfidenceLevelCard';

/**
 * Props for SessionSummary component
 */
interface SessionSummaryProps {
  analysis: DebateAnalysis;
  onBack: () => void;
}

/**
 * Props for MetricBar sub-component
 */
interface MetricBarProps {
  label: string;
  score: number; // 0-100
  color?: string;
}

/**
 * MetricBar sub-component - Renders a labeled progress bar for metric scores
 */
function MetricBar({ label, score, color = 'bg-lime-400' }: MetricBarProps) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-slate-300 text-sm font-medium">{label}</span>
        <span className="text-white text-sm font-bold">{score}</span>
      </div>
      <div className="h-3 bg-void rounded-full border border-white/5 overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-1000`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

/**
 * SessionSummary component - Displays comprehensive debate analysis
 */
export default function SessionSummary({ analysis, onBack }: SessionSummaryProps) {
  return (
    <div className="w-full h-full overflow-y-auto p-4 md:p-8 scrollbar-thin">
      {/* Grid layout for analysis display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">

        {/* Large Score Card - Requirements 10.2 */}
        <div className="relative bg-lime-400 rounded-[2.5rem] p-8 overflow-hidden">
          {/* Decorative circular elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 border-4 border-white/20 rounded-full" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 border-4 border-white/20 rounded-full rotate-45" />

          {/* Content */}
          <div className="relative z-10">
            <h3 className="text-void text-lg font-bold mb-2 uppercase tracking-wide">Overall Score</h3>
            <div className="text-8xl font-black text-void tracking-tighter mb-4">
              {analysis.score}
            </div>
            <div className="inline-block px-4 py-2 bg-void/10 rounded-full">
              <span className="text-void text-sm font-bold uppercase tracking-wider">
                {analysis.confidenceLevel}
              </span>
            </div>

            {/* Additional decorative dot pattern */}
            <div
              className="absolute bottom-8 right-8 w-24 h-24 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(24, 24, 27) 1px, transparent 0)',
                backgroundSize: '16px 16px'
              }}
            />
          </div>
        </div>

        {/* Archetype Card - Requirements 10.3 */}
        <div className="relative bg-card border border-white/5 rounded-[2.5rem] overflow-hidden">
          {/* Background image with overlay */}
          <div className="absolute inset-0">
            <div
              className="w-full h-full opacity-20 grayscale"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 h-full flex flex-col justify-end">
            <div className="mb-2">
              <span className="text-lime-400 text-xs font-bold uppercase tracking-wider">Your Archetype</span>
            </div>
            <h2 className="text-white text-4xl font-bold mb-4">
              {analysis.archetype}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed italic">
              "{analysis.wildcardInsight}"
            </p>

            {/* Decorative corner element */}
            <div className="absolute top-8 right-8 w-16 h-16 border-2 border-lime-400/30 rounded-full" />
          </div>
        </div>

        {/* Confidence Level Card with Breakdown */}
        <ConfidenceLevelCard
          confidenceLevel={analysis.confidenceLevel}
          vocabularyScore={analysis.vocabularyScore}
          clarityScore={analysis.clarityScore}
          argumentStrength={analysis.argumentStrength}
          persuasionScore={analysis.persuasionScore}
          strategicAdaptability={analysis.strategicAdaptability}
        />

        {/* English Proficiency Badge - Requirements 10.4 */}
        <div className="bg-card border border-white/5 rounded-[2rem] p-8">
          <h3 className="text-white text-xl font-bold mb-6">English Proficiency</h3>
          <div className="flex items-center justify-center">
            <div className="px-6 py-3 bg-lime-400/10 border-2 border-lime-400/30 rounded-2xl">
              <span className="text-lime-400 text-2xl font-bold uppercase tracking-wider">
                {analysis.englishProficiency}
              </span>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Beginner</span>
              <span className="text-slate-400">Native</span>
            </div>
            <div className="h-2 bg-void rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-lime-400 to-emerald-400 rounded-full transition-all duration-1000"
                style={{
                  width: `${
                    analysis.englishProficiency === 'Beginner' ? 25 :
                    analysis.englishProficiency === 'Intermediate' ? 50 :
                    analysis.englishProficiency === 'Advanced' ? 75 : 100
                  }%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Linguistics Card - Requirements 10.4 */}
        <div className="bg-card border border-white/5 rounded-[2rem] p-8">
          <h3 className="text-white text-xl font-bold mb-6">Linguistics</h3>
          <MetricBar label="Vocabulary" score={analysis.vocabularyScore} color="bg-lime-400" />
          <MetricBar label="Clarity" score={analysis.clarityScore} color="bg-lime-400" />
        </div>

        {/* Strategy Card - Requirements 10.4 */}
        <div className="bg-card border border-white/5 rounded-[2rem] p-8">
          <h3 className="text-white text-xl font-bold mb-6">Strategy</h3>
          <MetricBar label="Argument Strength" score={analysis.argumentStrength} color="bg-emerald-500" />
          <MetricBar label="Persuasion" score={analysis.persuasionScore} color="bg-emerald-500" />
          <MetricBar label="Adaptability" score={analysis.strategicAdaptability} color="bg-emerald-500" />
        </div>

        {/* Strengths Card - Requirements 10.5 */}
        <div className="bg-card border border-white/5 rounded-[2rem] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-400/10 border border-emerald-400/30 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-white text-xl font-bold">Strengths</h3>
          </div>
          <ul className="space-y-3">
            {analysis?.strengths && analysis.strengths.length > 0 ? (
              analysis.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300 text-sm leading-relaxed">{strength}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-400 text-sm italic">
                Focus on the suggestions below to develop your strengths
              </li>
            )}
          </ul>
        </div>

        {/* Suggestions Card - Requirements 10.6 */}
        <div className="bg-card border border-white/5 rounded-[2rem] p-8 md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-400/10 border border-amber-400/30 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <h3 className="text-white text-xl font-bold">Suggestions</h3>
          </div>
          <ul className="space-y-3">
            {analysis?.suggestions?.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span className="text-slate-300 text-sm leading-relaxed">{suggestion}</span>
              </li>
            )) || <li className="text-slate-400 text-sm">No suggestions available</li>}
          </ul>
        </div>

        {/* Return to Dashboard Button - Requirements 10.7 */}
        <div className="md:col-span-3 flex justify-center">
          <button
            onClick={onBack}
            className="px-8 py-4 bg-lime-400 text-void font-bold rounded-xl hover:bg-lime-500 transition shadow-lg shadow-lime-400/10"
          >
            Return to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}

// Export MetricBar for use in subsequent tasks
export { MetricBar };
