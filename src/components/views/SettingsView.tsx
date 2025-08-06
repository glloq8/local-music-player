import React, { useRef } from 'react';
import { Folder, Upload, Info } from 'lucide-react';
import { Track } from '../../types/music';

interface SettingsViewProps {
  onLoadTracks: (tracks: Track[]) => void;
  tracksCount: number;
}

export function SettingsView({ onLoadTracks, tracksCount }: SettingsViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFolderSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const mp3Files = Array.from(files).filter(
      (file) => file.type === 'audio/mpeg' || file.name.toLowerCase().endsWith('.mp3')
    );

    if (mp3Files.length === 0) {
      alert('No MP3 files found in the selected folder.');
      return;
    }

    const { createTrackFromFile } = await import('../../utils/audioUtils');
    
    try {
      const tracks = await Promise.all(
        mp3Files.map((file) => createTrackFromFile(file))
      );
      
      onLoadTracks(tracks);
    } catch (error) {
      console.error('Error loading tracks:', error);
      alert('Error loading some tracks. Please try again.');
    }
  };

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

      {/* Music Library Section */}
      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Folder className="w-5 h-5 mr-2" />
          Music Library
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div>
              <p className="text-white font-medium">Current Library</p>
              <p className="text-gray-400 text-sm">
                {tracksCount} songs loaded
              </p>
            </div>
            <button
              onClick={handleFolderSelect}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Load Music Folder</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".mp3,audio/mpeg"
            onChange={handleFileChange}
            className="hidden"
            webkitdirectory=""
            directory=""
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <Info className="w-5 h-5 mr-2 text-blue-400" />
          How to Load Your Music
        </h3>
        
        <div className="space-y-3 text-gray-300">
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-sm rounded-full flex items-center justify-center font-medium">1</span>
            <p>Click the "Load Music Folder" button above</p>
          </div>
          
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-sm rounded-full flex items-center justify-center font-medium">2</span>
            <p>Select the folder containing your MP3 files</p>
          </div>
          
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-sm rounded-full flex items-center justify-center font-medium">3</span>
            <p>The app will automatically scan and load all MP3 files from the selected folder</p>
          </div>
          
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-sm rounded-full flex items-center justify-center font-medium">4</span>
            <p>Your music will appear in the Library section and you can start creating playlists</p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-800 rounded">
          <p className="text-yellow-200 text-sm">
            <strong>Note:</strong> For best results, organize your MP3 files with proper metadata (artist, title, album). 
            Files named in "Artist - Title\" format will be automatically parsed.
          </p>
        </div>
      </div>
    </div>
  );
}