import React from 'react';
import { Track } from '../../types/music';
import { TrackList } from '../TrackList';

interface HomeViewProps {
  recentTracks: Track[];
  currentTrack?: Track | null;
  isPlaying: boolean;
  onTrackPlay: (track: Track, queue: Track[], index: number) => void;
  onTogglePlayPause: () => void;
  likedSongs: string[];
  onToggleLike: (trackId: string) => void;
}

export function HomeView({
  recentTracks,
  currentTrack,
  isPlaying,
  onTrackPlay,
  onTogglePlayPause,
  likedSongs,
  onToggleLike,
}: HomeViewProps) {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Good evening</h1>
        <p className="text-gray-400">Welcome back to your music</p>
      </div>

      {recentTracks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Recently Played</h2>
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <TrackList
              tracks={recentTracks.slice(0, 10)}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onTrackPlay={onTrackPlay}
              onTogglePlayPause={onTogglePlayPause}
              likedSongs={likedSongs}
              onToggleLike={onToggleLike}
              showIndex={false}
            />
          </div>
        </div>
      )}

      {recentTracks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg mb-4">No music loaded yet</p>
          <p className="text-gray-500">
            Go to Settings to select your music folder and start listening!
          </p>
        </div>
      )}
    </div>
  );
}