import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type AvatarType = 'avatar_1' | 'avatar_2' | 'avatar_3';

export const SHARED_AVATAR_URL = `${supabaseUrl}/storage/v1/object/public/avatars/shared-avatar.glb`;

export const AVATAR_URLS: Record<AvatarType, string> = {
  avatar_1: 'https://models.readyplayer.me/65b8c5df1e3e30001fa5c457.glb',
  avatar_2: 'https://models.readyplayer.me/65b8c5df1e3e30001fa5c459.glb',
  avatar_3: 'https://models.readyplayer.me/65b8c5df1e3e30001fa5c45a.glb'
};

export async function getUserAvatarPreference(): Promise<AvatarType | string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_avatars')
      .select('custom_avatar_url')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching avatar preference:', error);
      return null;
    }

    if (data?.custom_avatar_url) {
      return data.custom_avatar_url;
    }

    const avatar = localStorage.getItem('avatarPreference');
    return (avatar as AvatarType) || null;
  } catch (error) {
    console.error('Error fetching avatar preference:', error);
    return null;
  }
}

export async function setUserAvatarPreference(avatar: AvatarType): Promise<boolean> {
  try {
    localStorage.setItem('avatarPreference', avatar);
    return true;
  } catch (error) {
    console.error('Error setting avatar preference:', error);
    return false;
  }
}

export async function setCustomAvatarUrl(avatarUrl: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('user_avatars')
      .upsert({
        user_id: user.id,
        custom_avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (error) {
      console.error('Error saving avatar URL:', error);
      return false;
    }

    localStorage.setItem('sharedAvatarUrl', avatarUrl);
    return true;
  } catch (error) {
    console.error('Error setting custom avatar:', error);
    return false;
  }
}
