import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

interface RPMCustomizerProps {
  onAvatarSelected: (avatarUrl: string) => void;
  onCancel: () => void;
}

export function RPMCustomizer({ onAvatarSelected, onCancel }: RPMCustomizerProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://avatars.readyplayer.me') return;

      if (event.data.source === 'readyplayer.me') {
        if (event.data.eventName === 'subscribe') {
          setIsReady(true);
        }
        if (event.data.eventName === 'avatarExported') {
          const avatarUrl = event.data.data.url;
          onAvatarSelected(avatarUrl);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onAvatarSelected]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="w-full max-w-4xl">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">Create Your Avatar</h1>
          <p className="text-gray-400">Customize your appearance in Avante World</p>
        </div>

        <div className="relative bg-gray-800 rounded-lg overflow-hidden shadow-2xl" style={{ height: '600px' }}>
          {!isReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
              <div className="flex flex-col items-center gap-4">
                <Loader className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-gray-400">Loading avatar creator...</p>
              </div>
            </div>
          )}
          <iframe
            src="https://avatars.readyplayer.me?frameApi&clearCache"
            allow="camera *; microphone *"
            className="w-full h-full border-0"
          />
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <p className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Once you finish customizing, click the export button in the creator
          </p>
        </div>
      </div>
    </div>
  );
}
