import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

import { analyzePlantHealth } from '@/lib/gemini';
import { parseWateringFrequencyDays } from '@/lib/care-schedule';
import { uploadPlantImage } from '@/lib/plants';
import { supabase } from '@/lib/supabase';
import type { Plant, PlantCareFacts, Scan } from '@/types/database';

export async function launchPlantCamera(): Promise<string | null> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    Alert.alert('Camera access needed', 'Allow camera access to scan your plant.');
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.85,
  });

  return result.canceled ? null : (result.assets[0]?.uri ?? null);
}

export async function canUserScan(userId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('can_user_scan', { uid: userId });
  if (error) throw error;
  return Boolean(data);
}

async function incrementScanCount(userId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_scan_count', { uid: userId });
  if (error) throw error;
}

function buildKeyFacts(care: PlantCareFacts): Record<string, unknown> {
  return { care };
}

export type PlantScanResult = {
  scan: Scan;
  analysis: {
    health_score: number;
    health_status: string;
    care: PlantCareFacts;
  };
};

export async function performPlantHealthScan(params: {
  userId: string;
  plant: Plant;
  localImageUri: string;
}): Promise<PlantScanResult> {
  const allowed = await canUserScan(params.userId);
  if (!allowed) {
    throw new Error('You have used all your free scans. Upgrade to premium to scan more plants.');
  }

  const speciesLabel = params.plant.species_name ?? params.plant.species_common_name;

  const [imageUrl, { analysis, rawResponse }] = await Promise.all([
    uploadPlantImage(params.userId, params.localImageUri),
    analyzePlantHealth({
      imageUri: params.localImageUri,
      plantNickname: params.plant.nickname,
      speciesName: speciesLabel,
    }),
  ]);

  const { data: scan, error: scanError } = await supabase
    .from('scans')
    .insert({
      plant_id: params.plant.id,
      user_id: params.userId,
      image_url: imageUrl,
      scan_type: 'health_check',
      species_identified: analysis.species_name ?? analysis.species_common_name,
      health_score: analysis.health_score,
      health_status: analysis.health_status,
      ai_raw_response: rawResponse as Record<string, unknown>,
    })
    .select()
    .single();

  if (scanError) throw scanError;

  const { error: logError } = await supabase.from('plant_logs').insert({
    plant_id: params.plant.id,
    scan_id: scan.id,
    log_type: 'status_update',
    notes: analysis.observations,
    health_score: analysis.health_score,
  });

  if (logError) throw logError;

  const plantUpdate: Partial<Plant> = {
    current_health_score: analysis.health_score,
    current_health_status: analysis.health_status,
    key_facts: buildKeyFacts(analysis.care),
    cover_image_url: imageUrl,
    updated_at: new Date().toISOString(),
  };

  if (!params.plant.species_name && analysis.species_name) {
    plantUpdate.species_name = analysis.species_name;
  }
  if (!params.plant.species_common_name && analysis.species_common_name) {
    plantUpdate.species_common_name = analysis.species_common_name;
  }

  const { error: plantError } = await supabase
    .from('plants')
    .update(plantUpdate)
    .eq('id', params.plant.id)
    .eq('user_id', params.userId);

  if (plantError) throw plantError;

  const wateringDays = parseWateringFrequencyDays(analysis.care.water);
  await supabase
    .from('care_schedules')
    .update({ frequency_days: wateringDays, updated_at: new Date().toISOString() })
    .eq('plant_id', params.plant.id)
    .eq('care_type', 'watering')
    .eq('is_active', true);

  await incrementScanCount(params.userId);

  return {
    scan,
    analysis: {
      health_score: analysis.health_score,
      health_status: analysis.health_status,
      care: analysis.care,
    },
  };
}
