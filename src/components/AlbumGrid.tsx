import React from 'react';
import { Play, Music } from 'lucide-react';
import { Album, Track } from '../types/music';

interface AlbumGridProps {
  albums: Album[];
  onAlbumClick: (album: Album) => void;
  onPlayAlbum: (album: Album) => void;
}

export function AlbumGrid({ albums, onAlbumClick, onPlayAlbum }: AlbumGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {albums.map((album) => (
        <div
          key={album.id}
          className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer group"
          onClick={() => onAlbumClick(album)}
        >
          <div className="relative mb-4">
            {album.coverArt ? (
              <img
                src={album.coverArt}
                alt={`${album.name} cover`}
                className="w-full aspect-square object-cover rounded-md"
              />
            ) : (
              <div className="w-full aspect-square bg-gray-600 rounded-md flex items-center justify-center">
                <Music className="w-8 h-8 text-gray-400" />
              </div>
            )}
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlayAlbum(album);
              }}
              className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-green-400 hover:scale-105"
            >
              <Play className="w-5 h-5 text-black ml-0.5" />
            </button>
          </div>
          
          <div>
            <h3 className="font-semibold text-white truncate mb-1">{album.name}</h3>
            <p className="text-sm text-gray-400 truncate">{album.artist}</p>
            <p className="text-xs text-gray-500 mt-1">
              {album.tracks.length} {album.tracks.length === 1 ? 'song' : 'songs'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}