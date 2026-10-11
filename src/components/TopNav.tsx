import React from 'react';
import { useMusic } from '../context/MusicContext';
import { Plus } from 'lucide-react';

export const TopNav: React.FC = () => {
  const { activeView, setActiveView, setIsCreatePlaylistOpen } = useMusic();

  return (
    <header className="h-16 px-6 border-b border-slate-800/80 bg-[#0d121c]/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-8">
      {/* Zone 1: Single text element wordmark */}
      <button
        onClick={() => setActiveView('home')}
        className="text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-violet-400 transition-colors flex items-center gap-2 text-left"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-violet-500 inline-block" />
        Sonora Music
      </button>

      {/* Zone 2: 4-5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
        <button
          onClick={() => setActiveView('home')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'home' ? 'text-violet-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Discover
        </button>
        <button
          onClick={() => setActiveView('search')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'search' ? 'text-violet-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Search
        </button>
        <button
          onClick={() => setActiveView('library')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'library' ? 'text-violet-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Your Library
        </button>
        <button
          onClick={() => setActiveView('liked')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'liked' ? 'text-violet-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Favorites
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setIsCreatePlaylistOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Playlist</span>
        </button>
      </div>
    </header>
  );
};
