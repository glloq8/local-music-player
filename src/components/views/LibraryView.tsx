import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Track } from '../../types/music';
import { TrackList } from '../TrackList';

interface LibraryViewProps {
  tracks: Track[];
  currentTrack?: Track | null;
  isPlaying: boolean;
  onTrackPlay: (track: Track, queue: Track[], index: number) => void;
  onTogglePlayPause: () => void;
  likedSongs: string[];
  onToggleLike: (trackId: string) => void;
}

export function LibraryView({
  tracks,
  currentTrack,
  isPlaying,
  onTrackPlay,
  onTogglePlayPause,
  likedSongs,
  onToggleLike,
}: LibraryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'artist' | 'album'>('title');

  const filteredAndSortedTracks = useMemo(() => {
    let filtered = tracks;

    if (searchQuery) {
      filtered = tracks.filter(
        (track) =>
          track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.album.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      const aValue = a[sortBy].toLowerCase();
      const bValue = b[sortBy].toLowerCase();
      return aValue.localeCompare(bValue);
    });
  }, [tracks, searchQuery, sortBy]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-4">Your Library</h1>
        
        {/* Search and Sort Controls */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search songs, artists, or albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'title' | 'artist' | 'album')}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="title">Sort by Title</option>
            <option value="artist">Sort by Artist</option>
            <option value="album">Sort by Album</option>
          </select>
        </div>

        <p className="text-gray-400">
          {filteredAndSortedTracks.length} of {tracks.length} songs
        </p>
      </div>

      {filteredAndSortedTracks.length > 0 ? (
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <TrackList
            tracks={filteredAndSortedTracks}
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
          <p className="text-gray-400 text-lg">
            {searchQuery ? 'No songs match your search' : 'No songs in your library'}
          </p>
          {!searchQuery && (
            <p className="text-gray-500 mt-2">
              Go to Settings to load your music folder
            </p>
          )}
        </div>
      )}
    </div>
  );
}