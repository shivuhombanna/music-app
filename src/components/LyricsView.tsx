import React, { useEffect, useRef } from 'react';
import { useMusic } from '../context/MusicContext';
import { X, Mic2, Play } from 'lucide-react';

export const LyricsView: React.FC = () => {
  const { currentTrack, currentTime, isLyricsOpen, setIsLyricsOpen, seek } = useMusic();
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const lyrics = currentTrack?.lyrics || [];

  // Find the active lyric index based on currentTime
  let activeIndex = -1;
  for (let i = lyrics.length - 1; i >= 0; i--) {
    if (currentTime >= lyrics[i].time) {
      activeIndex = i;
      break;
    }
  }

  // Smooth auto-scroll to the active line
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex]);

  if (!isLyricsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="bg-[#0e1422] border border-slate-800 rounded-2xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-700">
              {currentTrack && (
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Mic2 className="w-3.5 h-3.5 text-violet-400" />
                <h3 className="text-sm font-semibold text-white">{currentTrack?.title}</h3>
              </div>
              <p className="text-xs text-slate-400">{currentTrack?.artist} — Synchronized Lyrics</p>
            </div>
          </div>

          <button
            onClick={() => setIsLyricsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lyrics scroll container */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto px-8 py-12 space-y-6 text-center select-none scrollbar-thin scrollbar-thumb-slate-800"
        >
          {lyrics.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-slate-500">
              No lyrics available for this track.
            </div>
          ) : (
            lyrics.map((line, idx) => {
              const isActive = idx === activeIndex;
              const isPast = idx < activeIndex;

              return (
                <div
                  key={`${line.time}-${idx}`}
                  ref={isActive ? activeLineRef : null}
                  onClick={() => seek(line.time)}
                  className={`group cursor-pointer transition-all duration-300 py-1.5 px-4 rounded-xl flex items-center justify-center gap-3 ${
                    isActive
                      ? 'text-white text-xl md:text-2xl font-bold scale-105 drop-shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                      : isPast
                      ? 'text-slate-500 hover:text-slate-300 text-base md:text-lg'
                      : 'text-slate-400 hover:text-slate-200 text-base md:text-lg'
                  }`}
                >
                  <span>{line.text}</span>
                  <span className="opacity-0 group-hover:opacity-100 text-xs font-mono text-violet-400 tabular-nums transition-opacity">
                    <Play className="w-3 h-3 inline mr-1" />
                    {Math.floor(line.time / 60)}:{(line.time % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer tip */}
        <div className="px-6 py-3 border-t border-slate-800/80 bg-[#0a0e17] text-xs text-slate-500 flex items-center justify-between font-mono">
          <span>Click any line to seek playback</span>
          <span>Time-stamped lyrics</span>
        </div>
      </div>
    </div>
  );
};
