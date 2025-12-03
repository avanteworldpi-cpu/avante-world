import React, { useState } from 'react';
import { AvatarType, AVAILABLE_AVATARS } from '../lib/supabase';

interface AvatarSelectorProps {
  onSelect: (avatarType: AvatarType) => Promise<void>;
  isLoading?: boolean;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({ onSelect, isLoading = false }) => {
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarType | null>(null);

  const handleSelect = async (avatarType: AvatarType) => {
    setSelectedAvatar(avatarType);
    await onSelect(avatarType);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">Choose Your Avatar</h1>
          <p className="text-xl text-gray-300">Select from our collection of Ready Player Me avatars</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {AVAILABLE_AVATARS.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => handleSelect(avatar.id)}
              disabled={isLoading}
              className={`group relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                selectedAvatar === avatar.id
                  ? 'ring-4 ring-white scale-105'
                  : 'hover:ring-2 hover:ring-white/50'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="relative aspect-square overflow-hidden bg-gray-800">
                <img
                  src={avatar.thumbnailUrl}
                  alt={avatar.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4">
                <h3 className="text-lg font-bold text-white">{avatar.name}</h3>
              </div>

              {selectedAvatar === avatar.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                  ) : (
                    <div className="text-white text-4xl font-bold">✓</div>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>

        {selectedAvatar && (
          <div className="text-center">
            <p className="text-green-400 text-lg font-semibold animate-pulse">
              {isLoading ? 'Saving your avatar selection...' : `Avatar selected! Ready to explore.`}
            </p>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-center text-gray-400 text-sm">
            You can change your avatar anytime in the character controls
          </p>
        </div>
      </div>
    </div>
  );
};
