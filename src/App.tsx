import { useState, useEffect } from 'react';
import { AvatarSelector } from './components/AvatarSelector';
import { MapSelector } from './components/MapSelector';
import { ThreeJSScene } from './components/ThreeJSScene';
import { supabase, getUserAvatarPreference, setUserAvatarPreference, AVATAR_URLS, AvatarType } from './lib/supabase';

function App() {
  const [user, setUser] = useState<any>(null);
  const [avatarSelected, setAvatarSelected] = useState(false);
  const [locationSelected, setLocationSelected] = useState(false);
  const [startLocation, setStartLocation] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const preference = await getUserAvatarPreference();
        if (preference) {
          setAvatarSelected(true);
          setSharedAvatarFromPreference(preference);
        }
      }
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        setUser(session?.user || null);
        if (session?.user) {
          const preference = await getUserAvatarPreference();
          if (preference) {
            setAvatarSelected(true);
            setSharedAvatarFromPreference(preference);
          }
        } else {
          setAvatarSelected(false);
        }
      })();
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const setSharedAvatarFromPreference = (avatarType: AvatarType) => {
    const avatarUrl = AVATAR_URLS[avatarType];
    localStorage.setItem('sharedAvatarUrl', avatarUrl);
  };

  const handleAvatarSelect = async (avatarType: AvatarType) => {
    try {
      const success = await setUserAvatarPreference(avatarType);
      if (success) {
        setSharedAvatarFromPreference(avatarType);
        setAvatarSelected(true);
      }
    } catch (error) {
      console.error('Error saving avatar preference:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-2xl mb-8">Please log in to access Avante World 3D</p>
          <div className="space-y-4">
            <p className="text-gray-400">Authentication is required to save your avatar preference</p>
          </div>
        </div>
      </div>
    );
  }

  if (!avatarSelected) {
    return <AvatarSelector onSelect={handleAvatarSelect} isLoading={isLoading} />;
  }

  if (!locationSelected) {
    return (
      <MapSelector
        onLocationSelect={(lat: number, lng: number) => {
          setStartLocation([lat, lng]);
          setLocationSelected(true);
        }}
      />
    );
  }

  if (!startLocation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <p className="text-white">Loading game...</p>
      </div>
    );
  }

  const avatarUrl = localStorage.getItem('sharedAvatarUrl');

  return (
    <ThreeJSScene avatarUrl={avatarUrl} startLocation={startLocation} />
  );
}

export default App;
