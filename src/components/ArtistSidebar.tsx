import React, { useState } from 'react';
import { ChevronRight, ChevronDown, User, Music } from 'lucide-react';
import { Album } from '../types/music';

interface ArtistSidebarProps {
  albumsByArtist: Map<string, Album[]>;
  selectedAlbum?: Album;
  onAlbumSelect: (album: Album) => void;
}

export function ArtistSidebar({ albumsByArtist, selectedAlbum, onAlbumSelect }: ArtistSidebarProps) {
  const [expandedArtists, setExpandedArtists] = useState<Set<string>>(new Set());

  const toggleArtist = (artist: string) => {
    const newExpanded = new Set(expandedArtists);
    if (newExpanded.has(artist)) {
      newExpanded.delete(artist);
    } else {
      newExpanded.add(artist);
    }
    setExpandedArtists(newExpanded);
  };

  const sortedArtists = Array.from(albumsByArtist.keys()).sort();

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 overflow-y-auto">
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <User className="w-5 h-5 mr-2" />
          Artists
        </h3>
      </div>
      
      <div className="p-2">
        {sortedArtists.map((artist) => {
          const albums = albumsByArtist.get(artist)!;
          const isExpanded = expandedArtists.has(artist);
          const hasMultipleAlbums = albums.length > 1;

          return (
            <div key={artist} className="mb-1">
              <button
                onClick={() => {
                  if (hasMultipleAlbums) {
                    toggleArtist(artist);
                  } else {
                    onAlbumSelect(albums[0]);
                  }
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors"
              >
                <span className="truncate">{artist}</span>
                {hasMultipleAlbums && (
                  <span className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">{albums.length}</span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </span>
                )}
              </button>

              {hasMultipleAlbums && isExpanded && (
                <div className="ml-4 mt-1 space-y-1">
                  {albums.map((album) => (
                    <button
                      key={album.id}
                      onClick={() => onAlbumSelect(album)}
                      className={`w-full flex items-center px-3 py-2 text-left text-sm rounded transition-colors ${
                        selectedAlbum?.id === album.id
                          ? 'bg-green-600 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <Music className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span className="truncate">{album.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}