import { AvatarType, AVATAR_URLS, setCustomAvatarUrl } from '../lib/supabase';
import { Sparkles } from 'lucide-react';
import { RPMCustomizer } from './RPMCustomizer';
import { useState } from 'react';

interface AvatarSelectorProps {
  onSelect: (avatarType: AvatarType | string) => void;
}

export function AvatarSelector({ onSelect }: AvatarSelectorProps) {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const avatars: AvatarType[] = ['avatar_1', 'avatar_2', 'avatar_3'];

  const handlePresetSelect = (avatar: AvatarType) => {
    localStorage.setItem('sharedAvatarUrl', AVATAR_URLS[avatar]);
    onSelect(avatar);
  };

  const handleCustomAvatarSelected = async (avatarUrl: string) => {
    const success = await setCustomAvatarUrl(avatarUrl);
    if (success) {
      onSelect(avatarUrl);
      setIsCustomizing(false);
    }
  };

  if (isCustomizing) {
    return <RPMCustomizer onAvatarSelected={handleCustomAvatarSelected} onCancel={() => setIsCustomizing(false)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Choose Your Avatar</h1>
          <p className="text-gray-400">Pick a preset or create a custom one</p>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-300 mb-4">Preset Avatars</h2>
            <div className="grid grid-cols-3 gap-4">
              {avatars.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => handlePresetSelect(avatar)}
                  className="group relative bg-gray-800 hover:bg-gray-700 text-white p-6 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
                >
                  <div className="text-sm font-medium text-gray-300 group-hover:text-blue-400 transition-colors">
                    {avatar === 'avatar_1' && 'Classic Blue'}
                    {avatar === 'avatar_2' && 'Urban Style'}
                    {avatar === 'avatar_3' && 'Modern Look'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <h2 className="text-lg font-semibold text-gray-300 mb-4">Create Custom Avatar</h2>
            <button
              onClick={() => setIsCustomizing(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-lg font-semibold flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-blue-500/50"
            >
              <Sparkles className="w-5 h-5" />
              <span>Create Your Own Avatar</span>
            </button>
            <p className="text-gray-400 text-sm mt-2 text-center">
              Design your unique avatar with Ready Player Me
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
