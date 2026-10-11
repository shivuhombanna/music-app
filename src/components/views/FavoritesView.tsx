import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { TRACK_CATALOG } from '../../data/musicCatalog';
import { TrackRow } from '../TrackRow';
import { Heart, Play, Shuffle } from 'lucide-react';

export const FavoritesView: React.FC = () => {
  const { likedTrackIds, playTrack, setActiveView, toggleShuffle } = useMusic();

  const likedTracks = TRACK_CATALOG.filter((t) => likedTrackIds.includes(t.id));

  const handlePlayAll = () => {
    if (likedTracks.length > 0) {
      playTrack(likedTracks[0], likedTracks);
    }
  };

  const handleShuffle = () => {
    if (likedTracks.length > 0) {
      toggleShuffle();
      const rand = Math.floor(Math.random() * likedTracks.length);
      playTrack(likedTracks[rand], likedTracks);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-end gap-6 bg-gradient-to-b from-rose-950/40 via-violet-950/20 to-slate-900/60 border border-slate-800 p-6 md:p-8 rounded-3xl">
        <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl bg-gradient-to-br from-rose-600 via-pink-600 to-violet-700 flex items-center justify-center shadow-2xl shrink-0">
          <Heart className="w-20 h-20 text-white fill-white drop-shadow-md" />
        </div>

        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2 text-xs font-mono text-rose-400">
            <span>PERSONAL COLLECTION</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Favorite Tracks
          </h1>

          <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
            Your saved sonic favorites in one place. Stream seamlessly with real-time spectrum visualization and synchronized lyrics.
          </p>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono tabular-nums pt-1">
            <span>{likedTracks.length} liked recordings</span>
            <span aria-hidden="true">·</span>
            <span>Always available</span>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={handlePlayAll}
          disabled={likedTracks.length === 0}
          className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Play All</span>
        </button>

        <button
          onClick={handleShuffle}
          disabled={likedTracks.length === 0}
          className="px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-medium text-xs flex items-center gap-2 transition-colors"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Shuffle</span>
        </button>
      </div>

      {/* Track List */}
      {likedTracks.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-[#111726]/40 border border-slate-800/80 rounded-2xl">
          <Heart className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No tracks liked yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click the heart icon on any song across the catalog to build your favorites list.
          </p>
          <button
            onClick={() => setActiveView('home')}
            className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors inline-block mt-2"
          >
            Discover Music
          </button>
        </div>
      ) : (
        <div className="bg-[#101624]/60 border border-slate-800/80 rounded-2xl p-2 space-y-1">
          {likedTracks.map((track, idx) => (
            <TrackRow
              key={track.id}
              track={track}
              index={idx}
              allTracks={likedTracks}
            />
          ))}
        </div>
      )}
    </div>
  );
};
