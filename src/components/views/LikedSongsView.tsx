import React from 'react';
import { Heart } from 'lucide-react';
import { Track } from '../../types/music';
import { TrackList } from '../TrackList';

interface LikedSongsViewProps {
  tracks: Track[];
  likedSongs: string[];
  currentTrack?: Track | null;
  isPlaying: boolean;
  onTrackPlay: (track: Track, queue: Track[], index: number) => void;
  onTogglePlayPause: () => void;
  onToggleLike: (trackId: string) => void;
}

export function LikedSongsView({
  tracks,
  likedSongs,
  currentTrack,
  isPlaying,
  onTrackPlay,
  onTogglePlayPause,
  onToggleLike,
}: LikedSongsViewProps) {
  const likedTracks = tracks.filter((track) => likedSongs.includes(track.id));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center space-x-6 mb-8">
        <div className="w-48 h-48 bg-gradient-to-br from-purple-700 to-blue-900 rounded-lg flex items-center justify-center">
          <Heart className="w-24 h-24 text-white fill-current" />
        </div>
        <div>
          <p className="text-sm font-medium text-white uppercase tracking-wider">Playlist</p>
          <h1 className="text-6xl font-bold text-white mb-4">Liked Songs</h1>
          <p className="text-gray-400">
            {likedTracks.length} {likedTracks.length === 1 ? 'song' : 'songs'}
          </p>
        </div>
      </div>

      {likedTracks.length > 0 ? (
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <TrackList
            tracks={likedTracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onTrackPlay={onTrackPlay}
            onTogglePlayPause={onTogglePlayPause}
            likedSongs={likedSongs}
            onToggleLike={onToggleLike}
          />
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">No liked songs yet</p>
          <p className="text-gray-500">
            Songs you like will appear here. Click the heart icon next to any song to add it to your liked songs.
          </p>
        </div>
      )}
    </div>
  );
}