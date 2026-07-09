import * as Device from 'expo-device';
import { isRunningInExpoGo } from 'expo';
import { Platform } from 'react-native';

import { getCareTaskLabel } from '@/lib/care-schedule';
import { supabase } from '@/lib/supabase';
import type { CareTask } from '@/types/database';

type NotificationsModule = typeof import('expo-notifications');

let notificationsModule: NotificationsModule | null = null;
let notificationsUnavailable = false;
let handlerConfigured = false;

function isExpoGoAndroid(): boolean {
  return isRunningInExpoGo() && Platform.OS === 'android';
}

async function getNotifications(): Promise<NotificationsModule | null> {
  if (notificationsUnavailable || isExpoGoAndroid()) {
    return null;
  }

  if (!notificationsModule) {
    try {
      notificationsModule = await import('expo-notifications');

      if (!handlerConfigured) {
        notificationsModule.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true,
          }),
        });
        handlerConfigured = true;
      }
    } catch {
      notificationsUnavailable = true;
      return null;
    }
  }

  return notificationsModule;
}

export async function registerForPushNotifications(): Promise<string | null> {
  if (isExpoGoAndroid() || !Device.isDevice) {
    return null;
  }

  const Notifications = await getNotifications();
  if (!Notifications) {
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
    return null;
  }
}

export async function scheduleCareTaskNotifications(tasks: CareTask[]): Promise<void> {
  const Notifications = await getNotifications();
  if (!Notifications) {
    return;
  }

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
  if (isExpoGoAndroid()) {
    return;
  }

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

    const Notifications = await getNotifications();
    if (!Notifications) {
      return;
    }

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
