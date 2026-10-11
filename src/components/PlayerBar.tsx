import React, { useState } from 'react';
import { useMusic } from '../context/MusicContext';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Volume2,
  VolumeX,
  Sliders,
  Mic2,
  Activity,
  ListMusic,
  Headphones,
} from 'lucide-react';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export const PlayerBar: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    repeatMode,
    isShuffle,
    queue,
    spatialAudio,
    togglePlayPause,
    seek,
    nextTrack,
    prevTrack,
    setVolume,
    toggleMute,
    setPlaybackRate,
    toggleShuffle,
    cycleRepeatMode,
    toggleLike,
    isLiked,
    isLyricsOpen,
    setIsLyricsOpen,
    isVisualizerOpen,
    setIsVisualizerOpen,
    isEqModalOpen,
    setIsEqModalOpen,
    isQueueOpen,
    setIsQueueOpen,
    toggleSpatialAudio,
  } = useMusic();

  const [hoverSeekTime, setHoverSeekTime] = useState<number | null>(null);

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isCurrentLiked = isLiked(currentTrack.id);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    seek(val);
  };

  const handleScrubberMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverSeekTime(ratio * duration);
  };

  const handleScrubberMouseLeave = () => {
    setHoverSeekTime(null);
  };

  const speedOptions = [0.75, 1, 1.25, 1.5];

  const handleCycleSpeed = () => {
    const idx = speedOptions.indexOf(playbackRate);
    const nextIdx = (idx + 1) % speedOptions.length;
    setPlaybackRate(speedOptions[nextIdx]);
  };

  return (
    <footer className="h-22 bg-[#0d121c] border-t border-slate-800/90 px-4 md:px-6 flex items-center justify-between gap-4 z-40 select-none">
      {/* Zone 1: Current Track Meta */}
      <div className="flex items-center gap-3 w-1/4 min-w-[200px]">
        <div className="relative group shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-slate-800 border border-slate-700/60 shadow-sm">
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-white truncate hover:underline cursor-pointer">
              {currentTrack.title}
            </h4>
          </div>
          <p className="text-xs text-slate-400 truncate hover:text-slate-300 cursor-pointer">
            {currentTrack.artist}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
            <span>{currentTrack.genre}</span>
            <span aria-hidden="true">·</span>
            <span>{currentTrack.credits.bitrate}</span>
          </div>
        </div>
        <button
          onClick={() => toggleLike(currentTrack.id)}
          className={`p-1.5 rounded-full transition-colors ${
            isCurrentLiked ? 'text-rose-500' : 'text-slate-400 hover:text-white'
          }`}
          title={isCurrentLiked ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${isCurrentLiked ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Zone 2: Main Playback & Timeline Controls */}
      <div className="flex flex-col items-center gap-1.5 flex-1 max-w-2xl px-2">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleShuffle}
            className={`p-1.5 rounded-full transition-colors ${
              isShuffle ? 'text-violet-400' : 'text-slate-400 hover:text-white'
            }`}
            title={isShuffle ? 'Shuffle is ON' : 'Shuffle is OFF'}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            onClick={prevTrack}
            className="p-1.5 text-slate-300 hover:text-white transition-colors"
            title="Previous track"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlayPause}
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-200 text-slate-900 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-slate-900" />
            ) : (
              <Play className="w-4 h-4 fill-slate-900 ml-0.5" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="p-1.5 text-slate-300 hover:text-white transition-colors"
            title="Next track"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={cycleRepeatMode}
            className={`p-1.5 rounded-full transition-colors ${
              repeatMode !== 'off' ? 'text-violet-400' : 'text-slate-400 hover:text-white'
            }`}
            title={`Repeat mode: ${repeatMode}`}
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-4 h-4" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Scrubber Bar */}
        <div className="w-full flex items-center gap-3">
          <span className="text-xs font-mono tabular-nums text-slate-400 w-10 text-right">
            {formatTime(currentTime)}
          </span>

          <div
            className="relative flex-1 group py-1.5 cursor-pointer"
            onMouseMove={handleScrubberMouseMove}
            onMouseLeave={handleScrubberMouseLeave}
          >
            {/* Hover timestamp tooltip */}
            {hoverSeekTime !== null && (
              <div
                className="absolute -top-7 -translate-x-1/2 bg-slate-900 border border-slate-700 text-white text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded shadow pointer-events-none"
                style={{
                  left: `${(hoverSeekTime / (duration || 1)) * 100}%`,
                }}
              >
                {formatTime(hoverSeekTime)}
              </div>
            )}

            <div className="h-1 bg-slate-800 rounded-full overflow-hidden relative group-hover:h-1.5 transition-all">
              <div
                className="h-full bg-violet-500 rounded-full group-hover:bg-violet-400 transition-colors"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.5}
              value={currentTime}
              onChange={handleSeekChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Seek time"
            />
          </div>

          <span className="text-xs font-mono tabular-nums text-slate-500 w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Zone 3: Audio Processing, Lyrics, Visualizer, Queue, Volume */}
      <div className="flex items-center justify-end gap-2.5 w-1/4 min-w-[220px]">
        {/* Speed button */}
        <button
          onClick={handleCycleSpeed}
          className="px-1.5 py-0.5 text-[11px] font-mono text-slate-400 hover:text-white bg-slate-800/80 rounded transition-colors"
          title="Playback speed"
        >
          {playbackRate}x
        </button>

        {/* Spatial Audio Toggle */}
        <button
          onClick={toggleSpatialAudio}
          className={`p-1.5 rounded-lg transition-colors ${
            spatialAudio
              ? 'text-violet-400 bg-violet-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title={spatialAudio ? '3D Spatial Audio: Active' : 'Enable 3D Spatial Audio'}
        >
          <Headphones className="w-4 h-4" />
        </button>

        {/* Equalizer Modal Trigger */}
        <button
          onClick={() => setIsEqModalOpen(!isEqModalOpen)}
          className={`p-1.5 rounded-lg transition-colors ${
            isEqModalOpen
              ? 'text-violet-400 bg-violet-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Equalizer & Audio Master"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* Live Visualizer Trigger */}
        <button
          onClick={() => setIsVisualizerOpen(!isVisualizerOpen)}
          className={`p-1.5 rounded-lg transition-colors ${
            isVisualizerOpen
              ? 'text-violet-400 bg-violet-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Real-time Audio Visualizer"
        >
          <Activity className="w-4 h-4" />
        </button>

        {/* Synchronized Lyrics Trigger */}
        <button
          onClick={() => setIsLyricsOpen(!isLyricsOpen)}
          className={`p-1.5 rounded-lg transition-colors ${
            isLyricsOpen
              ? 'text-violet-400 bg-violet-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Synchronized Lyrics"
        >
          <Mic2 className="w-4 h-4" />
        </button>

        {/* Queue Drawer Trigger */}
        <button
          onClick={() => setIsQueueOpen(!isQueueOpen)}
          className={`relative p-1.5 rounded-lg transition-colors ${
            isQueueOpen
              ? 'text-violet-400 bg-violet-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Play Queue"
        >
          <ListMusic className="w-4 h-4" />
          {queue.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-violet-600 text-white text-[9px] font-mono px-1 rounded-full">
              {queue.length}
            </span>
          )}
        </button>

        {/* Volume Controls */}
        <div className="flex items-center gap-1.5 ml-1">
          <button
            onClick={toggleMute}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-16 h-1 accent-violet-500 bg-slate-800 rounded-full cursor-pointer"
            aria-label="Volume slider"
          />
        </div>
      </div>
    </footer>
  );
};
