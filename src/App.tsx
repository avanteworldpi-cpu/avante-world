import { useState, useEffect } from 'react';
import { AvatarSelector } from './components/AvatarSelector';
import { MapSelector } from './components/MapSelector';
import { AvatarMapView } from './components/AvatarMapView';
import { supabase, getUserAvatarPreference, setUserAvatarPreference, AVATAR_URLS, AvatarType } from './lib/supabase';

function App() {
  const [avatarSelected, setAvatarSelected] = useState(false);
  const [locationSelected, setLocationSelected] = useState(false);
  const [startLocation, setStartLocation] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPreference = async () => {
      const preference = await getUserAvatarPreference();
      if (preference) {
        setAvatarSelected(true);
        localStorage.setItem('sharedAvatarUrl', AVATAR_URLS[preference]);
      } else {
        localStorage.setItem('sharedAvatarUrl', AVATAR_URLS.avatar_1);
      }
      setIsLoading(false);
    };
    checkPreference();
  }, []);

  if (isLoading) return <div className="w-full h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  if (!avatarSelected) return <AvatarSelector onSelect={async (t) => { await setUserAvatarPreference(t); localStorage.setItem('sharedAvatarUrl', AVATAR_URLS[t]); setAvatarSelected(true); }} />;
  if (!locationSelected) return <MapSelector onLocationSelect={(lat, lng) => { setStartLocation([lat, lng]); setLocationSelected(true); }} />;
  if (!startLocation) return <div className="w-full h-screen bg-gray-900 flex items-center justify-center text-white">Loading game...</div>;

  const avatarUrl = localStorage.getItem('sharedAvatarUrl');
  return <AvatarMapView avatarUrl={avatarUrl} startLocation={startLocation} />;
}

export default App;
