import React from 'react';
import { Track } from '../types/music';
import { useMusic } from '../context/MusicContext';
import { Play, Pause } from 'lucide-react';

interface TrackCardProps {
  track: Track;
  allTracks?: Track[];
}

export const TrackCard: React.FC<TrackCardProps> = ({ track, allTracks }) => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = useMusic();

  const isCurrent = currentTrack?.id === track.id;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlayPause();
    } else {
      playTrack(track, allTracks);
    }
  };

  return (
    <div
      onClick={handlePlayClick}
      className="group bg-[#111726]/60 hover:bg-[#151d30] border border-slate-800/80 hover:border-slate-700/80 p-3.5 rounded-2xl transition-all duration-200 cursor-pointer flex flex-col gap-3"
    >
      {/* Artwork container */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-800 shadow-md">
        <img
          src={track.coverUrl}
          alt={track.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Hover / Playing Overlay Button */}
        <div
          className={`absolute bottom-2.5 right-2.5 w-10 h-10 rounded-full bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center shadow-lg transition-all duration-200 ${
            isCurrent
              ? 'opacity-100 scale-100'
              : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 scale-95 hover:scale-105'
          }`}
        >
          {isCurrent && isPlaying ? (
            <Pause className="w-5 h-5 fill-white" />
          ) : (
            <Play className="w-5 h-5 fill-white ml-0.5" />
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="min-w-0">
        <h4
          className={`text-sm font-semibold truncate ${
            isCurrent ? 'text-violet-400' : 'text-slate-100 group-hover:text-white'
          }`}
        >
          {track.title}
        </h4>
        <p className="text-xs text-slate-400 truncate mt-0.5">{track.artist}</p>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono mt-1">
          <span>{track.genre}</span>
          <span aria-hidden="true">·</span>
          <span>{track.year}</span>
        </div>
      </div>
    </div>
  );
};
