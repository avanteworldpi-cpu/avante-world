import { useState, useEffect } from 'react';
import { getMarketplaceAvatars, getUserCustomAvatars, getAvatarStorageUrl, MarketplaceAvatar, UserCustomAvatar } from '../lib/supabase';
import { Loader2, Upload } from 'lucide-react';

interface AvatarGalleryProps {
  onSelectMarketplaceAvatar: (avatar: MarketplaceAvatar) => void;
  onSelectCustomAvatar: (avatar: UserCustomAvatar) => void;
  selectedAvatarId?: string;
  isCustomSelected?: boolean;
}

export function AvatarGallery({
  onSelectMarketplaceAvatar,
  onSelectCustomAvatar,
  selectedAvatarId,
  isCustomSelected
}: AvatarGalleryProps) {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'uploads'>('marketplace');
  const [marketplaceAvatars, setMarketplaceAvatars] = useState<MarketplaceAvatar[]>([]);
  const [customAvatars, setCustomAvatars] = useState<UserCustomAvatar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAvatars();
  }, []);

  async function loadAvatars() {
    try {
      setLoading(true);
      setError(null);

      const [marketplace, custom] = await Promise.all([
        getMarketplaceAvatars(),
        getUserCustomAvatars()
      ]);

      setMarketplaceAvatars(marketplace);
      setCustomAvatars(custom);
    } catch (err) {
      console.error('Error loading avatars:', err);
      setError('Failed to load avatars');
    } finally {
      setLoading(false);
    }
  }

  function handleRefresh() {
    loadAvatars();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === 'marketplace'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Marketplace
        </button>
        <button
          onClick={() => setActiveTab('uploads')}
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === 'uploads'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          My Uploads ({customAvatars.length})
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      {activeTab === 'marketplace' && (
        <div className="space-y-4">
          {marketplaceAvatars.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No marketplace avatars available
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketplaceAvatars.map(avatar => (
                <AvatarCard
                  key={avatar.id}
                  avatar={avatar}
                  isSelected={selectedAvatarId === avatar.id && !isCustomSelected}
                  onClick={() => onSelectMarketplaceAvatar(avatar)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'uploads' && (
        <div className="space-y-4">
          {customAvatars.length === 0 ? (
            <div className="text-center py-12">
              <Upload className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No custom avatars yet</p>
              <p className="text-gray-400 text-sm">Upload a GLB or GLTF file to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {customAvatars.map(avatar => (
                <CustomAvatarCard
                  key={avatar.id}
                  avatar={avatar}
                  isSelected={selectedAvatarId === avatar.storage_path && isCustomSelected}
                  onClick={() => onSelectCustomAvatar(avatar)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface AvatarCardProps {
  avatar: MarketplaceAvatar;
  isSelected: boolean;
  onClick: () => void;
}

function AvatarCard({ avatar, isSelected, onClick }: AvatarCardProps) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-lg border-2 transition-all text-left ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-lg'
          : 'border-gray-200 hover:border-blue-300 bg-white hover:shadow-md'
      }`}
    >
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-md mb-3 flex items-center justify-center overflow-hidden">
        {avatar.thumbnail_url ? (
          <img
            src={avatar.thumbnail_url}
            alt={avatar.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-sm">No preview</div>
        )}
      </div>
      <h3 className="font-semibold text-gray-900">{avatar.name}</h3>
      <p className="text-xs text-gray-500 capitalize mb-2">{avatar.gender_type}</p>
      {avatar.description && (
        <p className="text-sm text-gray-600 line-clamp-2">{avatar.description}</p>
      )}
    </button>
  );
}

interface CustomAvatarCardProps {
  avatar: UserCustomAvatar;
  isSelected: boolean;
  onClick: () => void;
}

function CustomAvatarCard({ avatar, isSelected, onClick }: CustomAvatarCardProps) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-lg border-2 transition-all text-left ${
        isSelected
          ? 'border-green-500 bg-green-50 shadow-lg'
          : 'border-gray-200 hover:border-green-300 bg-white hover:shadow-md'
      }`}
    >
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-md mb-3 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-gray-400 mb-1">3D</div>
          <div className="text-xs text-gray-500 uppercase font-semibold">{avatar.file_type}</div>
        </div>
      </div>
      <h3 className="font-semibold text-gray-900 truncate">{avatar.filename}</h3>
      <p className="text-xs text-gray-500 mb-2">
        {(avatar.file_size / 1024).toFixed(1)} KB
      </p>
      <p className="text-xs text-gray-400">
        {new Date(avatar.uploaded_at).toLocaleDateString()}
      </p>
    </button>
  );
}
