import { Track, Album } from '../types/music';

export function groupTracksByAlbum(tracks: Track[]): Album[] {
  const albumMap = new Map<string, Album>();

  tracks.forEach(track => {
    const albumKey = `${track.artist}-${track.album}`;
    
    if (!albumMap.has(albumKey)) {
      albumMap.set(albumKey, {
        id: albumKey,
        name: track.album,
        artist: track.artist,
        tracks: [],
        coverArt: track.coverArt,
      });
    }

    const album = albumMap.get(albumKey)!;
    album.tracks.push(track);
    
    // Use the first track's cover art if available
    if (!album.coverArt && track.coverArt) {
      album.coverArt = track.coverArt;
    }
  });

  // Sort tracks within each album by track number or title
  albumMap.forEach(album => {
    album.tracks.sort((a, b) => {
      // Sort by track number first, then by title
      if (a.trackNumber && b.trackNumber) {
        return a.trackNumber - b.trackNumber;
      }
      if (a.trackNumber && !b.trackNumber) return -1;
      if (!a.trackNumber && b.trackNumber) return 1;
      return a.title.localeCompare(b.title);
    });
  });

  return Array.from(albumMap.values()).sort((a, b) => {
    // Sort by artist first, then by album name
    const artistCompare = a.artist.localeCompare(b.artist);
    return artistCompare !== 0 ? artistCompare : a.name.localeCompare(b.name);
  });
}

export function groupAlbumsByArtist(albums: Album[]): Map<string, Album[]> {
  const artistMap = new Map<string, Album[]>();

  albums.forEach(album => {
    if (!artistMap.has(album.artist)) {
      artistMap.set(album.artist, []);
    }
    artistMap.get(album.artist)!.push(album);
  });

  // Sort albums within each artist
  artistMap.forEach(albums => {
    albums.sort((a, b) => a.name.localeCompare(b.name));
  });

  return artistMap;
}