/**
 * Sonora Music - Contemporary Online Music Player
 */

import React from 'react';
import { MusicProvider, useMusic } from './context/MusicContext';
import { TopNav } from './components/TopNav';
import { Sidebar } from './components/Sidebar';
import { PlayerBar } from './components/PlayerBar';
import { Visualizer } from './components/Visualizer';
import { LyricsView } from './components/LyricsView';
import { EqualizerModal } from './components/EqualizerModal';
import { QueueDrawer } from './components/QueueDrawer';
import { PlaylistModal } from './components/PlaylistModal';

// Views
import { HomeView } from './components/views/HomeView';
import { SearchView } from './components/views/SearchView';
import { PlaylistView } from './components/views/PlaylistView';
import { LibraryView } from './components/views/LibraryView';
import { FavoritesView } from './components/views/FavoritesView';

const MainContent: React.FC = () => {
  const { activeView } = useMusic();

  const renderCurrentView = () => {
    switch (activeView) {
      case 'home':
        return <HomeView />;
      case 'search':
        return <SearchView />;
      case 'playlist':
        return <PlaylistView />;
      case 'library':
        return <LibraryView />;
      case 'liked':
        return <FavoritesView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0b0f17] scrollbar-thin scrollbar-thumb-slate-800">
      {renderCurrentView()}
    </div>
  );
};

export default function App() {
  return (
    <MusicProvider>
      <div className="flex flex-col h-screen w-screen bg-[#0b0f17] text-slate-100 overflow-hidden font-sans">
        {/* Navigation Bar */}
        <TopNav />

        {/* Central Workspace */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <MainContent />
        </div>

        {/* Persistent Bottom Player */}
        <PlayerBar />

        {/* Interactive Overlays */}
        <Visualizer />
        <LyricsView />
        <EqualizerModal />
        <QueueDrawer />
        <PlaylistModal />
      </div>
    </MusicProvider>
  );
}
