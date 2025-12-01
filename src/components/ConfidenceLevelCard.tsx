/**
 * ConfidenceLevelCard component - Displays confidence level with breakdown
 */

interface ConfidenceLevelCardProps {
  confidenceLevel: 'Low' | 'Medium' | 'High' | 'Unstoppable';
  vocabularyScore: number;
  clarityScore: number;
  argumentStrength: number;
  persuasionScore: number;
  strategicAdaptability: number;
}

export default function ConfidenceLevelCard({
  confidenceLevel,
  vocabularyScore,
  clarityScore,
  argumentStrength,
  persuasionScore,
  strategicAdaptability,
}: ConfidenceLevelCardProps) {
  // Calculate confidence percentage for visual display
  const confidencePercentage = 
    confidenceLevel === 'Low' ? 25 :
    confidenceLevel === 'Medium' ? 50 :
    confidenceLevel === 'High' ? 75 : 100;

  // Calculate average of all sub-metrics
  const averageScore = Math.round(
    (vocabularyScore + clarityScore + argumentStrength + persuasionScore + strategicAdaptability) / 5
  );

  // Color scheme based on confidence level
  const colorScheme = {
    Low: { bg: 'bg-red-400/10', border: 'border-red-400/30', text: 'text-red-400', bar: 'bg-red-400' },
    Medium: { bg: 'bg-amber-400/10', border: 'border-amber-400/30', text: 'text-amber-400', bar: 'bg-amber-400' },
    High: { bg: 'bg-lime-400/10', border: 'border-lime-400/30', text: 'text-lime-400', bar: 'bg-lime-400' },
    Unstoppable: { bg: 'bg-emerald-400/10', border: 'border-emerald-400/30', text: 'text-emerald-400', bar: 'bg-emerald-400' },
  };

  const colors = colorScheme[confidenceLevel];

  return (
    <div className="bg-card border border-white/5 rounded-[2rem] p-8">
      <h3 className="text-white text-xl font-bold mb-6">Confidence Level</h3>
      
      {/* Main confidence display */}
      <div className="flex items-center justify-center mb-8">
        <div className={`px-8 py-4 ${colors.bg} border-2 ${colors.border} rounded-2xl`}>
          <span className={`${colors.text} text-3xl font-bold uppercase tracking-wider`}>
            {confidenceLevel}
          </span>
        </div>
      </div>

      {/* Confidence meter */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
          <span>Unstoppable</span>
        </div>
        <div className="h-3 bg-void rounded-full overflow-hidden border border-white/5">
          <div
            className={`h-full ${colors.bar} rounded-full transition-all duration-1000`}
            style={{ width: `${confidencePercentage}%` }}
          />
        </div>
      </div>

      {/* Sub-metrics breakdown */}
      <div className="space-y-3">
        <h4 className="text-slate-300 text-sm font-semibold mb-3">Confidence Breakdown</h4>
        
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-xs">Vocabulary</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-void rounded-full overflow-hidden">
              <div
                className="h-full bg-lime-400 rounded-full transition-all duration-700"
                style={{ width: `${vocabularyScore}%` }}
              />
            </div>
            <span className="text-white text-xs font-bold w-8 text-right">{vocabularyScore}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-xs">Clarity</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-void rounded-full overflow-hidden">
              <div
                className="h-full bg-lime-400 rounded-full transition-all duration-700"
                style={{ width: `${clarityScore}%` }}
              />
            </div>
            <span className="text-white text-xs font-bold w-8 text-right">{clarityScore}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-xs">Arguments</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-void rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${argumentStrength}%` }}
              />
            </div>
            <span className="text-white text-xs font-bold w-8 text-right">{argumentStrength}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-xs">Persuasion</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-void rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${persuasionScore}%` }}
              />
            </div>
            <span className="text-white text-xs font-bold w-8 text-right">{persuasionScore}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-xs">Adaptability</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-void rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${strategicAdaptability}%` }}
              />
            </div>
            <span className="text-white text-xs font-bold w-8 text-right">{strategicAdaptability}</span>
          </div>
        </div>

        {/* Average score */}
        <div className="pt-3 mt-3 border-t border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-sm font-semibold">Overall Average</span>
            <span className={`${colors.text} text-lg font-bold`}>{averageScore}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
