import { useState, useRef, useEffect, useCallback } from 'react';
import { Track, PlayerState } from '../types/music';

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    isShuffled: false,
    repeatMode: 'off',
    queue: [],
    queueIndex: -1,
  });

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setPlayerState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
      }));
    };

    const handleLoadedMetadata = () => {
      setPlayerState(prev => ({
        ...prev,
        duration: audio.duration,
      }));
    };

    const handleEnded = () => {
      if (playerState.repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  const playTrack = useCallback((track: Track, queue: Track[] = [], startIndex: number = 0) => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    audio.src = track.url;
    audio.load();

    setPlayerState(prev => ({
      ...prev,
      currentTrack: track,
      queue: queue.length > 0 ? queue : [track],
      queueIndex: startIndex,
      isPlaying: true,
    }));

    audio.play().catch(console.error);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !playerState.currentTrack) return;

    const audio = audioRef.current;
    
    if (playerState.isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }

    setPlayerState(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }));
  }, [playerState.isPlaying, playerState.currentTrack]);

  const playNext = useCallback(() => {
    if (playerState.queue.length === 0) return;

    let nextIndex = playerState.queueIndex + 1;
    
    if (nextIndex >= playerState.queue.length) {
      if (playerState.repeatMode === 'all') {
        nextIndex = 0;
      } else {
        return;
      }
    }

    const nextTrack = playerState.queue[nextIndex];
    if (nextTrack) {
      playTrack(nextTrack, playerState.queue, nextIndex);
    }
  }, [playerState.queue, playerState.queueIndex, playerState.repeatMode, playTrack]);

  const playPrevious = useCallback(() => {
    if (playerState.queue.length === 0) return;

    let prevIndex = playerState.queueIndex - 1;
    
    if (prevIndex < 0) {
      if (playerState.repeatMode === 'all') {
        prevIndex = playerState.queue.length - 1;
      } else {
        return;
      }
    }

    const prevTrack = playerState.queue[prevIndex];
    if (prevTrack) {
      playTrack(prevTrack, playerState.queue, prevIndex);
    }
  }, [playerState.queue, playerState.queueIndex, playerState.repeatMode, playTrack]);

  const seekTo = useCallback((time: number) => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = time;
    setPlayerState(prev => ({
      ...prev,
      currentTime: time,
    }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (!audioRef.current) return;
    
    const clampedVolume = Math.max(0, Math.min(1, volume));
    audioRef.current.volume = clampedVolume;
    
    setPlayerState(prev => ({
      ...prev,
      volume: clampedVolume,
      isMuted: clampedVolume === 0,
    }));
  }, []);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    
    const newMutedState = !playerState.isMuted;
    audioRef.current.muted = newMutedState;
    
    setPlayerState(prev => ({
      ...prev,
      isMuted: newMutedState,
    }));
  }, [playerState.isMuted]);

  const toggleShuffle = useCallback(() => {
    setPlayerState(prev => ({
      ...prev,
      isShuffled: !prev.isShuffled,
    }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setPlayerState(prev => ({
      ...prev,
      repeatMode: prev.repeatMode === 'off' ? 'all' : prev.repeatMode === 'all' ? 'one' : 'off',
    }));
  }, []);

  return {
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
  };
}