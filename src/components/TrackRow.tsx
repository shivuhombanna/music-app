import React, { useState } from 'react';
import { Track } from '../types/music';
import { useMusic } from '../context/MusicContext';
import { Play, Pause, Heart, Plus, MoreHorizontal, Check, ListPlus, Volume2 } from 'lucide-react';

interface TrackRowProps {
  track: Track;
  index: number;
  allTracks?: Track[];
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export const TrackRow: React.FC<TrackRowProps> = ({ track, index, allTracks }) => {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayPause,
    toggleLike,
    isLiked,
    playlists,
    addTrackToPlaylist,
    addToQueue,
  } = useMusic();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const isCurrent = currentTrack?.id === track.id;
  const liked = isLiked(track.id);

  const handleRowClick = () => {
    if (isCurrent) {
      togglePlayPause();
    } else {
      playTrack(track, allTracks);
    }
  };

  const handleAddToPlaylist = (playlistId: string, plName: string) => {
    addTrackToPlaylist(playlistId, track.id);
    setAddedNotice(`Added to ${plName}`);
    setTimeout(() => {
      setAddedNotice(null);
      setIsMenuOpen(false);
    }, 1200);
  };

  return (
    <div
      className={`group relative flex items-center justify-between px-4 py-2.5 rounded-xl transition-colors ${
        isCurrent
          ? 'bg-violet-950/35 border border-violet-800/40 text-white'
          : 'hover:bg-slate-800/40 text-slate-300'
      }`}
    >
      {/* Left: Index / Play Button + Artwork + Title */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        {/* Play / Index Button */}
        <div className="w-6 flex items-center justify-center shrink-0">
          {isCurrent ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlayPause();
              }}
              className="text-violet-400 hover:scale-110 transition-transform"
            >
              {isPlaying ? (
                <Volume2 className="w-4 h-4 animate-pulse" />
              ) : (
                <Play className="w-4 h-4 fill-violet-400" />
              )}
            </button>
          ) : (
            <>
              <span className="text-xs font-mono text-slate-500 group-hover:hidden tabular-nums">
                {(index + 1).toString().padStart(2, '0')}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playTrack(track, allTracks);
                }}
                className="hidden group-hover:flex items-center justify-center text-white"
              >
                <Play className="w-4 h-4 fill-white" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail */}
        <div
          onClick={handleRowClick}
          className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-800 shrink-0 cursor-pointer border border-slate-700/50"
        >
          <img
            src={track.coverUrl}
            alt={track.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title & Artist */}
        <div className="min-w-0 cursor-pointer" onClick={handleRowClick}>
          <p
            className={`text-sm font-semibold truncate ${
              isCurrent ? 'text-violet-300' : 'text-slate-100 group-hover:text-white'
            }`}
          >
            {track.title}
          </p>
          <p className="text-xs text-slate-400 truncate">{track.artist}</p>
        </div>
      </div>

      {/* Album name (hidden on small screens) */}
      <div
        className="hidden md:block w-48 text-xs text-slate-400 truncate px-4 cursor-pointer"
        onClick={handleRowClick}
      >
        {track.album}
      </div>

      {/* Clean Unboxed Genre & Year */}
      <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 font-mono w-32">
        <span>{track.genre}</span>
        <span aria-hidden="true">·</span>
        <span>{track.year}</span>
      </div>

      {/* Right: Like + Duration + More Menu */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(track.id);
          }}
          className={`p-1.5 rounded-full transition-colors ${
            liked ? 'text-rose-500' : 'text-slate-500 opacity-0 group-hover:opacity-100 hover:text-white'
          }`}
          title={liked ? 'Unlike' : 'Like'}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500' : ''}`} />
        </button>

        <span className="text-xs text-slate-500 font-mono tabular-nums w-12 text-right">
          {formatDuration(track.duration)}
        </span>

        {/* Dropdown Menu Trigger */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="p-1.5 text-slate-500 hover:text-white rounded-lg transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <div
              className="absolute right-0 top-8 z-30 w-52 bg-[#121929] border border-slate-700/80 rounded-xl shadow-xl py-1.5 text-xs select-none"
              onClick={(e) => e.stopPropagation()}
            >
              {addedNotice ? (
                <div className="px-3 py-2 text-emerald-400 flex items-center gap-2 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  <span>{addedNotice}</span>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      addToQueue(track);
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                  >
                    <ListPlus className="w-3.5 h-3.5 text-violet-400" />
                    <span>Add to Up Next</span>
                  </button>

                  <div className="my-1 border-t border-slate-800" />
                  <div className="px-3 py-1 text-[10px] uppercase font-semibold text-slate-500">
                    Add to Playlist
                  </div>

                  {playlists.map((pl) => (
                    <button
                      key={pl.id}
                      onClick={() => handleAddToPlaylist(pl.id, pl.name)}
                      className="w-full px-3 py-1.5 text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 transition-colors truncate"
                    >
                      <Plus className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{pl.name}</span>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
