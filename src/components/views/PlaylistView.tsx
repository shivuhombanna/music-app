import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { TRACK_CATALOG } from '../../data/musicCatalog';
import { TrackRow } from '../TrackRow';
import { Play, Shuffle, Trash2, Disc3, Clock } from 'lucide-react';

function formatTotalTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  if (hours > 0) {
    return `${hours} hr ${remainingMins} min`;
  }
  return `${mins} min`;
}

export const PlaylistView: React.FC = () => {
  const {
    playlists,
    selectedPlaylistId,
    deletePlaylist,
    playTrack,
    setActiveView,
    toggleShuffle,
  } = useMusic();

  const playlist = playlists.find((p) => p.id === selectedPlaylistId);

  if (!playlist) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Playlist not found.</p>
        <button
          onClick={() => setActiveView('library')}
          className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-violet-600 rounded-lg"
        >
          Return to Library
        </button>
      </div>
    );
  }

  // Get track objects
  const tracks = playlist.trackIds
    .map((id) => TRACK_CATALOG.find((t) => t.id === id))
    .filter((t): t is typeof TRACK_CATALOG[0] => t !== undefined);

  const totalDuration = tracks.reduce((acc, t) => acc + t.duration, 0);

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks);
    }
  };

  const handleShufflePlay = () => {
    if (tracks.length > 0) {
      toggleShuffle();
      const randIdx = Math.floor(Math.random() * tracks.length);
      playTrack(tracks[randIdx], tracks);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-end gap-6 bg-gradient-to-b from-violet-950/40 to-slate-900/60 border border-slate-800 p-6 md:p-8 rounded-3xl">
        {/* Cover Art */}
        <div className="w-40 h-40 md:w-52 md:h-52 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700/60 shadow-2xl shrink-0">
          <img
            src={playlist.coverUrl}
            alt={playlist.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2 text-xs font-mono text-violet-400">
            <Disc3 className="w-4 h-4" />
            <span>{playlist.isCustom ? 'USER PLAYLIST' : 'CURATED MIX'}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            {playlist.name}
          </h1>

          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            {playlist.description}
          </p>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono tabular-nums pt-1">
            <span>{tracks.length} tracks</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatTotalTime(totalDuration)}
            </span>
            <span aria-hidden="true">·</span>
            <span>Created {playlist.createdAt}</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePlayAll}
            disabled={tracks.length === 0}
            className="px-6 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Play Playlist</span>
          </button>

          <button
            onClick={handleShufflePlay}
            disabled={tracks.length === 0}
            className="px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-medium text-xs flex items-center gap-2 transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle</span>
          </button>
        </div>

        {playlist.isCustom && (
          <button
            onClick={() => {
              if (confirm(`Delete playlist "${playlist.name}"?`)) {
                deletePlaylist(playlist.id);
              }
            }}
            className="px-3 py-2 text-xs text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Playlist</span>
          </button>
        )}
      </div>

      {/* Tracks Table */}
      {tracks.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-[#111726]/40 border border-slate-800/80 rounded-2xl">
          <Disc3 className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">This playlist has no tracks yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Browse our music catalog and click "Add to Playlist" on any song to build your custom tracklist.
          </p>
          <button
            onClick={() => setActiveView('home')}
            className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors inline-block mt-2"
          >
            Browse Music
          </button>
        </div>
      ) : (
        <div className="bg-[#101624]/60 border border-slate-800/80 rounded-2xl p-2 space-y-1">
          {tracks.map((track, idx) => (
            <TrackRow
              key={track.id}
              track={track}
              index={idx}
              allTracks={tracks}
            />
          ))}
        </div>
      )}
    </div>
  );
};
