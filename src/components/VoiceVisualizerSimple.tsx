import React, { useEffect, useRef } from 'react';

interface VoiceVisualizerSimpleProps {
  analyser: AnalyserNode | null;
  isActive: boolean;
}

const VoiceVisualizerSimple: React.FC<VoiceVisualizerSimpleProps> = ({ analyser, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    
    const getBaseRadius = () => Math.min(window.innerWidth, window.innerHeight) * 0.18;
    let baseRadius = getBaseRadius();

    const dataArray = new Uint8Array(analyser ? analyser.frequencyBinCount : 32);
    
    const colors = [
      { h: 260, s: 100, l: 65 }, // Deep Purple
      { h: 290, s: 100, l: 60 }, // Electric Violet
      { h: 220, s: 100, l: 60 }, // Bright Blue
      { h: 190, s: 100, l: 50 }, // Cyan
    ];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      baseRadius = getBaseRadius();
    };
    window.addEventListener('resize', resize);
    resize();

    const noise = (angle: number, t: number, frequency: number, amplitude: number) => {
      return Math.sin(angle * frequency + t) * amplitude;
    };

    const drawFluidRing = (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      radius: number,
      time: number,
      intensity: number,
      layerIndex: number
    ) => {
      ctx.beginPath();
      const points = 180;
      
      const speed = time * (1 + layerIndex * 0.2);
      const colorIndex = layerIndex % colors.length;
      const color = colors[colorIndex];
      if (!color) return; // Safety check
      
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        
        const w1 = noise(angle, speed, 3, 10);
        const w2 = noise(angle, -speed * 1.5, 5, 8);
        const w3 = noise(angle, speed * 2, 7, 5);
        
        const audioDeform = intensity * 40 * Math.sin(angle * 8 + speed * 3) * Math.cos(angle * 3);
        const breathing = Math.sin(time) * 5;

        const r = radius + w1 + w2 + w3 + audioDeform + breathing;

        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.closePath();

      ctx.lineWidth = 3 + intensity * 2;
      
      const gradient = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
      gradient.addColorStop(0, `hsla(${color.h}, ${color.s}%, ${color.l}%, 0)`);
      gradient.addColorStop(0.5, `hsla(${color.h}, ${color.s}%, ${color.l}%, ${0.5 + intensity * 0.5})`);
      gradient.addColorStop(1, `hsla(${color.h}, ${color.s}%, ${color.l}%, 0)`);
      
      ctx.strokeStyle = gradient;
      ctx.stroke();

      ctx.fillStyle = `hsla(${color.h}, ${color.s}%, ${color.l}%, 0.03)`;
      ctx.fill();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let average = 0;
      if (analyser && isActive) {
        analyser.getByteFrequencyData(dataArray);
        const relevantData = dataArray.slice(0, dataArray.length / 2); 
        const sum = relevantData.reduce((a, b) => a + b, 0);
        average = sum / relevantData.length;
      }
      
      const targetIntensity = isActive ? Math.min(1, average / 60) : 0;
      const intensity = targetIntensity;
      
      const idleIntensity = 0.1;
      const finalIntensity = Math.max(intensity, idleIntensity);

      time += 0.01 + (finalIntensity * 0.02);

      const cx = canvas.width / 2;
      const cy = canvas.height * 0.4; // Position higher like Lumina

      ctx.globalCompositeOperation = 'screen';

      const glowRadius = baseRadius * (1 + finalIntensity * 0.2);
      const gradient = ctx.createRadialGradient(cx, cy, baseRadius * 0.8, cx, cy, glowRadius * 1.5);
      gradient.addColorStop(0, 'rgba(120, 50, 255, 0)');
      gradient.addColorStop(0.5, `rgba(100, 100, 255, ${0.1 + finalIntensity * 0.2})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = 'lighter';

      drawFluidRing(ctx, cx, cy, baseRadius, time, finalIntensity, 0);
      drawFluidRing(ctx, cx, cy, baseRadius * 0.95, time + 2, finalIntensity, 1);
      drawFluidRing(ctx, cx, cy, baseRadius * 0.9, time + 4, finalIntensity, 2);

      if (finalIntensity > 0.2) {
         drawFluidRing(ctx, cx, cy, baseRadius * 1.1, time * 1.5, finalIntensity * 0.8, 3);
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [analyser, isActive]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none transition-opacity duration-1000"
      role="img"
      aria-label="Voice visualization"
    />
  );
};

export default VoiceVisualizerSimple;
