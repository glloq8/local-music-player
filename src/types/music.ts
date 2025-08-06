export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  file: File;
  url: string;
  coverArt?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: string[];
  coverArt?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: 'off' | 'all' | 'one';
  queue: Track[];
  queueIndex: number;
}

export interface MusicLibrary {
  tracks: Track[];
  playlists: Playlist[];
  likedSongs: string[];
  recentlyPlayed: string[];
}

export type ViewType = 'home' | 'library' | 'liked' | 'settings' | 'playlist';