import {
  countWeeklyCheckupSchedules,
  ensureCareSchedulesForExistingPlants,
  ensureWeeklyReminders,
  fetchCompletedCareDates,
  fetchTodayTasks,
  toDateKey,
} from '@/lib/care-schedule';
import { fetchHomeScreenData } from '@/lib/home';
import { supabase } from '@/lib/supabase';
import type { CareTask } from '@/types/database';

export type GardenCareStats = {
  bestStreakDays: number;
  averageHealth: number | null;
  healthTrendPercent: number | null;
};

export type AnalysisScreenData = {
  level: number;
  levelProgress: number;
  plantCount: number;
  streakDays: number;
  weeklyCheckups: number;
  stats: GardenCareStats;
  completedDates: Set<string>;
  todayTasks: CareTask[];
  calendarYear: number;
  calendarMonth: number;
};

function averageHealthScores(scores: number[]): number | null {
  if (scores.length === 0) return null;
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return Math.round(sum / scores.length);
}

async function fetchGardenCareStats(userId: string): Promise<GardenCareStats> {
  const [profileResult, plantsResult, scansResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('current_streak_days')
      .eq('id', userId)
      .single(),
    supabase
      .from('plants')
      .select('current_health_score')
      .eq('user_id', userId)
      .eq('is_active', true),
    supabase
      .from('scans')
      .select('health_score, created_at')
      .eq('user_id', userId)
      .not('health_score', 'is', null)
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  if (profileResult.error) throw profileResult.error;
  if (plantsResult.error) throw plantsResult.error;
  if (scansResult.error) throw scansResult.error;

  const plantScores = (plantsResult.data ?? [])
    .map((plant) => plant.current_health_score)
    .filter((score): score is number => score != null);

  const scans = scansResult.data ?? [];
  const recentScores = scans.slice(0, 5).map((scan) => scan.health_score as number);
  const olderScores = scans.slice(5, 10).map((scan) => scan.health_score as number);

  const recentAvg = averageHealthScores(recentScores);
  const olderAvg = averageHealthScores(olderScores);

  let healthTrendPercent: number | null = null;
  if (recentAvg != null && olderAvg != null && olderAvg > 0) {
    healthTrendPercent = Math.round(((recentAvg - olderAvg) / olderAvg) * 100);
  }

  const bestStreakDays = profileResult.data.current_streak_days ?? 0;

  return {
    bestStreakDays,
    averageHealth: averageHealthScores(plantScores),
    healthTrendPercent,
  };
}

export async function fetchAnalysisScreenData(userId: string): Promise<AnalysisScreenData> {
  const now = new Date();

  try {
    await ensureCareSchedulesForExistingPlants(userId);
  } catch {
    // Care schedule tables/RPCs may not be migrated yet.
  }

  try {
    await ensureWeeklyReminders(userId);
  } catch {
    // Weekly reminder RPC may not be available yet.
  }

  const [homeData, stats, completedDates, todayTasks, weeklyCheckups] = await Promise.all([
    fetchHomeScreenData(userId),
    fetchGardenCareStats(userId),
    fetchCompletedCareDates(userId, now.getFullYear(), now.getMonth()).catch(() => new Set<string>()),
    fetchTodayTasks(userId).catch(() => [] as CareTask[]),
    countWeeklyCheckupSchedules(userId).catch(() => 0),
  ]);

  return {
    level: homeData.level,
    levelProgress: homeData.levelProgress,
    plantCount: homeData.plantCount,
    streakDays: homeData.streakDays,
    weeklyCheckups,
    stats,
    completedDates,
    todayTasks,
    calendarYear: now.getFullYear(),
    calendarMonth: now.getMonth(),
  };
}

export function isDateCompleted(date: Date, completedDates: Set<string>): boolean {
  return completedDates.has(toDateKey(date));
}

export function buildCalendarCells(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const cells: (Date | null)[] = [];

  for (let i = 0; i < startOffset; i++) {
    cells.push(null);
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    cells.push(new Date(year, month, day));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}
