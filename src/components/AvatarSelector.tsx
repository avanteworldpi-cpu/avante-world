import { User } from 'lucide-react';
import { AvatarType } from '../lib/supabase';

interface AvatarSelectorProps {
  onSelect: (avatarType: AvatarType) => void;
}

export function AvatarSelector({ onSelect }: AvatarSelectorProps) {
  const avatars: { type: AvatarType; name: string; description: string }[] = [
    { type: 'avatar_1', name: 'Explorer', description: 'Ready for adventure' },
    { type: 'avatar_2', name: 'Wanderer', description: 'Discover the world' },
    { type: 'avatar_3', name: 'Traveler', description: 'Journey awaits' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">Choose Your Avatar</h1>
          <p className="text-xl text-gray-600">Select your character to begin exploring Avante World</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {avatars.map((avatar) => (
            <button
              key={avatar.type}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-blue-500"
              onClick={() => onSelect(avatar.type)}
            >
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <User className="w-12 h-12 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{avatar.name}</h3>
                <p className="text-gray-600 text-sm">{avatar.description}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">Click on any avatar to continue</p>
        </div>
      </div>
    </div>
  );
}
