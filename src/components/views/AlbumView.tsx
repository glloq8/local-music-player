import React from 'react';
import { Play, Plus, Music, Heart } from 'lucide-react';
import { Album, Track, Playlist } from '../../types/music';
import { TrackList } from '../TrackList';

interface AlbumViewProps {
  album: Album;
  currentTrack?: Track | null;
  isPlaying: boolean;
  onTrackPlay: (track: Track, queue: Track[], index: number) => void;
  onTogglePlayPause: () => void;
  onPlayAlbum: (album: Album) => void;
  likedSongs: string[];
  onToggleLike: (trackId: string) => void;
  playlists: Playlist[];
  onAddAlbumToPlaylist: (playlistId: string, album: Album) => void;
}

export function AlbumView({
  album,
  currentTrack,
  isPlaying,
  onTrackPlay,
  onTogglePlayPause,
  onPlayAlbum,
  likedSongs,
  onToggleLike,
  playlists,
  onAddAlbumToPlaylist,
}: AlbumViewProps) {
  const [showPlaylistMenu, setShowPlaylistMenu] = React.useState(false);

  const handleAddToPlaylist = (playlistId: string) => {
    onAddAlbumToPlaylist(playlistId, album);
    setShowPlaylistMenu(false);
  };

  return (
    <div className="p-6">
      {/* Album Header */}
      <div className="flex items-center space-x-6 mb-8">
        <div className="w-48 h-48 flex-shrink-0">
          {album.coverArt ? (
            <img
              src={album.coverArt}
              alt={`${album.name} cover`}
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
              <Music className="w-24 h-24 text-gray-400" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <p className="text-sm font-medium text-white uppercase tracking-wider">Album</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">{album.name}</h1>
          <p className="text-xl text-gray-300 mb-4">{album.artist}</p>
          <p className="text-gray-400">
            {album.tracks.length} {album.tracks.length === 1 ? 'song' : 'songs'}
          </p>
          
          <div className="flex items-center space-x-4 mt-6">
            <button
              onClick={() => onPlayAlbum(album)}
              className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-400 hover:scale-105 transition-all"
            >
              <Play className="w-6 h-6 text-black ml-1" />
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowPlaylistMenu(!showPlaylistMenu)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Playlist</span>
              </button>
              
              {showPlaylistMenu && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10">
                  <div className="p-2">
                    {playlists.length > 0 ? (
                      playlists.map((playlist) => (
                        <button
                          key={playlist.id}
                          onClick={() => handleAddToPlaylist(playlist.id)}
                          className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 rounded transition-colors"
                        >
                          {playlist.name}
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-2 text-gray-400 text-sm">No playlists available</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <TrackList
          tracks={album.tracks}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onTrackPlay={onTrackPlay}
          onTogglePlayPause={onTogglePlayPause}
          likedSongs={likedSongs}
          onToggleLike={onToggleLike}
        />
      </div>
    </div>
  );
}