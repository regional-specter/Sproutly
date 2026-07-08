import { router, useFocusEffect, type Href } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AppScreenLayout } from '@/components/sproutly/app-screen-layout';
import { GardenCareCalendar } from '@/components/sproutly/garden-care-calendar';
import { FireAltIcon, LeafIcon } from '@/components/sproutly/figma-icons';
import { LevelProgressRing } from '@/components/sproutly/level-progress-ring';
import { NotificationsSheet } from '@/components/sproutly/notifications-sheet';
import { TodayTasksSection } from '@/components/sproutly/today-tasks';
import { useAuth } from '@/contexts/auth-context';
import { fetchAnalysisScreenData, type AnalysisScreenData } from '@/lib/analysis';
import { toDateKey } from '@/lib/care-schedule';
import { formatPlantCount, formatStreakLabel, getFirstName } from '@/lib/home';
import { registerForPushNotifications, syncCareNotifications } from '@/lib/notifications';
import { FontFamily, LetterSpacing, Spacing, SproutlyColors } from '@/constants/theme';

export default function AnalysisScreen() {
  const { profile, user } = useAuth();
  const [data, setData] = useState<AnalysisScreenData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  const firstName = getFirstName(profile?.full_name, profile?.email);

  const loadData = useCallback(async () => {
    if (!user?.id) {
      setData(null);
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const analysisData = await fetchAnalysisScreenData(user.id);
      setData(analysisData);
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'message' in err && typeof err.message === 'string'
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Failed to load analysis data';
      setError(message);
    } finally {
      setIsLoading(false);
    }

    if (!user?.id) return;

    try {
      await registerForPushNotifications();
      await syncCareNotifications(user.id);
    } catch {
      // Local notifications are best-effort; Expo Go may not support push tokens.
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      loadData();
    }, [loadData]),
  );

  const handleTaskCompleted = useCallback(
    (completedAt: string, taskId: string) => {
      if (!user?.id) return;

      const dateKey = toDateKey(new Date(completedAt));

      setData((prev) => {
        if (!prev) return prev;
        const nextCompletedDates = new Set(prev.completedDates);
        nextCompletedDates.add(dateKey);
        return {
          ...prev,
          completedDates: nextCompletedDates,
          todayTasks: prev.todayTasks.filter((task) => task.id !== taskId),
        };
      });

      void syncCareNotifications(user.id);
      void loadData();
    },
    [loadData, user?.id],
  );

  return (
    <AppScreenLayout
      onNotificationPress={() => setNotificationsVisible(true)}
      onProfilePress={() => router.push('/(app)/settings' as Href)}>
      {isLoading ? (
        <View style={styles.centeredState}>
          <ActivityIndicator color={SproutlyColors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centeredState}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : data ? (
        <>
          <View style={styles.welcomeCard}>
            <LevelProgressRing level={data.level} progress={data.levelProgress} />

            <View style={styles.welcomeContent}>
              <Text style={styles.welcomeTitle}>Welcome Back, {firstName}</Text>
              <Text style={styles.welcomeSubtitle}>Snap a photo to update your garden.</Text>

              <View style={styles.tagRow}>
                <View style={[styles.tag, styles.plantsTag]}>
                  <LeafIcon size={10} />
                  <Text style={[styles.tagText, styles.plantsTagText]}>
                    {formatPlantCount(data.plantCount)}
                  </Text>
                </View>

                <View style={[styles.tag, styles.streakTag]}>
                  <FireAltIcon size={10} />
                  <Text style={[styles.tagText, styles.streakTagText]}>
                    {formatStreakLabel(data.streakDays)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <GardenCareCalendar
            plantCount={data.plantCount}
            weeklyCheckups={data.weeklyCheckups}
            bestStreakDays={data.stats.bestStreakDays}
            averageHealth={data.stats.averageHealth}
            healthTrendPercent={data.stats.healthTrendPercent}
            completedDates={data.completedDates}
            year={data.calendarYear}
            month={data.calendarMonth}
          />

          {user?.id ? (
            <TodayTasksSection
              tasks={data.todayTasks}
              userId={user.id}
              onTaskCompleted={handleTaskCompleted}
            />
          ) : null}
        </>
      ) : null}

      {user?.id ? (
        <NotificationsSheet
          visible={notificationsVisible}
          userId={user.id}
          onClose={() => setNotificationsVisible(false)}
          onTaskCompleted={(taskId) => {
            setData((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                todayTasks: prev.todayTasks.filter((task) => task.id !== taskId),
              };
            });
            void loadData();
          }}
        />
      ) : null}
    </AppScreenLayout>
  );
}

const styles = StyleSheet.create({
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six,
  },
  errorText: {
    fontFamily: FontFamily.interMedium,
    fontSize: 14,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.textMuted,
    textAlign: 'center',
  },
  welcomeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: 20,
    backgroundColor: SproutlyColors.surface,
  },
  welcomeContent: {
    flex: 1,
    gap: Spacing.one,
  },
  welcomeTitle: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 18,
    letterSpacing: LetterSpacing.headingSm,
    color: SproutlyColors.black,
  },
  welcomeSubtitle: {
    fontFamily: FontFamily.interMedium,
    fontSize: 13,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.textMuted,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 7,
  },
  plantsTag: {
    backgroundColor: SproutlyColors.plantsTagBg,
  },
  streakTag: {
    backgroundColor: SproutlyColors.streakTagBg,
  },
  tagText: {
    fontFamily: FontFamily.interMedium,
    fontSize: 12,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.black,
  },
  plantsTagText: {
    color: '#4CA04F',
  },
  streakTagText: {
    color: '#F84B4C',
  },
});
