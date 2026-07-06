import { supabase } from '@/lib/supabase';
import type { CareTask, CareType } from '@/types/database';

export const DEFAULT_WATERING_DAYS = 7;
export const DEFAULT_CHECKUP_DAYS = 7;

export function getCareTaskLabel(careType: CareType): string {
  switch (careType) {
    case 'watering':
      return 'Water';
    case 'checkup':
      return 'Check-up';
    case 'misting':
      return 'Mist';
    case 'repotting':
      return 'Repot';
    case 'fertilizing':
      return 'Fertilize';
    default:
      return 'Care';
  }
}

export function formatTaskDueTime(dueAt: string): string {
  const due = new Date(dueAt);
  const now = new Date();
  const isToday =
    due.getFullYear() === now.getFullYear() &&
    due.getMonth() === now.getMonth() &&
    due.getDate() === now.getDate();

  const time = due.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  return isToday ? `Today ${time}` : due.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export async function generatePlantCareSchedules(
  plantId: string,
  userId: string,
  options?: { wateringDays?: number; checkupDays?: number },
): Promise<void> {
  const { error } = await supabase.rpc('generate_plant_care_schedules', {
    p_plant_id: plantId,
    p_user_id: userId,
    p_watering_days: options?.wateringDays ?? DEFAULT_WATERING_DAYS,
    p_checkup_days: options?.checkupDays ?? DEFAULT_CHECKUP_DAYS,
  });

  if (error) throw error;
}

export async function ensureWeeklyReminders(userId: string): Promise<number> {
  const { data, error } = await supabase.rpc('ensure_weekly_reminders', {
    p_user_id: userId,
  });

  if (error) throw error;
  return Number(data ?? 0);
}

export async function ensureCareSchedulesForExistingPlants(userId: string): Promise<void> {
  const { data: plants, error: plantsError } = await supabase
    .from('plants')
    .select('id')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (plantsError) throw plantsError;
  if (!plants?.length) return;

  const plantIds = plants.map((plant) => plant.id);
  const { data: schedules, error: schedulesError } = await supabase
    .from('care_schedules')
    .select('plant_id')
    .in('plant_id', plantIds)
    .eq('is_active', true);

  if (schedulesError) throw schedulesError;

  const scheduledPlantIds = new Set((schedules ?? []).map((schedule) => schedule.plant_id));
  const missingPlantIds = plantIds.filter((plantId) => !scheduledPlantIds.has(plantId));

  await Promise.all(
    missingPlantIds.map((plantId) =>
      generatePlantCareSchedules(plantId, userId).catch(() => undefined),
    ),
  );
}

export async function completeCareReminder(reminderId: string, userId: string): Promise<string> {
  const { data, error } = await supabase.rpc('complete_care_reminder', {
    p_reminder_id: reminderId,
    p_user_id: userId,
  });

  if (error) throw error;
  return data as string;
}

export async function fetchTodayTasks(userId: string): Promise<CareTask[]> {
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const { data: reminders, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'pending')
    .lte('due_at', endOfDay.toISOString())
    .order('due_at', { ascending: true });

  if (error) throw error;
  if (!reminders?.length) return [];

  const plantIds = [...new Set(reminders.map((reminder) => reminder.plant_id))];
  const { data: plants, error: plantsError } = await supabase
    .from('plants')
    .select('id, nickname, is_active')
    .in('id', plantIds);

  if (plantsError) throw plantsError;

  const plantMap = new Map((plants ?? []).map((plant) => [plant.id, plant]));

  return reminders
    .map((reminder) => {
      const plant = plantMap.get(reminder.plant_id);
      if (!plant?.is_active) return null;
      return {
        ...reminder,
        plant_nickname: plant.nickname,
      } as CareTask;
    })
    .filter((task): task is CareTask => task != null);
}

export async function fetchCompletedCareDates(
  userId: string,
  year: number,
  month: number,
): Promise<Set<string>> {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59, 999);

  const { data: plants, error: plantsError } = await supabase
    .from('plants')
    .select('id')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (plantsError) throw plantsError;

  const plantIds = (plants ?? []).map((plant) => plant.id);

  const [remindersResult, logsResult] = await Promise.all([
    supabase
      .from('reminders')
      .select('completed_at')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .gte('completed_at', start.toISOString())
      .lte('completed_at', end.toISOString()),
    plantIds.length > 0
      ? supabase
          .from('plant_logs')
          .select('created_at')
          .in('plant_id', plantIds)
          .in('log_type', ['watering', 'checkup', 'status_update'])
          .gte('created_at', start.toISOString())
          .lte('created_at', end.toISOString())
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (remindersResult.error) throw remindersResult.error;
  if (logsResult.error) throw logsResult.error;

  const dates = new Set<string>();

  for (const row of remindersResult.data ?? []) {
    if (row.completed_at) {
      dates.add(toDateKey(new Date(row.completed_at)));
    }
  }

  for (const row of logsResult.data ?? []) {
    if (row.created_at) {
      dates.add(toDateKey(new Date(row.created_at)));
    }
  }

  return dates;
}

export async function countWeeklyCheckupSchedules(userId: string): Promise<number> {
  const { data: plants, error: plantsError } = await supabase
    .from('plants')
    .select('id')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (plantsError) throw plantsError;

  const plantIds = (plants ?? []).map((plant) => plant.id);
  if (plantIds.length === 0) return 0;

  const { count, error } = await supabase
    .from('care_schedules')
    .select('id', { count: 'exact', head: true })
    .in('plant_id', plantIds)
    .eq('care_type', 'checkup')
    .eq('is_active', true);

  if (error) throw error;
  return count ?? 0;
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseWateringFrequencyDays(waterInstruction?: string | null): number {
  if (!waterInstruction) return DEFAULT_WATERING_DAYS;

  const text = waterInstruction.toLowerCase();
  if (text.includes('daily') || text.includes('every day')) return 1;
  if (text.includes('twice a week') || text.includes('2x a week')) return 3;
  if (text.includes('every 2 weeks') || text.includes('biweekly') || text.includes('bi-weekly')) {
    return 14;
  }
  if (text.includes('every 3 weeks')) return 21;
  if (text.includes('monthly') || text.includes('every month')) return 30;

  const weekMatch = text.match(/every\s+(\d+)\s+week/);
  if (weekMatch) return Number(weekMatch[1]) * 7;

  const dayMatch = text.match(/every\s+(\d+)\s+day/);
  if (dayMatch) return Number(dayMatch[1]);

  return DEFAULT_WATERING_DAYS;
}
