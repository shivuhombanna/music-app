import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Track, Playlist, RepeatMode, AppView } from '../types/music';
import { TRACK_CATALOG, CURATED_PLAYLISTS } from '../data/musicCatalog';
import { audioEngine, EqualizerSettings } from '../services/audioEngine';

interface MusicContextType {
  // Current playback
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  repeatMode: RepeatMode;
  isShuffle: boolean;
  queue: Track[];
  history: Track[];

  // Library & playlists
  likedTrackIds: string[];
  playlists: Playlist[];
  activeView: AppView;
  selectedPlaylistId: string | null;
  selectedGenre: string;
  searchQuery: string;

  // Modals & Panels
  isLyricsOpen: boolean;
  isVisualizerOpen: boolean;
  isEqModalOpen: boolean;
  isQueueOpen: boolean;
  isCreatePlaylistOpen: boolean;

  // Audio Processing
  equalizer: EqualizerSettings;
  spatialAudio: boolean;

  // Actions
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlayPause: () => void;
  seek: (seconds: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
  toggleLike: (trackId: string) => void;
  isLiked: (trackId: string) => boolean;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;

  // Playlist management
  createPlaylist: (name: string, description: string) => string;
  deletePlaylist: (playlistId: string) => void;
  addTrackToPlaylist: (playlistId: string, trackId: string) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;

  // Navigation
  setActiveView: (view: AppView) => void;
  setSelectedPlaylistId: (id: string | null) => void;
  setSelectedGenre: (genre: string) => void;
  setSearchQuery: (query: string) => void;

  // UI Panels
  setIsLyricsOpen: (open: boolean) => void;
  setIsVisualizerOpen: (open: boolean) => void;
  setIsEqModalOpen: (open: boolean) => void;
  setIsQueueOpen: (open: boolean) => void;
  setIsCreatePlaylistOpen: (open: boolean) => void;

  // Audio Engine Controls
  updateEqualizer: (eq: EqualizerSettings) => void;
  toggleSpatialAudio: () => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

const LIKED_STORAGE_KEY = 'sonora_liked_tracks';
const PLAYLISTS_STORAGE_KEY = 'sonora_user_playlists';

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(TRACK_CATALOG[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(TRACK_CATALOG[0]?.duration || 194);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRateState] = useState<number>(1);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [isShuffle, setIsShuffle] = useState<boolean>(false);

  // Queue & History
  const [queue, setQueue] = useState<Track[]>(TRACK_CATALOG.slice(1));
  const [history, setHistory] = useState<Track[]>([]);

  // Navigation & Views
  const [activeView, setActiveView] = useState<AppView>('home');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Panels
  const [isLyricsOpen, setIsLyricsOpen] = useState<boolean>(false);
  const [isVisualizerOpen, setIsVisualizerOpen] = useState<boolean>(false);
  const [isEqModalOpen, setIsEqModalOpen] = useState<boolean>(false);
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState<boolean>(false);

  // Sound Engine
  const [equalizer, setEqualizer] = useState<EqualizerSettings>({ bass: 2, mid: 0, treble: 1 });
  const [spatialAudio, setSpatialAudio] = useState<boolean>(false);

  // Liked tracks from localStorage
  const [likedTrackIds, setLikedTrackIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LIKED_STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['track-1', 'track-2', 'track-3'];
    } catch {
      return ['track-1', 'track-2'];
    }
  });

