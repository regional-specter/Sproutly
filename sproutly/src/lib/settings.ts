import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { Linking, Platform } from 'react-native';

import { supabase } from '@/lib/supabase';

const LANGUAGE_KEY = 'sproutly:language';
const FEEDBACK_EMAIL = 'support@sproutly.app';
const PLANT_IMAGES_BUCKET = 'plant-images';
const ANDROID_PACKAGE = 'com.anonymous.sproutly';

export const LANGUAGES = [{ code: 'en', label: 'English' }] as const;

export type LanguageCode = (typeof LANGUAGES)[number]['code'];

export function getLanguageLabel(code: LanguageCode): string {
  return LANGUAGES.find((language) => language.code === code)?.label ?? 'English';
}

export async function getLanguagePreference(): Promise<LanguageCode> {
  const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
  if (stored === 'en') return 'en';
  return 'en';
}

export async function setLanguagePreference(code: LanguageCode): Promise<void> {
  await AsyncStorage.setItem(LANGUAGE_KEY, code);
}

export async function updateProfileDetails(
  userId: string,
  updates: { fullName?: string; avatarUrl?: string | null },
): Promise<void> {
  const payload: { full_name?: string; avatar_url?: string | null; updated_at: string } = {
    updated_at: new Date().toISOString(),
  };

  if (updates.fullName !== undefined) {
    const trimmedName = updates.fullName.trim();
    if (!trimmedName) {
      throw new Error('Enter your name');
    }
    payload.full_name = trimmedName;
  }

  if (updates.avatarUrl !== undefined) {
    payload.avatar_url = updates.avatarUrl;
  }

  const { error } = await supabase.from('profiles').update(payload).eq('id', userId);
  if (error) throw error;
}

export async function uploadAvatarImage(userId: string, localUri: string): Promise<string> {
  const response = await fetch(localUri);
  const arrayBuffer = await response.arrayBuffer();
  const extension = localUri.split('.').pop()?.split('?')[0] ?? 'jpg';
  const contentType = extension === 'png' ? 'image/png' : 'image/jpeg';
  const filePath = `${userId}/avatars/${Crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(PLANT_IMAGES_BUCKET)
    .upload(filePath, arrayBuffer, {
      contentType,
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(PLANT_IMAGES_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

export async function deleteUserAccount(): Promise<void> {
  const { error } = await supabase.rpc('delete_user');
  if (error) throw error;
}

export async function openAppStoreReview(): Promise<void> {
  const url =
    Platform.OS === 'android'
      ? `market://details?id=${ANDROID_PACKAGE}`
      : 'https://apps.apple.com/search?term=Sproutly';

  const supported = await Linking.canOpenURL(url);
  if (!supported) {
    throw new Error('Unable to open the app store on this device.');
  }

  await Linking.openURL(url);
}

export async function openFeedbackEmail(): Promise<void> {
  const subject = encodeURIComponent('Sproutly feedback');
  const body = encodeURIComponent('Hi Sproutly team,\n\n');
  const url = `mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`;

  const supported = await Linking.canOpenURL(url);
  if (!supported) {
    throw new Error('Unable to open your email app.');
  }

  await Linking.openURL(url);
}

export function isPremiumActive(profile: {
  is_premium: boolean;
  premium_expires_at: string | null;
} | null): boolean {
  if (!profile?.is_premium) return false;
  if (!profile.premium_expires_at) return true;
  return new Date(profile.premium_expires_at) > new Date();
}
