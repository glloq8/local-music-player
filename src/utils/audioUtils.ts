import { Track } from '../types/music';

// Access jsmediatags from global window object
declare global {
  interface Window {
    jsmediatags: any;
  }
}

const jsmediatags = window.jsmediatags;

export function formatTime(seconds: number): string {
  if (isNaN(seconds)) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function extractMetadataFromFile(file: File): Promise<Partial<Track>> {
  return new Promise((resolve) => {
    // First try to read ID3 tags
    jsmediatags.read(file, {
      onSuccess: (tag) => {
        const audio = new Audio();
        const url = URL.createObjectURL(file);
        audio.src = url;
        
        audio.addEventListener('loadedmetadata', () => {
          const tags = tag.tags;
          
          resolve({
            title: tags.title || extractTitleFromFilename(file.name),
            artist: tags.artist || 'Unknown Artist',
            album: tags.album || 'Unknown Album',
            duration: audio.duration || 0,
            coverArt: tags.picture ? createCoverArtUrl(tags.picture) : undefined,
          });
          
          URL.revokeObjectURL(url);
        });
        
        audio.addEventListener('error', () => {
          const tags = tag.tags;
          resolve({
            title: tags.title || extractTitleFromFilename(file.name),
            artist: tags.artist || 'Unknown Artist',
            album: tags.album || 'Unknown Album',
            duration: 0,
            coverArt: tags.picture ? createCoverArtUrl(tags.picture) : undefined,
          });
          URL.revokeObjectURL(url);
        });
      },
      onError: () => {
        // Fallback to filename parsing if ID3 reading fails
        const audio = new Audio();
        const url = URL.createObjectURL(file);
        audio.src = url;
        
        audio.addEventListener('loadedmetadata', () => {
          const fileName = file.name.replace(/\.[^/.]+$/, '');
          const parts = fileName.split(' - ');
          
          let artist = 'Unknown Artist';
          let title = fileName;
          
          if (parts.length >= 2) {
            artist = parts[0].trim();
            title = parts[1].trim();
          }
          
          resolve({
            title,
            artist,
            album: 'Unknown Album',
            duration: audio.duration || 0,
          });
          
          URL.revokeObjectURL(url);
        });
        
        audio.addEventListener('error', () => {
          resolve({
            title: extractTitleFromFilename(file.name),
            artist: 'Unknown Artist',
            album: 'Unknown Album',
            duration: 0,
          });
          URL.revokeObjectURL(url);
        });
      }
    });
  });
}

function extractTitleFromFilename(filename: string): string {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  const parts = nameWithoutExt.split(' - ');
  return parts.length >= 2 ? parts[1].trim() : nameWithoutExt;
}

function createCoverArtUrl(picture: any): string {
  if (!picture || !picture.data) return '';
  
  const byteArray = new Uint8Array(picture.data);
  const blob = new Blob([byteArray], { type: picture.format });
  return URL.createObjectURL(blob);
}

export function createTrackFromFile(file: File): Promise<Track> {
  return new Promise(async (resolve) => {
    const metadata = await extractMetadataFromFile(file);
    const url = URL.createObjectURL(file);
    
    const track: Track = {
      id: `${file.name}-${file.lastModified}`,
      title: metadata.title || file.name,
      artist: metadata.artist || 'Unknown Artist',
      album: metadata.album || 'Unknown Album',
      duration: metadata.duration || 0,
      file,
      url,
    };
    
    resolve(track);
  });
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}