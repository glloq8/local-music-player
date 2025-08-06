import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Heart,
} from 'lucide-react';
import { PlayerState } from '../types/music';
import { formatTime } from '../utils/audioUtils';

interface PlayerProps {
  playerState: PlayerState;
  onTogglePlayPause: () => void;
  onPlayNext: () => void;
  onPlayPrevious: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  likedSongs: string[];
  onToggleLike: (trackId: string) => void;
}

export function Player({
  playerState,
  onTogglePlayPause,
  onPlayNext,
  onPlayPrevious,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleShuffle,
  onToggleRepeat,
  likedSongs,
  onToggleLike,
}: PlayerProps) {
  const { currentTrack, isPlaying, currentTime, duration, volume, isMuted, isShuffled, repeatMode } = playerState;

  if (!currentTrack) {
    return (
      <div className="h-20 bg-gray-900 border-t border-gray-800 flex items-center justify-center">
        <p className="text-gray-400">No track selected</p>
      </div>
    );
  }

  const isLiked = likedSongs.includes(currentTrack.id);
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    onSeek(newTime);
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    onVolumeChange(percentage);
  };

  return (
    <div className="h-20 bg-gray-900 border-t border-gray-800 px-4 flex items-center justify-between">
      {/* Current Track Info */}
      <div className="flex items-center space-x-4 w-1/4 min-w-0">
        <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center">
          <span className="text-xs font-bold text-gray-300">
            {currentTrack.title.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-white truncate">
            {currentTrack.title}
          </div>
          <div className="text-xs text-gray-400 truncate">
            {currentTrack.artist}
          </div>
        </div>
        <button
          onClick={() => onToggleLike(currentTrack.id)}
          className={`transition-colors ${
            isLiked ? 'text-green-500' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Player Controls */}
      <div className="flex flex-col items-center space-y-2 w-1/2 max-w-md">
        {/* Control Buttons */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleShuffle}
            className={`transition-colors ${
              isShuffled ? 'text-green-500' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            onClick={onPlayPrevious}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={onTogglePlayPause}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-black" />
            ) : (
              <Play className="w-4 h-4 text-black ml-0.5" />
            )}
          </button>

          <button
            onClick={onPlayNext}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          <button
            onClick={onToggleRepeat}
            className={`transition-colors ${
              repeatMode !== 'off' ? 'text-green-500' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Repeat className="w-4 h-4" />
            {repeatMode === 'one' && (
              <span className="absolute -mt-1 -ml-1 text-xs">1</span>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center space-x-2 w-full">
          <span className="text-xs text-gray-400 w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <div
            className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer group"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-white rounded-full relative group-hover:bg-green-500 transition-colors"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <span className="text-xs text-gray-400 w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-2 w-1/4 justify-end">
        <button
          onClick={onToggleMute}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
        <div
          className="w-20 h-1 bg-gray-600 rounded-full cursor-pointer group"
          onClick={handleVolumeClick}
        >
          <div
            className="h-full bg-white rounded-full relative group-hover:bg-green-500 transition-colors"
            style={{ width: `${isMuted ? 0 : volume * 100}%` }}
          >
            <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </div>
  );
}