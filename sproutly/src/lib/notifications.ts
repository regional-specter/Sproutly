import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { getCareTaskLabel } from '@/lib/care-schedule';
import { supabase } from '@/lib/supabase';
import type { CareTask } from '@/types/database';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('care-reminders', {
      name: 'Care Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  try {
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  } catch {
    // Expo Go and dev builds without a project ID cannot fetch push tokens.
    // Local scheduled notifications still work without a token.
    return null;
  }
}

export async function scheduleCareTaskNotifications(tasks: CareTask[]): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const now = Date.now();

  for (const task of tasks) {
    const dueTime = new Date(task.due_at).getTime();
    if (dueTime <= now) continue;

    const secondsUntilDue = Math.max(1, Math.floor((dueTime - now) / 1000));

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${getCareTaskLabel(task.care_type)} ${task.plant_nickname}`,
        body: `Time to ${getCareTaskLabel(task.care_type).toLowerCase()} your ${task.plant_nickname}.`,
        data: { reminderId: task.id, plantId: task.plant_id },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntilDue,
        channelId: Platform.OS === 'android' ? 'care-reminders' : undefined,
      },
    });
  }
}

export async function syncCareNotifications(userId: string): Promise<void> {
  try {
    const endOfWeek = new Date();
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const { data: reminders, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .lte('due_at', endOfWeek.toISOString())
      .order('due_at', { ascending: true });

    if (error) return;
    if (!reminders?.length) {
      await Notifications.cancelAllScheduledNotificationsAsync();
      return;
    }

    const plantIds = [...new Set(reminders.map((reminder) => reminder.plant_id))];
    const { data: plants, error: plantsError } = await supabase
      .from('plants')
      .select('id, nickname, is_active')
      .in('id', plantIds);

    if (plantsError) return;

    const plantMap = new Map((plants ?? []).map((plant) => [plant.id, plant]));

    const tasks: CareTask[] = reminders
      .map((reminder) => {
        const plant = plantMap.get(reminder.plant_id);
        if (!plant?.is_active) return null;
        return { ...reminder, plant_nickname: plant.nickname } as CareTask;
      })
      .filter((task): task is CareTask => task != null);

    await scheduleCareTaskNotifications(tasks);
  } catch {
    // Notification scheduling should never block the app.
  }
}
