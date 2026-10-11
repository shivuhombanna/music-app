import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { TRACK_CATALOG, CURATED_PLAYLISTS } from '../../data/musicCatalog';
import { TrackRow } from '../TrackRow';
import { TrackCard } from '../TrackCard';
import { Play, Sparkles, Disc3 } from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    playTrack,
    selectedGenre,
    setSelectedGenre,
    setSelectedPlaylistId,
    setActiveView,
    currentTrack,
    isPlaying,
    togglePlayPause,
  } = useMusic();

  const featuredTrack = TRACK_CATALOG[0]; // Synthetic Dusk

  // Filter tracks by selected genre
  const filteredTracks =
    selectedGenre === 'All'
      ? TRACK_CATALOG
      : TRACK_CATALOG.filter((t) => t.genre.toLowerCase() === selectedGenre.toLowerCase());

  const genres = ['All', 'Synthwave', 'Lo-Fi', 'Acoustic', 'Ambient'];

  return (
    <div className="p-6 md:p-8 space-y-10 max-w-7xl mx-auto">
      {/* Hero Showcase Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-violet-950/60 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row items-stretch">
        <div className="p-8 md:p-10 flex-1 flex flex-col justify-between z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-violet-400">
              <Sparkles className="w-4 h-4" />
              <span>FEATURED ALBUM PREMIERE</span>
              <span aria-hidden="true">·</span>
              <span>2026 EDITION</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              {featuredTrack.album}
            </h1>

            <p className="text-slate-300 text-sm md:text-base max-w-xl leading-relaxed">
              Immerse yourself in neon analog synthesis, driving retro rhythms, and late-night highway soundscapes mastered in 24-bit high-resolution audio.
            </p>
          </div>

          <div className="flex items-center gap-4 pt-6">
            <button
              onClick={() => {
                if (currentTrack?.id === featuredTrack.id) {
                  togglePlayPause();
                } else {
                  playTrack(featuredTrack, TRACK_CATALOG);
                }
              }}
              className="px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm flex items-center gap-2.5 shadow-lg shadow-violet-600/30 hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{currentTrack?.id === featuredTrack.id && isPlaying ? 'Pause Audio' : 'Play Featured Album'}</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span>{featuredTrack.credits.format}</span>
              <span aria-hidden="true">·</span>
              <span>8 Audio Stems</span>
            </div>
          </div>
        </div>

        {/* Hero Artwork with subtle scrim */}
        <div className="relative md:w-5/12 h-64 md:h-auto min-h-[260px] overflow-hidden">
          <img
            src={featuredTrack.coverUrl}
            alt={featuredTrack.album}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0d121c] via-transparent to-transparent" />
        </div>
      </section>

      {/* Genre Filter Tabs (Functional segmented buttons) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Soundscapes & Moods</h2>
            <p className="text-xs text-slate-400 mt-0.5">Filter by sonic environment and acoustic profile</p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  selectedGenre === g
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Albums Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredTracks.slice(0, 4).map((track) => (
            <TrackCard key={track.id} track={track} allTracks={filteredTracks} />
          ))}
        </div>
      </section>

      {/* Curated Playlists Collection */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Curated Soundscape Collections</h2>
            <p className="text-xs text-slate-400 mt-0.5">Handcrafted mixes designed for flow, focus, and nocturnal drives</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CURATED_PLAYLISTS.map((pl) => (
            <div
              key={pl.id}
              onClick={() => {
                setSelectedPlaylistId(pl.id);
                setActiveView('playlist');
              }}
              className="group bg-[#111726]/60 hover:bg-[#151d30] border border-slate-800/80 hover:border-slate-700/80 p-4 rounded-2xl transition-all cursor-pointer flex flex-col gap-3"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-800">
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
                <h4 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">
                  {pl.name}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {pl.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Complete Catalog Tracks Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Catalog Tracks</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Lossless streaming with full visualizer telemetry and interactive lyrics
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 tabular-nums">
            {filteredTracks.length} recordings available
          </span>
        </div>

        <div className="bg-[#101624]/60 border border-slate-800/80 rounded-2xl p-2 space-y-1">
          {filteredTracks.map((track, idx) => (
            <TrackRow
              key={track.id}
              track={track}
              index={idx}
              allTracks={filteredTracks}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
