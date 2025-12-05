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

  if (isLoading) return <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center"><div className="text-center"><div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p className="text-xl font-semibold text-gray-900">Loading...</p></div></div>;
  if (!avatarSelected) return <AvatarSelector onSelect={async (t) => { await setUserAvatarPreference(t); localStorage.setItem('sharedAvatarUrl', AVATAR_URLS[t]); setAvatarSelected(true); }} />;
  if (!locationSelected) return <MapSelector onLocationSelect={(lat, lng) => { setStartLocation([lat, lng]); setLocationSelected(true); }} />;
  if (!startLocation) return <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center"><div className="text-center"><div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p className="text-xl font-semibold text-gray-900">Loading game...</p></div></div>;

  const avatarUrl = localStorage.getItem('sharedAvatarUrl');
  return <AvatarMapView avatarUrl={avatarUrl} startLocation={startLocation} />;
}

export default App;
