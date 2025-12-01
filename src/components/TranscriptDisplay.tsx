import React from 'react';

interface TranscriptDisplayProps {
  lines: string[];
  speaker: 'user' | 'model' | null;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ lines, speaker }) => {
  if (!lines.length || !speaker) return null;

  return (
    <div className="absolute bottom-[12%] md:bottom-[15%] left-6 md:left-1/2 md:ml-[-350px] w-full max-w-[80%] md:max-w-2xl flex flex-col items-start pointer-events-none z-20 transition-all duration-500">
      
      {/* Speaker Indicator */}
      <div className="mb-4 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${speaker === 'user' ? 'bg-lime-400' : 'bg-purple-400'} animate-pulse`} />
        <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/40 font-semibold">
          {speaker === 'user' ? 'You' : 'AI'}
        </span>
      </div>

      <div className="flex flex-col items-start justify-start gap-1 text-left">
        
        {/* Line 1: Main Focus - Longest, Brightest */}
        <div 
          className="text-white text-3xl md:text-4xl font-light tracking-wide transition-all duration-300 leading-snug"
          style={{ textShadow: '0 0 30px rgba(255,255,255,0.1)' }}
        >
          {lines[0]}
        </div>

        {/* Line 2: Faded & Shorter */}
        {lines[1] && (
          <div 
            className="text-white/60 text-3xl md:text-4xl font-light transition-all duration-300 leading-snug"
            style={{ filter: 'blur(0.5px)' }}
          >
            {lines[1]}
          </div>
        )}

        {/* Line 3: More Faded & Shortest */}
        {lines[2] && (
          <div 
            className="text-white/30 text-3xl md:text-4xl font-light transition-all duration-300 leading-snug"
            style={{ filter: 'blur(1px)' }}
          >
            {lines[2]}
          </div>
        )}
        
      </div>
    </div>
  );
};

export default TranscriptDisplay;
