import React, { useState, useMemo } from 'react';
import { Search, Grid, List } from 'lucide-react';
import { Track } from '../../types/music';
import { AlbumGrid } from '../AlbumGrid';
import { ArtistSidebar } from '../ArtistSidebar';
import { groupTracksByAlbum, groupAlbumsByArtist } from '../../utils/albumUtils';

interface LibraryViewProps {
  tracks: Track[];
  currentTrack?: Track | null;
  isPlaying: boolean;
  onTrackPlay: (track: Track, queue: Track[], index: number) => void;
  onTogglePlayPause: () => void;
  likedSongs: string[];
  onToggleLike: (trackId: string) => void;
  onAlbumSelect: (albumId: string) => void;
}

export function LibraryView({
  tracks,
  currentTrack,
  isPlaying,
  onTrackPlay,
  onTogglePlayPause,
  likedSongs,
  onToggleLike,
  onAlbumSelect,
}: LibraryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'albums' | 'tracks'>('albums');

  const albums = useMemo(() => groupTracksByAlbum(tracks), [tracks]);
  const albumsByArtist = useMemo(() => groupAlbumsByArtist(albums), [albums]);

  const filteredAlbums = useMemo(() => {
    if (!searchQuery) return albums;
    
    return albums.filter(
      (album) =>
        album.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        album.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [albums, searchQuery]);
  const handleAlbumClick = (album: any) => {
    onAlbumSelect(album.id);
  };

  const handlePlayAlbum = (album: any) => {
    if (album.tracks.length > 0) {
      handleTrackPlay(album.tracks[0], album.tracks, 0);
    }
  };

  return (
    <div className="flex h-full">
      <ArtistSidebar
        albumsByArtist={albumsByArtist}
        onAlbumSelect={handleAlbumClick}
      />
      
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-4">Your Library</h1>
          
          {/* Search and View Controls */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search albums or artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center bg-gray-800 rounded-md">
              <button
                onClick={() => setViewMode('albums')}
                className={`px-3 py-2 rounded-l-md transition-colors ${
                  viewMode === 'albums' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('tracks')}
                className={`px-3 py-2 rounded-r-md transition-colors ${
                  viewMode === 'tracks' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div>
          <p className="text-gray-400">
            {filteredAlbums.length} {filteredAlbums.length === 1 ? 'album' : 'albums'}
          </p>


          {filteredAlbums.length > 0 ? (
            <AlbumGrid
              albums={filteredAlbums}
              onAlbumClick={handleAlbumClick}
              onPlayAlbum={handlePlayAlbum}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                {searchQuery ? 'No albums match your search' : 'No albums in your library'}
              </p>
              {!searchQuery && (
                <p className="text-gray-500 mt-2">
                  Go to Settings to load your music folder
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}