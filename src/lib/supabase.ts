import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const AVATAR_URLS = {
  avatar_1: 'https://models.readyplayer.me/6924de287b7a88e1f6b52c37.glb'
};

export type AvatarType = keyof typeof AVATAR_URLS;

export interface AvatarOption {
  id: AvatarType;
  name: string;
  thumbnailUrl: string;
}

export const AVAILABLE_AVATARS: AvatarOption[] = [
  {
    id: 'avatar_1',
    name: 'Avatar 1',
    thumbnailUrl: 'https://avante-world.readyplayer.me/avatar?id=6924de287b7a88e1f6b52c37'
  }
];

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
