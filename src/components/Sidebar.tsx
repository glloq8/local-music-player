import React from 'react';
import { Home, Search, Library, Heart, Settings, Plus, Music } from 'lucide-react';
import { ViewType, Playlist } from '../types/music';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  playlists: Playlist[];
  onCreatePlaylist: () => void;
  selectedPlaylistId?: string;
  onSelectPlaylist: (playlistId: string) => void;
}

export function Sidebar({ 
  currentView, 
  onViewChange, 
  playlists, 
  onCreatePlaylist,
  selectedPlaylistId,
  onSelectPlaylist 
}: SidebarProps) {
  const mainNavItems = [
    { id: 'home' as ViewType, icon: Home, label: 'Home' },
    { id: 'library' as ViewType, icon: Library, label: 'Your Library' },
    { id: 'liked' as ViewType, icon: Heart, label: 'Liked Songs' },
    { id: 'settings' as ViewType, icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-black h-full flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Music className="w-8 h-8 text-green-500" />
          <span className="text-xl font-bold text-white">Music Player</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="px-3">
        <ul className="space-y-2">
          {mainNavItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Playlists Section */}
      <div className="mt-8 px-3 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Playlists
          </h3>
          <button
            onClick={onCreatePlaylist}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Create Playlist"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1 overflow-y-auto scrollbar-hide">
          {playlists.map((playlist) => (
            <button
              key={playlist.id}
              onClick={() => {
                onSelectPlaylist(playlist.id);
                onViewChange('playlist');
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                currentView === 'playlist' && selectedPlaylistId === playlist.id
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <div className="truncate">{playlist.name}</div>
              <div className="text-xs text-gray-500 truncate">
                {playlist.tracks.length} songs
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}