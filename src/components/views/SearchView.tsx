import React, { useState, useMemo } from 'react';
import { useMusic } from '../../context/MusicContext';
import { TRACK_CATALOG } from '../../data/musicCatalog';
import { TrackRow } from '../TrackRow';
import { TrackCard } from '../TrackCard';
import { Search, X, Sparkles, Music2 } from 'lucide-react';

export const SearchView: React.FC = () => {
  const { searchQuery, setSearchQuery } = useMusic();
  const [filterType, setFilterType] = useState<'all' | 'songs' | 'artists' | 'albums'>('all');

  const popularTags = ['Synthwave', 'Lo-Fi', 'Acoustic', 'Ambient', 'Lumina Horizon', 'Kaito', 'Astral Waveforms'];

  const results = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return TRACK_CATALOG;

    return TRACK_CATALOG.filter((t) => {
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchArtist = t.artist.toLowerCase().includes(q);
      const matchAlbum = t.album.toLowerCase().includes(q);
      const matchGenre = t.genre.toLowerCase().includes(q);

      if (filterType === 'songs') return matchTitle;
      if (filterType === 'artists') return matchArtist;
      if (filterType === 'albums') return matchAlbum;
      return matchTitle || matchArtist || matchAlbum || matchGenre;
    });
  }, [searchQuery, filterType]);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Search Input Bar */}
      <div className="space-y-4">
        <div className="relative max-w-2xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search songs, artists, albums, or genres..."
            className="w-full pl-12 pr-10 py-3.5 bg-slate-900 border border-slate-700/80 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 shadow-sm transition-colors"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Suggestion Tags */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-500 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            Explore:
          </span>
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="px-2.5 py-1 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 rounded-lg transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl w-fit">
        {(['all', 'songs', 'artists', 'albums'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
              filterType === tab
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white tracking-tight">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Catalog Showcase'}
        </h2>
        <span className="text-xs font-mono text-slate-500 tabular-nums">
          {results.length} results found
        </span>
      </div>

      {/* Empty State */}
      {results.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-[#111726]/40 border border-slate-800/80 rounded-2xl">
          <Music2 className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No tracks match your query</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try searching by alternative artist names like "Lumina Horizon", "Kaito", or genre tags like "Lo-Fi" and "Synthwave".
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors inline-block mt-2"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top Matches Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {results.slice(0, 4).map((track) => (
              <TrackCard key={`card-${track.id}`} track={track} allTracks={results} />
            ))}
          </div>

          {/* List View */}
          <div className="bg-[#101624]/60 border border-slate-800/80 rounded-2xl p-2 space-y-1">
            {results.map((track, idx) => (
              <TrackRow
                key={`row-${track.id}`}
                track={track}
                index={idx}
                allTracks={results}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
