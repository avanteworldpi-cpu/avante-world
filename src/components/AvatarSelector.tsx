import React, { useState } from 'react';
import { AVATAR_URLS, AvatarType } from '../lib/supabase';

interface AvatarOption {
  id: AvatarType;
  label: string;
  emoji: string;
  color: string;
  description: string;
}

interface AvatarSelectorProps {
  onSelect: (avatarType: AvatarType) => Promise<void>;
  isLoading?: boolean;
}

const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'male_1', label: 'Male 1', emoji: '👨', color: 'from-blue-600 to-blue-900', description: 'Classic Male Avatar' },
  { id: 'male_2', label: 'Male 2', emoji: '🧔', color: 'from-slate-600 to-slate-900', description: 'Bearded Male Avatar' },
  { id: 'male_casual', label: 'Male Casual', emoji: '👨‍💼', color: 'from-cyan-600 to-cyan-900', description: 'Business Casual' },
  { id: 'female_1', label: 'Female 1', emoji: '👩', color: 'from-pink-600 to-pink-900', description: 'Classic Female Avatar' },
  { id: 'female_2', label: 'Female 2', emoji: '👧', color: 'from-rose-600 to-rose-900', description: 'Young Female Avatar' },
  { id: 'female_casual', label: 'Female Casual', emoji: '👩‍💼', color: 'from-fuchsia-600 to-fuchsia-900', description: 'Professional Female' },
  { id: 'neutral_1', label: 'Neutral 1', emoji: '🧑', color: 'from-orange-600 to-orange-900', description: 'Gender Neutral' },
  { id: 'neutral_2', label: 'Neutral 2', emoji: '🧙', color: 'from-purple-600 to-purple-900', description: 'Fantasy Character' },
];

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

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {AVATAR_OPTIONS.map((avatar) => (
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
              <div className={`bg-gradient-to-br ${avatar.color} aspect-square flex flex-col items-center justify-center p-6`}>
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {avatar.emoji}
                </div>
                <h3 className="text-xl font-bold text-white mb-1 text-center">{avatar.label}</h3>
                <p className="text-sm text-white/80 text-center">{avatar.description}</p>
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
