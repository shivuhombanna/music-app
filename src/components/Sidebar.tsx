import React from 'react';
import { useMusic } from '../context/MusicContext';
import { Compass, Search, Library, Heart, Plus, Music, Radio, Disc3, Trash2 } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    playlists,
    selectedPlaylistId,
    setSelectedPlaylistId,
    likedTrackIds,
    setIsCreatePlaylistOpen,
    deletePlaylist,
    selectedGenre,
    setSelectedGenre,
  } = useMusic();

  const handleSelectPlaylist = (id: string) => {
    setSelectedPlaylistId(id);
    setActiveView('playlist');
  };

  const genres = ['All', 'Synthwave', 'Lo-Fi', 'Acoustic', 'Ambient'];

  return (
    <aside className="w-64 shrink-0 bg-[#0b0f17] border-r border-slate-800/80 flex flex-col h-[calc(100vh-4rem-5.5rem)] select-none">
      {/* Primary Section */}
      <div className="p-4 space-y-1">
        <button
          onClick={() => {
            setActiveView('home');
            setSelectedGenre('All');
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeView === 'home' && selectedGenre === 'All'
              ? 'bg-violet-600/15 text-violet-300'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Compass className="w-4 h-4 shrink-0" />
          <span className="truncate">Discover</span>
        </button>

        <button
          onClick={() => setActiveView('search')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeView === 'search'
              ? 'bg-violet-600/15 text-violet-300'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Search className="w-4 h-4 shrink-0" />
          <span className="truncate">Search Catalog</span>
        </button>

        <button
          onClick={() => setActiveView('library')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeView === 'library'
              ? 'bg-violet-600/15 text-violet-300'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Library className="w-4 h-4 shrink-0" />
          <span className="truncate">Your Library</span>
        </button>

        <button
          onClick={() => setActiveView('liked')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeView === 'liked'
              ? 'bg-violet-600/15 text-violet-300'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Heart className="w-4 h-4 shrink-0 text-rose-500 fill-rose-500/20" />
            <span className="truncate">Favorite Tracks</span>
          </div>
          <span className="text-xs text-slate-500 font-mono tabular-nums">{likedTrackIds.length}</span>
        </button>
      </div>

      <div className="px-4 py-2 border-t border-slate-800/60">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1 flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-violet-400" />
          <span>Genre Soundscapes</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => {
                setSelectedGenre(g);
                if (activeView !== 'home') setActiveView('home');
              }}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                selectedGenre === g
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Playlists Header */}
      <div className="px-5 pt-4 pb-2 border-t border-slate-800/60 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Playlists</span>
        <button
          onClick={() => setIsCreatePlaylistOpen(true)}
          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          title="Create New Playlist"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Playlist List (scrollable) */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
        {playlists.map((pl) => {
          const isSelected = activeView === 'playlist' && selectedPlaylistId === pl.id;
          return (
            <div
              key={pl.id}
              className={`group flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-violet-600/20 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
              onClick={() => handleSelectPlaylist(pl.id)}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {pl.isCustom ? (
                  <Music className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                ) : (
                  <Disc3 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                )}
                <span className="truncate">{pl.name}</span>
              </div>
              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {pl.isCustom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete playlist "${pl.name}"?`)) {
                        deletePlaylist(pl.id);
                      }
                    }}
                    className="p-1 hover:text-rose-400 rounded transition-colors"
                    title="Delete playlist"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
                <span className="text-xs text-slate-600 font-mono tabular-nums">{pl.trackIds.length}</span>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
