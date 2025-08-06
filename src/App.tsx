import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Player } from './components/Player';
import { HomeView } from './components/views/HomeView';
import { LibraryView } from './components/views/LibraryView';
import { LikedSongsView } from './components/views/LikedSongsView';
import { SettingsView } from './components/views/SettingsView';
import { PlaylistView } from './components/views/PlaylistView';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Track, Playlist, ViewType, MusicLibrary } from './types/music';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('');
  
  const [musicLibrary, setMusicLibrary] = useLocalStorage<MusicLibrary>('musicLibrary', {
    tracks: [],
    playlists: [],
    likedSongs: [],
    recentlyPlayed: [],
  });

  const {
    playerState,
    playTrack,
    togglePlayPause,
    playNext,
    playPrevious,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
  } = useAudioPlayer();

  const handleLoadTracks = useCallback((tracks: Track[]) => {
    setMusicLibrary(prev => ({
      ...prev,
      tracks,
    }));
  }, [setMusicLibrary]);

  const handleTrackPlay = useCallback((track: Track, queue: Track[], index: number) => {
    playTrack(track, queue, index);
    
    // Add to recently played
    setMusicLibrary(prev => ({
      ...prev,
      recentlyPlayed: [
        track.id,
        ...prev.recentlyPlayed.filter(id => id !== track.id)
      ].slice(0, 50),
    }));
  }, [playTrack, setMusicLibrary]);

  const handleToggleLike = useCallback((trackId: string) => {
    setMusicLibrary(prev => ({
      ...prev,
      likedSongs: prev.likedSongs.includes(trackId)
        ? prev.likedSongs.filter(id => id !== trackId)
        : [...prev.likedSongs, trackId],
    }));
  }, [setMusicLibrary]);

  const handleCreatePlaylist = useCallback(() => {
    const name = prompt('Enter playlist name:');
    if (!name) return;

    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name,
      tracks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setMusicLibrary(prev => ({
      ...prev,
      playlists: [...prev.playlists, newPlaylist],
    }));

    setSelectedPlaylistId(newPlaylist.id);
    setCurrentView('playlist');
  }, [setMusicLibrary]);

  const handleUpdatePlaylist = useCallback((updatedPlaylist: Playlist) => {
    setMusicLibrary(prev => ({
      ...prev,
      playlists: prev.playlists.map(p => 
        p.id === updatedPlaylist.id ? updatedPlaylist : p
      ),
    }));
  }, [setMusicLibrary]);

  const handleDeletePlaylist = useCallback((playlistId: string) => {
    setMusicLibrary(prev => ({
      ...prev,
      playlists: prev.playlists.filter(p => p.id !== playlistId),
    }));
    setCurrentView('home');
  }, [setMusicLibrary]);

  const handleAddToPlaylist = useCallback((playlistId: string, trackId: string) => {
    setMusicLibrary(prev => ({
      ...prev,
      playlists: prev.playlists.map(p => 
        p.id === playlistId 
          ? { ...p, tracks: [...p.tracks, trackId], updatedAt: new Date() }
          : p
      ),
    }));
  }, [setMusicLibrary]);

  const handleRemoveFromPlaylist = useCallback((playlistId: string, trackId: string) => {
    setMusicLibrary(prev => ({
      ...prev,
      playlists: prev.playlists.map(p => 
        p.id === playlistId 
          ? { ...p, tracks: p.tracks.filter(id => id !== trackId), updatedAt: new Date() }
          : p
      ),
    }));
  }, [setMusicLibrary]);

  const recentTracks = musicLibrary.tracks.filter(track => 
    musicLibrary.recentlyPlayed.includes(track.id)
  );

  const selectedPlaylist = musicLibrary.playlists.find(p => p.id === selectedPlaylistId);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeView
            recentTracks={recentTracks}
            currentTrack={playerState.currentTrack}
            isPlaying={playerState.isPlaying}
            onTrackPlay={handleTrackPlay}
            onTogglePlayPause={togglePlayPause}
            likedSongs={musicLibrary.likedSongs}
            onToggleLike={handleToggleLike}
          />
        );
      case 'library':
        return (
          <LibraryView
            tracks={musicLibrary.tracks}
            currentTrack={playerState.currentTrack}
            isPlaying={playerState.isPlaying}
            onTrackPlay={handleTrackPlay}
            onTogglePlayPause={togglePlayPause}
            likedSongs={musicLibrary.likedSongs}
            onToggleLike={handleToggleLike}
          />
        );
      case 'liked':
        return (
          <LikedSongsView
            tracks={musicLibrary.tracks}
            likedSongs={musicLibrary.likedSongs}
            currentTrack={playerState.currentTrack}
            isPlaying={playerState.isPlaying}
            onTrackPlay={handleTrackPlay}
            onTogglePlayPause={togglePlayPause}
            onToggleLike={handleToggleLike}
          />
        );
      case 'settings':
        return (
          <SettingsView
            onLoadTracks={handleLoadTracks}
            tracksCount={musicLibrary.tracks.length}
          />
        );
      case 'playlist':
        return selectedPlaylist ? (
          <PlaylistView
            playlist={selectedPlaylist}
            tracks={musicLibrary.tracks}
            currentTrack={playerState.currentTrack}
            isPlaying={playerState.isPlaying}
            onTrackPlay={handleTrackPlay}
            onTogglePlayPause={togglePlayPause}
            likedSongs={musicLibrary.likedSongs}
            onToggleLike={handleToggleLike}
            onUpdatePlaylist={handleUpdatePlaylist}
            onDeletePlaylist={handleDeletePlaylist}
            onAddToPlaylist={handleAddToPlaylist}
            onRemoveFromPlaylist={handleRemoveFromPlaylist}
          />
        ) : (
          <div className="p-6">
            <p className="text-gray-400">Playlist not found</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          playlists={musicLibrary.playlists}
          onCreatePlaylist={handleCreatePlaylist}
          selectedPlaylistId={selectedPlaylistId}
          onSelectPlaylist={setSelectedPlaylistId}
        />
        
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 to-black">
          {renderCurrentView()}
        </main>
      </div>
      
      <Player
        playerState={playerState}
        onTogglePlayPause={togglePlayPause}
        onPlayNext={playNext}
        onPlayPrevious={playPrevious}
        onSeek={seekTo}
        onVolumeChange={setVolume}
        onToggleMute={toggleMute}
        onToggleShuffle={toggleShuffle}
        onToggleRepeat={toggleRepeat}
        likedSongs={musicLibrary.likedSongs}
        onToggleLike={handleToggleLike}
      />
    </div>
  );
}

export default App;