import { AvatarType } from '../lib/supabase';

interface AvatarSelectorProps {
  onSelect: (avatarType: AvatarType) => void;
}

export function AvatarSelector({ onSelect }: AvatarSelectorProps) {
  const avatars: AvatarType[] = ['avatar_1', 'avatar_2', 'avatar_3'];
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="grid grid-cols-3 gap-4">
        {avatars.map((avatar) => (
          <button
            key={avatar}
            className="bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700"
            onClick={() => onSelect(avatar)}
          >
            {avatar.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
