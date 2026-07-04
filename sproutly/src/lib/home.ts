import { supabase } from '@/lib/supabase';
import type { HomePlant, UserRankProgress } from '@/types/database';

export type HomeScreenData = {
  level: number;
  levelProgress: number;
  plantCount: number;
  streakDays: number;
  plants: HomePlant[];
  rank: UserRankProgress;
};

export function getFirstName(fullName: string | null | undefined, email: string | undefined) {
  if (fullName?.trim()) {
    return fullName.trim().split(/\s+/)[0];
  }

  if (email) {
    return email.split('@')[0];
  }

  return 'Gardener';
}

export function formatStreakLabel(days: number): string {
  if (days <= 0) {
    return 'Start a streak';
  }

  if (days === 1) {
    return '1 Day';
  }

  if (days < 7) {
    return `${days} Days`;
  }

  const weeks = Math.floor(days / 7);
  const remainder = days % 7;

  if (remainder === 0) {
    return weeks === 1 ? '1 Week' : `${weeks} Weeks`;
  }

  return `${days} Days`;
}

export function formatPlantCount(count: number): string {
  return count === 1 ? '1 Plant' : `${count} Plants`;
}

export function getPlantSpeciesLabel(plant: HomePlant): string | null {
  return plant.species_name ?? plant.species_common_name;
}

export async function fetchHomeScreenData(userId: string): Promise<HomeScreenData> {
  const [profileResult, plantsResult, rankResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('level, total_xp, current_streak_days')
      .eq('id', userId)
      .single(),
    supabase
      .from('home_plants')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    supabase.rpc('user_rank_progress', { p_user_id: userId }),
  ]);

  if (profileResult.error) throw profileResult.error;
  if (plantsResult.error) throw plantsResult.error;
  if (rankResult.error) throw rankResult.error;

  const { data: levelProgress, error: levelProgressError } = await supabase.rpc('level_progress', {
    xp: profileResult.data.total_xp,
  });

  if (levelProgressError) throw levelProgressError;

  const rankRow = rankResult.data?.[0];
  if (!rankRow) {
    throw new Error('Rank progress data unavailable');
  }

  const plants = plantsResult.data ?? [];

  return {
    level: profileResult.data.level,
    levelProgress: Number(levelProgress ?? 0),
    plantCount: plants.length,
    streakDays: profileResult.data.current_streak_days,
    plants,
    rank: {
      current_rank_title: rankRow.current_rank_title,
      current_rank_subtitle: rankRow.current_rank_subtitle,
      next_rank_title: rankRow.next_rank_title,
      xp_current: rankRow.xp_current,
      xp_target: rankRow.xp_target,
    },
  };
}
