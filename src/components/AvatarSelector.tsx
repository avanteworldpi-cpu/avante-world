import { SHARED_AVATAR_URL } from '../lib/supabase';
import { useEffect } from 'react';

interface AvatarSelectorProps {
  onSelect: (avatarType: string) => void;
}

export function AvatarSelector({ onSelect }: AvatarSelectorProps) {
  useEffect(() => {
    localStorage.setItem('sharedAvatarUrl', SHARED_AVATAR_URL);
    onSelect(SHARED_AVATAR_URL);
  }, [onSelect]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="text-center">
        <div className="inline-block animate-pulse">
          <div className="w-12 h-12 bg-blue-500 rounded-full mb-4 mx-auto"></div>
        </div>
        <p className="text-gray-400">Loading your avatar...</p>
      </div>
    </div>
  );
}
