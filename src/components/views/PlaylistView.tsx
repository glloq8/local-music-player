import React, { useState } from 'react';
import { Music, Edit2, Trash2, Plus } from 'lucide-react';
import { Track, Playlist } from '../../types/music';
import { TrackList } from '../TrackList';

interface PlaylistViewProps {
  playlist: Playlist;
  tracks: Track[];
  currentTrack?: Track | null;
  isPlaying: boolean;
  onTrackPlay: (track: Track, queue: Track[], index: number) => void;
  onTogglePlayPause: () => void;
  likedSongs: string[];
  onToggleLike: (trackId: string) => void;
  onUpdatePlaylist: (playlist: Playlist) => void;
  onDeletePlaylist: (playlistId: string) => void;
  onAddToPlaylist: (playlistId: string, trackId: string) => void;
  onRemoveFromPlaylist: (playlistId: string, trackId: string) => void;
}

export function PlaylistView({
  playlist,
  tracks,
  currentTrack,
  isPlaying,
  onTrackPlay,
  onTogglePlayPause,
  likedSongs,
  onToggleLike,
  onUpdatePlaylist,
  onDeletePlaylist,
  onAddToPlaylist,
  onRemoveFromPlaylist,
}: PlaylistViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(playlist.name);
  const [editDescription, setEditDescription] = useState(playlist.description || '');
  const [showAddTracks, setShowAddTracks] = useState(false);

  const playlistTracks = tracks.filter((track) => playlist.tracks.includes(track.id));
  const availableTracks = tracks.filter((track) => !playlist.tracks.includes(track.id));

  const handleSaveEdit = () => {
    onUpdatePlaylist({
      ...playlist,
      name: editName,
      description: editDescription,
      updatedAt: new Date(),
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(playlist.name);
    setEditDescription(playlist.description || '');
    setIsEditing(false);
  };

  const handleDeletePlaylist = () => {
    if (window.confirm(`Are you sure you want to delete "${playlist.name}"?`)) {
      onDeletePlaylist(playlist.id);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center space-x-6 mb-8">
        <div className="w-48 h-48 bg-gradient-to-br from-purple-600 to-blue-800 rounded-lg flex items-center justify-center">
          <Music className="w-24 h-24 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-white uppercase tracking-wider">Playlist</p>
          
          {isEditing ? (
            <div className="space-y-3 mt-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-4xl font-bold bg-transparent text-white border-b border-gray-600 focus:border-green-500 outline-none"
                placeholder="Playlist name"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full bg-gray-800 text-gray-300 rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Add a description"
                rows={2}
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-6xl font-bold text-white mb-2">{playlist.name}</h1>
              {playlist.description && (
                <p className="text-gray-400 mb-2">{playlist.description}</p>
              )}
              <p className="text-gray-400">
                {playlistTracks.length} {playlistTracks.length === 1 ? 'song' : 'songs'}
              </p>
              
              <div className="flex items-center space-x-4 mt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                
                <button
                  onClick={() => setShowAddTracks(!showAddTracks)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Songs</span>
                </button>
                
                <button
                  onClick={handleDeletePlaylist}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Tracks Section */}
      {showAddTracks && (
        <div className="bg-gray-900 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Add Songs to Playlist</h3>
          {availableTracks.length > 0 ? (
            <div className="max-h-64 overflow-y-auto space-y-1">
              {availableTracks.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-800 rounded"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{track.title}</p>
                    <p className="text-gray-400 text-sm truncate">{track.artist}</p>
                  </div>
                  <button
                    onClick={() => onAddToPlaylist(playlist.id, track.id)}
                    className="ml-4 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">All available songs are already in this playlist.</p>
          )}
        </div>
      )}

      {/* Playlist Tracks */}
      {playlistTracks.length > 0 ? (
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <TrackList
            tracks={playlistTracks}
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
          <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">This playlist is empty</p>
          <p className="text-gray-500">
            Add some songs to get started. Click "Add Songs" above to browse your library.
          </p>
        </div>
      )}
    </div>
  );
}