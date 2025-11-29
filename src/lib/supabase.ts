import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const AVATAR_URLS = {
  male_1: 'https://models.readyplayer.me/63e7b16d27f8800c0e3c1b5f.glb',
  male_2: 'https://models.readyplayer.me/65c0f3f8c8e6b5a2d9c4e1f0.glb',
  male_casual: 'https://models.readyplayer.me/65c0f3f8c8e6b5a2d9c4e1f3.glb',
  female_1: 'https://models.readyplayer.me/63e7b16d27f8800c0e3c1b60.glb',
  female_2: 'https://models.readyplayer.me/65c0f3f8c8e6b5a2d9c4e1f1.glb',
  female_casual: 'https://models.readyplayer.me/65c0f3f8c8e6b5a2d9c4e1f4.glb',
  neutral_1: 'https://models.readyplayer.me/65c0f3f8c8e6b5a2d9c4e1f2.glb',
  neutral_2: 'https://models.readyplayer.me/65c0f3f8c8e6b5a2d9c4e1f5.glb'
};

export type AvatarType = keyof typeof AVATAR_URLS;

export async function getUserAvatarPreference(): Promise<AvatarType | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_avatars')
      .select('avatar_type')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;
    return data?.avatar_type as AvatarType || null;
  } catch (error) {
    console.error('Error fetching avatar preference:', error);
    return null;
  }
}

export async function setUserAvatarPreference(avatarType: AvatarType): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('user_avatars')
      .upsert({
        user_id: user.id,
        avatar_type: avatarType,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error setting avatar preference:', error);
    return false;
  }
}

export function getSharedAvatarUrl(): string | null {
  return localStorage.getItem('sharedAvatarUrl');
}

export function setSharedAvatarUrl(url: string): void {
  localStorage.setItem('sharedAvatarUrl', url);
}
