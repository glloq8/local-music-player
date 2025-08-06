import React from 'react';
import { Play, Pause, Heart, MoreHorizontal } from 'lucide-react';
import { Track } from '../types/music';
import { formatTime } from '../utils/audioUtils';

interface TrackListProps {
  tracks: Track[];
  currentTrack?: Track | null;
  isPlaying: boolean;
  onTrackPlay: (track: Track, queue: Track[], index: number) => void;
  onTogglePlayPause: () => void;
  likedSongs: string[];
  onToggleLike: (trackId: string) => void;
  showIndex?: boolean;
}

export function TrackList({
  tracks,
  currentTrack,
  isPlaying,
  onTrackPlay,
  onTogglePlayPause,
  likedSongs,
  onToggleLike,
  showIndex = true,
}: TrackListProps) {
  const handleTrackClick = (track: Track, index: number) => {
    if (currentTrack?.id === track.id) {
      onTogglePlayPause();
    } else {
      onTrackPlay(track, tracks, index);
    }
  };

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-800">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-6">Title</div>
        <div className="col-span-3">Album</div>
        <div className="col-span-1 text-center">
          <Heart className="w-4 h-4 mx-auto" />
        </div>
        <div className="col-span-1 text-right">Duration</div>
      </div>

      {/* Track List */}
      {tracks.map((track, index) => {
        const isCurrentTrack = currentTrack?.id === track.id;
        const isLiked = likedSongs.includes(track.id);

        return (
          <div
            key={track.id}
            className="grid grid-cols-12 gap-4 px-4 py-2 rounded-md hover:bg-gray-800 group transition-colors cursor-pointer"
            onClick={() => handleTrackClick(track, index)}
          >
            {/* Index/Play Button */}
            <div className="col-span-1 flex items-center justify-center">
              {isCurrentTrack ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePlayPause();
                  }}
                  className="text-green-500"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
              ) : (
                <>
                  <span className="text-gray-400 group-hover:hidden text-sm">
                    {showIndex ? index + 1 : ''}
                  </span>
                  <Play className="w-4 h-4 text-white hidden group-hover:block" />
                </>
              )}
            </div>

            {/* Title & Artist */}
            <div className="col-span-6 flex flex-col justify-center min-w-0">
              <div
                className={`font-medium truncate ${
                  isCurrentTrack ? 'text-green-500' : 'text-white'
                }`}
              >
                {track.title}
              </div>
              <div className="text-sm text-gray-400 truncate">{track.artist}</div>
            </div>

            {/* Album */}
            <div className="col-span-3 flex items-center">
              <span className="text-gray-400 text-sm truncate">{track.album}</span>
            </div>

            {/* Like Button */}
            <div className="col-span-1 flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLike(track.id);
                }}
                className={`transition-colors ${
                  isLiked ? 'text-green-500' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Duration */}
            <div className="col-span-1 flex items-center justify-end">
              <span className="text-gray-400 text-sm">
                {formatTime(track.duration)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}