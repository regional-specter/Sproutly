import { supabase } from '@/lib/supabase';
import type { HomePlant, Plant, PlantCareFacts, Scan } from '@/types/database';

export type PlantDetailData = {
  plant: Plant;
  checkupCount: number;
  scans: Scan[];
  care: PlantCareFacts;
};

const CARE_FIELDS: (keyof PlantCareFacts)[] = [
  'light',
  'water',
  'soil',
  'potting',
  'feeding',
  'temperature',
];

export function parseCareFacts(keyFacts: Record<string, unknown>): PlantCareFacts {
  const nested = keyFacts.care;
  if (nested && typeof nested === 'object') {
    return nested as PlantCareFacts;
  }

  const care: PlantCareFacts = {};
  for (const field of CARE_FIELDS) {
    const value = keyFacts[field];
    if (typeof value === 'string' && value.trim()) {
      care[field] = value.trim();
    }
  }
  return care;
}

export function getCareEntries(care: PlantCareFacts): { label: string; value: string }[] {
  const labels: Record<keyof PlantCareFacts, string> = {
    light: 'Light',
    water: 'Water',
    soil: 'Soil',
    potting: 'Potting',
    feeding: 'Feeding',
    temperature: 'Temperature',
  };

  return CARE_FIELDS.filter((field) => care[field])
    .map((field) => ({
      label: labels[field],
      value: care[field]!,
    }));
}

export function formatAddedLabel(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return 'last week';
  if (diffDays < 45) return 'last month';
  if (diffDays < 90) return '2 months ago';
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }

  const years = Math.floor(diffDays / 365);
  return years === 1 ? 'last year' : `${years} years ago`;
}

export function getHealthTrend(scans: Scan[]): {
  latestScore: number | null;
  changePercent: number | null;
} {
  const scored = scans
    .filter((scan) => scan.health_score != null)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  if (scored.length === 0) {
    return { latestScore: null, changePercent: null };
  }

  const latest = scored[scored.length - 1];
  const previous = scored.length > 1 ? scored[scored.length - 2] : null;

  if (!previous || latest.health_score == null || previous.health_score == null) {
    return { latestScore: latest.health_score, changePercent: null };
  }

  return {
    latestScore: latest.health_score,
    changePercent: latest.health_score - previous.health_score,
  };
}

export function getPlantSpeciesLabel(plant: Pick<Plant, 'species_name' | 'species_common_name'>): string | null {
  return plant.species_name ?? plant.species_common_name;
}

export async function fetchPlantDetail(plantId: string, userId: string): Promise<PlantDetailData | null> {
  const [plantResult, scansResult, homePlantResult] = await Promise.all([
    supabase
      .from('plants')
      .select('*')
      .eq('id', plantId)
      .eq('user_id', userId)
      .eq('is_active', true)
      .maybeSingle(),
    supabase
      .from('scans')
      .select('*')
      .eq('plant_id', plantId)
      .eq('user_id', userId)
      .order('created_at', { ascending: true }),
    supabase
      .from('home_plants')
      .select('checkup_count')
      .eq('id', plantId)
      .eq('user_id', userId)
      .maybeSingle(),
  ]);

  if (plantResult.error) throw plantResult.error;
  if (scansResult.error) throw scansResult.error;
  if (homePlantResult.error) throw homePlantResult.error;
  if (!plantResult.data) return null;

  const plant = plantResult.data as Plant;
  const scans = (scansResult.data ?? []) as Scan[];
  const checkupCount =
    homePlantResult.data?.checkup_count ??
    scans.filter((scan) => scan.scan_type === 'health_check').length;

  return {
    plant,
    checkupCount,
    scans,
    care: parseCareFacts(plant.key_facts ?? {}),
  };
}

export type { HomePlant };
