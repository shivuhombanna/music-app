export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface TrackCredits {
  producer: string;
  writer: string;
  bitrate: string;
  format: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // seconds
  coverUrl: string;
  genre: 'Synthwave' | 'Lo-Fi' | 'Acoustic' | 'Ambient' | 'Electronic';
  year: number;
  audioUrl: string;
  synthTheme?: 'synthwave' | 'lofi' | 'acoustic' | 'ambient';
  lyrics: LyricLine[];
  credits: TrackCredits;
  plays: number;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  trackIds: string[];
  isCustom?: boolean;
  createdAt: string;
}

export type RepeatMode = 'off' | 'all' | 'one';
export type AppView = 'home' | 'search' | 'library' | 'playlist' | 'liked';
