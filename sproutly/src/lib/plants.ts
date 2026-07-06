import * as Crypto from 'expo-crypto';

import { generatePlantCareSchedules } from '@/lib/care-schedule';
import { supabase } from '@/lib/supabase';
import type { Plant, Profile } from '@/types/database';

const PLANT_IMAGES_BUCKET = 'plant-images';

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateProfileName(userId: string, fullName: string) {
  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName.trim(), updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) throw error;
}

export async function uploadPlantImage(userId: string, localUri: string): Promise<string> {
  const response = await fetch(localUri);
  const arrayBuffer = await response.arrayBuffer();
  const extension = localUri.split('.').pop()?.split('?')[0] ?? 'jpg';
  const contentType = extension === 'png' ? 'image/png' : 'image/jpeg';
  const filePath = `${userId}/${Crypto.randomUUID()}.${extension}`;

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

export async function createPlant(params: {
  userId: string;
  nickname: string;
  coverImageUrl?: string | null;
  category?: Plant['category'];
  addedVia?: Plant['added_via'];
}) {
  const { data, error } = await supabase
    .from('plants')
    .insert({
      user_id: params.userId,
      nickname: params.nickname.trim(),
      cover_image_url: params.coverImageUrl ?? null,
      added_via: params.addedVia ?? 'manual',
      category: params.category ?? 'houseplant',
    })
    .select()
    .single();

  if (error) throw error;

  try {
    await generatePlantCareSchedules(data.id, params.userId);
  } catch {
    // Schedules require the care_schedules migration; plant creation still succeeds.
  }

  return data;
}

export async function createFirstPlant(params: {
  userId: string;
  nickname: string;
  coverImageUrl?: string | null;
}) {
  return createPlant(params);
}

export async function renamePlant(
  plantId: string,
  userId: string,
  nickname: string,
): Promise<Plant> {
  const trimmedNickname = nickname.trim();
  if (!trimmedNickname) {
    throw new Error('Enter a plant name');
  }

  const { data, error } = await supabase
    .from('plants')
    .update({ nickname: trimmedNickname, updated_at: new Date().toISOString() })
    .eq('id', plantId)
    .eq('user_id', userId)
    .eq('is_active', true)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePlant(plantId: string, userId: string): Promise<void> {
  const { data, error } = await supabase
    .from('plants')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', plantId)
    .eq('user_id', userId)
    .eq('is_active', true)
    .select('id')
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Plant not found');

  await supabase
    .from('care_schedules')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('plant_id', plantId);
}

export async function userHasPlants(userId: string): Promise<boolean> {
  const { count, error } = await supabase
    .from('plants')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_active', true);

  if (error) throw error;
  return (count ?? 0) > 0;
}

export function profileNeedsOnboarding(profile: Profile | null, hasPlants: boolean): boolean {
  if (!profile?.full_name?.trim()) return true;
  return !hasPlants;
}
