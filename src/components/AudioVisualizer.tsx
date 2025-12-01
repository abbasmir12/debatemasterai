interface AudioVisualizerProps {
  level: number; // 0-100
  isActive: boolean;
}

export default function AudioVisualizer({ level, isActive }: AudioVisualizerProps) {
  // Render 5 vertical bars
  const bars = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="flex items-end gap-1 h-12">
      {bars.map((i) => {
        // Calculate dynamic height based on audio level with sine wave variation
        // Base height is proportional to level, with sine wave adding variation
        const baseHeight = isActive ? level : 0;
        const sineVariation = Math.sin(i * 0.8) * 0.3 + 0.7; // Range: 0.4 to 1.0
        const height = Math.max(10, (baseHeight * sineVariation) / 100 * 48); // 48px = h-12
        
        return (
          <div
            key={i}
            className="w-2 bg-indigo-400 rounded-full transition-all duration-150"
            style={{ height: `${height}px` }}
          />
        );
      })}
    </div>
  );
}
