import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { TRACK_CATALOG } from '../../data/musicCatalog';
import { TrackRow } from '../TrackRow';
import { Plus, Heart, Disc3, Music2, FolderPlus, Play } from 'lucide-react';

export const LibraryView: React.FC = () => {
  const {
    playlists,
    likedTrackIds,
    setSelectedPlaylistId,
    setActiveView,
    setIsCreatePlaylistOpen,
    playTrack,
  } = useMusic();

  const [activeTab, setActiveTab] = useState<'playlists' | 'liked' | 'albums'>('playlists');

  const likedTracks = TRACK_CATALOG.filter((t) => likedTrackIds.includes(t.id));

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header with Title and Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Your Music Library</h1>
          <p className="text-xs text-slate-400 mt-1">Manage your custom playlists, saved albums, and favorite tracks</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setActiveTab('playlists')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'playlists' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Playlists ({playlists.length})
            </button>
            <button
              onClick={() => setActiveTab('liked')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'liked' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Favorites ({likedTracks.length})
            </button>
            <button
              onClick={() => setActiveTab('albums')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'albums' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Albums
            </button>
          </div>

          <button
            onClick={() => setIsCreatePlaylistOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Playlist</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Playlists */}
      {activeTab === 'playlists' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Create New Playlist Card */}
          <div
            onClick={() => setIsCreatePlaylistOpen(true)}
            className="border-2 border-dashed border-slate-800 hover:border-violet-500/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 cursor-pointer group transition-colors bg-slate-950/40 hover:bg-violet-950/10 min-h-[220px]"
          >
            <div className="w-12 h-12 rounded-full bg-slate-900 group-hover:bg-violet-600/20 text-slate-400 group-hover:text-violet-400 flex items-center justify-center transition-colors">
              <FolderPlus className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">
                Create Playlist
              </p>
              <p className="text-xs text-slate-500 mt-1">Assemble tracks into your personal mixtape</p>
            </div>
          </div>

          {/* User & Curated Playlists */}
          {playlists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => {
                setSelectedPlaylistId(pl.id);
                setActiveView('playlist');
              }}
              className="group bg-[#111726]/60 hover:bg-[#151d30] border border-slate-800/80 hover:border-slate-700/80 p-4 rounded-2xl transition-all cursor-pointer flex flex-col gap-3"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-800">
                <img
                  src={pl.coverUrl}
                  alt={pl.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[11px] font-mono text-white flex items-center gap-1">
                  <Disc3 className="w-3 h-3 text-violet-400" />
                  <span>{pl.trackIds.length} tracks</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors truncate">
                  {pl.name}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {pl.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Liked Songs */}
      {activeTab === 'liked' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h2 className="text-lg font-bold text-white">Favorite Songs ({likedTracks.length})</h2>
            </div>
            {likedTracks.length > 0 && (
              <button
                onClick={() => playTrack(likedTracks[0], likedTracks)}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Play Favorites</span>
              </button>
            )}
          </div>

          {likedTracks.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-[#111726]/40 border border-slate-800/80 rounded-2xl">
              <Heart className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-semibold text-white">No liked tracks yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Tap the heart icon next to any song to pin it here for quick access.
              </p>
              <button
                onClick={() => setActiveView('home')}
                className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 rounded-lg inline-block mt-2"
              >
                Explore Music
              </button>
            </div>
          ) : (
            <div className="bg-[#101624]/60 border border-slate-800/80 rounded-2xl p-2 space-y-1">
              {likedTracks.map((track, idx) => (
                <TrackRow
                  key={`liked-${track.id}`}
                  track={track}
                  index={idx}
                  allTracks={likedTracks}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Albums */}
      {activeTab === 'albums' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from(new Set(TRACK_CATALOG.map((t) => t.album))).map((albumName) => {
            const albumTracks = TRACK_CATALOG.filter((t) => t.album === albumName);
            const lead = albumTracks[0];

            return (
              <div
                key={albumName}
                onClick={() => playTrack(lead, albumTracks)}
                className="group bg-[#111726]/60 hover:bg-[#151d30] border border-slate-800/80 hover:border-slate-700/80 p-4 rounded-2xl transition-all cursor-pointer flex flex-col gap-3"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-800">
                  <img
                    src={lead.coverUrl}
                    alt={albumName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors truncate">
                    {albumName}
                  </h4>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{lead.artist}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono mt-1">
                    <span>{lead.year}</span>
                    <span aria-hidden="true">·</span>
                    <span>{albumTracks.length} tracks</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
