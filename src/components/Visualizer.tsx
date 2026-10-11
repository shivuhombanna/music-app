import React, { useRef, useEffect, useState } from 'react';
import { useMusic } from '../context/MusicContext';
import { audioEngine } from '../services/audioEngine';
import { X, Sparkles, Waves, BarChart2 } from 'lucide-react';

export const Visualizer: React.FC = () => {
  const { isVisualizerOpen, setIsVisualizerOpen, currentTrack, isPlaying } = useMusic();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mode, setMode] = useState<'bars' | 'wave' | 'circle'>('bars');

  useEffect(() => {
    if (!isVisualizerOpen) return;

    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = 64;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animId = requestAnimationFrame(render);
      audioEngine.getFrequencyData(dataArray);

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Background subtle gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
      bgGrad.addColorStop(1, 'rgba(11, 15, 23, 0.98)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      if (mode === 'bars') {
        const barWidth = (width / bufferLength) * 1.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const val = dataArray[i];
          const barHeight = (val / 255) * (height * 0.85);

          const grad = ctx.createLinearGradient(0, height, 0, height - barHeight);
          grad.addColorStop(0, '#8b5cf6'); // Violet
          grad.addColorStop(0.5, '#06b6d4'); // Cyan
          grad.addColorStop(1, '#f43f5e'); // Rose peak

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(x, height - barHeight, Math.max(2, barWidth - 2), barHeight, [2, 2, 0, 0]);
          ctx.fill();

          x += barWidth;
          if (x > width) break;
        }
      } else if (mode === 'wave') {
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#a855f7';
        ctx.beginPath();

        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2.5;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }
        ctx.stroke();

        // Shadow wave
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2.5 + 4;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.stroke();
      } else if (mode === 'circle') {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.25;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.9, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        for (let i = 0; i < bufferLength; i++) {
          const angle = (i / bufferLength) * 2 * Math.PI;
          const val = dataArray[i];
          const barLen = (val / 255) * 55;

          const x1 = centerX + Math.cos(angle) * radius;
          const y1 = centerY + Math.sin(angle) * radius;
          const x2 = centerX + Math.cos(angle) * (radius + barLen);
          const y2 = centerY + Math.sin(angle) * (radius + barLen);

          ctx.strokeStyle = i % 2 === 0 ? '#8b5cf6' : '#06b6d4';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isVisualizerOpen, mode, isPlaying]);

  if (!isVisualizerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0e1422] border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <div>
              <h3 className="text-base font-semibold text-white">Live Audio Visualizer</h3>
              <p className="text-xs text-slate-400">
                {currentTrack ? `${currentTrack.title} — ${currentTrack.artist}` : 'Audio Spectrum'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Visualizer Modes */}
            <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setMode('bars')}
                className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${
                  mode === 'bars' ? 'bg-violet-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Spectrum</span>
              </button>
              <button
                onClick={() => setMode('wave')}
                className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${
                  mode === 'wave' ? 'bg-violet-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Waves className="w-3.5 h-3.5" />
                <span>Wave</span>
              </button>
              <button
                onClick={() => setMode('circle')}
                className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${
                  mode === 'circle' ? 'bg-violet-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Radial</span>
              </button>
            </div>

            <button
              onClick={() => setIsVisualizerOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Canvas Display */}
        <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={720}
            height={400}
            className="w-full h-full object-contain"
          />

          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs text-xs text-slate-400">
              Playback paused — resume music to stream spectrum telemetry
            </div>
          )}
        </div>

        {/* Audio Engine Meta */}
        <div className="px-6 py-3 bg-[#0b0f17] border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <span>64 FFT Frequency Bins</span>
            <span aria-hidden="true">·</span>
            <span>Web Audio 48kHz Master</span>
          </div>
          <span>Stereo Balanced Output</span>
        </div>
      </div>
    </div>
  );
};
