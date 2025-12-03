import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type AvatarType = 'avatar_1' | 'avatar_2' | 'avatar_3';

export const AVATAR_URLS: Record<AvatarType, string> = {
  avatar_1: 'https://models.readyplayer.me/6924de287b7a88e1f6b52c37.glb',
  avatar_2: 'https://models.readyplayer.me/6924de287b7a88e1f6b52c38.glb',
  avatar_3: 'https://models.readyplayer.me/6924de287b7a88e1f6b52c39.glb'
};

export async function getUserAvatarPreference(): Promise<AvatarType | null> {
  try {
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