  // Playlists
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    try {
      const saved = localStorage.getItem(PLAYLISTS_STORAGE_KEY);
      const userLists = saved ? JSON.parse(saved) : [];
      return [...CURATED_PLAYLISTS, ...userLists];
    } catch {
      return CURATED_PLAYLISTS;
    }
  });

  // Keep ref for current track & queue in audio event handlers
  const currentTrackRef = useRef(currentTrack);
  currentTrackRef.current = currentTrack;
  const queueRef = useRef(queue);
  queueRef.current = queue;
  const repeatModeRef = useRef(repeatMode);
  repeatModeRef.current = repeatMode;
  const isShuffleRef = useRef(isShuffle);
  isShuffleRef.current = isShuffle;

  // Setup audio engine callbacks
  useEffect(() => {
    audioEngine.onTimeUpdate = (time, total) => {
      setCurrentTime(time);
      if (total && total > 0) {
        setDuration(total);
      }
    };

    audioEngine.onPlayStateChange = (playing) => {
      setIsPlaying(playing);
    };

    audioEngine.onEnded = () => {
      handleTrackEnd();
    };

    return () => {
      audioEngine.destroy();
    };
  }, []);

  const handleTrackEnd = useCallback(() => {
    if (repeatModeRef.current === 'one' && currentTrackRef.current) {
      audioEngine.seek(0);
      audioEngine.play();
      return;
    }

    const currentQueue = queueRef.current;
    if (currentQueue.length > 0) {
      let nextIndex = 0;
      if (isShuffleRef.current && currentQueue.length > 1) {
        nextIndex = Math.floor(Math.random() * currentQueue.length);
      }
      const nextSong = currentQueue[nextIndex];
      const remainingQueue = currentQueue.filter((_, idx) => idx !== nextIndex);

      if (currentTrackRef.current) {
        setHistory((prev) => [currentTrackRef.current!, ...prev.slice(0, 20)]);
      }

      setCurrentTrack(nextSong);
      setQueue(remainingQueue);
      setDuration(nextSong.duration);
      setCurrentTime(0);
      audioEngine.loadAndPlay(nextSong.audioUrl, nextSong.synthTheme || 'synthwave');
    } else if (repeatModeRef.current === 'all') {
      // Loop entire catalog
      const allTracks = TRACK_CATALOG;
      const first = allTracks[0];
      setCurrentTrack(first);
      setQueue(allTracks.slice(1));
      setDuration(first.duration);
      setCurrentTime(0);
      audioEngine.loadAndPlay(first.audioUrl, first.synthTheme || 'synthwave');
    } else {
      setIsPlaying(false);
    }
  }, []);

  // Save liked tracks
  useEffect(() => {
    try {
      localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(likedTrackIds));
    } catch {
      // ignore storage error
    }
  }, [likedTrackIds]);

  // Save custom playlists
  useEffect(() => {
    try {
      const customOnes = playlists.filter((p) => p.isCustom);
      localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(customOnes));
    } catch {
      // ignore
    }
  }, [playlists]);

  const playTrack = useCallback((track: Track, newQueue?: Track[]) => {
    if (currentTrackRef.current && currentTrackRef.current.id !== track.id) {
      setHistory((prev) => [currentTrackRef.current!, ...prev.slice(0, 20)]);
    }

    setCurrentTrack(track);
    setDuration(track.duration);
    setCurrentTime(0);

    if (newQueue) {
      setQueue(newQueue.filter((t) => t.id !== track.id));
    }

    audioEngine.loadAndPlay(track.audioUrl, track.synthTheme || 'synthwave');
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!currentTrack) {
      if (TRACK_CATALOG.length > 0) {
        playTrack(TRACK_CATALOG[0]);
      }
      return;
    }

    if (isPlaying) {
      audioEngine.pause();
    } else {
      audioEngine.play();
    }
  }, [currentTrack, isPlaying, playTrack]);

  const seek = useCallback((seconds: number) => {
    setCurrentTime(seconds);
    audioEngine.seek(seconds);
  }, []);

  const nextTrack = useCallback(() => {
    handleTrackEnd();
  }, [handleTrackEnd]);

  const prevTrack = useCallback(() => {
    if (currentTime > 3) {
      // If played more than 3s, restart current song
      seek(0);
      return;
    }

    if (history.length > 0) {
      const lastSong = history[0];
      setHistory((prev) => prev.slice(1));
      if (currentTrack) {
        setQueue((prev) => [currentTrack, ...prev]);
      }
      setCurrentTrack(lastSong);
      setDuration(lastSong.duration);
      setCurrentTime(0);
      audioEngine.loadAndPlay(lastSong.audioUrl, lastSong.synthTheme || 'synthwave');
    } else {
      seek(0);
    }
  }, [currentTime, history, currentTrack, seek]);

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    if (clamped > 0) {
      setIsMuted(false);
    }
    audioEngine.setVolume(clamped);
  }, []);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setIsMuted(false);
      audioEngine.setVolume(volume);
    } else {
      setIsMuted(true);
      audioEngine.setVolume(0);
    }
  }, [isMuted, volume]);

  const setPlaybackRate = useCallback((rate: number) => {
    setPlaybackRateState(rate);
    audioEngine.setPlaybackRate(rate);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  const toggleLike = useCallback((trackId: string) => {
    setLikedTrackIds((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
  }, []);

  const isLiked = useCallback((trackId: string) => {
    return likedTrackIds.includes(trackId);
  }, [likedTrackIds]);

  const addToQueue = useCallback((track: Track) => {
    setQueue((prev) => [...prev, track]);
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setQueue((prev) => prev.filter((_, idx) => idx !== index));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const createPlaylist = useCallback((name: string, description: string): string => {
    const newId = `playlist-${Date.now()}`;
    const newPlaylist: Playlist = {
      id: newId,
      name: name.trim() || 'Untitled Playlist',
      description: description.trim() || 'Custom collection of curated tracks',
      coverUrl: TRACK_CATALOG[0].coverUrl,
      trackIds: [],
      isCustom: true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPlaylists((prev) => [newPlaylist, ...prev]);
    return newId;
  }, []);

  const deletePlaylist = useCallback((playlistId: string) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
    if (selectedPlaylistId === playlistId) {
      setSelectedPlaylistId(null);
      setActiveView('library');
    }
  }, [selectedPlaylistId]);

  const addTrackToPlaylist = useCallback((playlistId: string, trackId: string) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId && !pl.trackIds.includes(trackId)) {
          return { ...pl, trackIds: [...pl.trackIds, trackId] };
        }
        return pl;
      })
    );
  }, []);

  const removeTrackFromPlaylist = useCallback((playlistId: string, trackId: string) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          return { ...pl, trackIds: pl.trackIds.filter((id) => id !== trackId) };
        }
        return pl;
      })
    );
  }, []);

  const updateEqualizer = useCallback((eq: EqualizerSettings) => {
    setEqualizer(eq);
    audioEngine.setEqualizer(eq);
  }, []);

  const toggleSpatialAudio = useCallback(() => {
    setSpatialAudio((prev) => {
      const next = !prev;
      audioEngine.setSpatial(next);
      return next;
    });
  }, []);

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        playbackRate,
        repeatMode,
        isShuffle,
        queue,
        history,
        likedTrackIds,
        playlists,
        activeView,
        selectedPlaylistId,
        selectedGenre,
        searchQuery,
        isLyricsOpen,
        isVisualizerOpen,
        isEqModalOpen,
        isQueueOpen,
        isCreatePlaylistOpen,
        equalizer,
        spatialAudio,
        playTrack,
        togglePlayPause,
        seek,
        nextTrack,
        prevTrack,
        setVolume,
        toggleMute,
        setPlaybackRate,
        toggleShuffle,
        cycleRepeatMode,
        toggleLike,
        isLiked,
        addToQueue,
        removeFromQueue,
        clearQueue,
        createPlaylist,
        deletePlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        setActiveView,
        setSelectedPlaylistId,
        setSelectedGenre,
        setSearchQuery,
        setIsLyricsOpen,
        setIsVisualizerOpen,
        setIsEqModalOpen,
        setIsQueueOpen,
        setIsCreatePlaylistOpen,
        updateEqualizer,
        toggleSpatialAudio,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
