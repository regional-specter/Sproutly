import { router, type Href } from 'expo-router';
import { SymbolView } from '@/components/sproutly/symbol-view';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CancelRoundIcon, SearchCareIcon, WaterDropIcon } from '@/components/sproutly/figma-icons';
import {
  completeCareReminder,
  fetchTodayTasks,
  formatTaskDueTime,
  getCareTaskLabel,
} from '@/lib/care-schedule';
import { syncCareNotifications } from '@/lib/notifications';
import type { CareTask, CareType } from '@/types/database';
import { FontFamily, LetterSpacing, Spacing, SproutlyColors } from '@/constants/theme';

type NotificationsSheetProps = {
  visible: boolean;
  userId: string;
  onClose: () => void;
  onTaskCompleted?: (taskId: string) => void;
};

const ANIMATION_MS = 280;

function TaskIcon({ careType }: { careType: CareType }) {
  return (
    <View style={styles.taskIconWrap}>
      {careType === 'watering' ? <WaterDropIcon size={18} /> : <SearchCareIcon size={18} />}
    </View>
  );
}

function NotificationRow({
  task,
  userId,
  onCompleted,
  onViewPlant,
}: {
  task: CareTask;
  userId: string;
  onCompleted: (taskId: string) => void;
  onViewPlant: (plantId: string) => void;
}) {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    if (isCompleting) return;

    setIsCompleting(true);
    try {
      await completeCareReminder(task.id, userId);
      void syncCareNotifications(userId);
      onCompleted(task.id);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <TaskIcon careType={task.care_type} />
        <View style={styles.copy}>
          <Text style={styles.plantName}>{task.plant_nickname}</Text>
          <Text style={styles.action}>{getCareTaskLabel(task.care_type)}</Text>
          <Text style={styles.dueTime}>{formatTaskDueTime(task.due_at)}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Mark ${getCareTaskLabel(task.care_type)} complete for ${task.plant_nickname}`}
          onPress={() => void handleComplete()}
          disabled={isCompleting}
          style={({ pressed }) => [
            styles.doneButton,
            pressed && !isCompleting && styles.pressed,
            isCompleting && styles.disabled,
          ]}>
          {isCompleting ? (
            <ActivityIndicator size="small" color={SproutlyColors.primary} />
          ) : (
            <>
              <SymbolView name="checkmark" size={14} tintColor={SproutlyColors.primary} weight="semibold" />
              <Text style={styles.doneButtonText}>Mark done</Text>
            </>
          )}
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`View ${task.plant_nickname}`}
          onPress={() => onViewPlant(task.plant_id)}
          disabled={isCompleting}
          style={({ pressed }) => [
            styles.viewButton,
            pressed && !isCompleting && styles.pressed,
            isCompleting && styles.disabled,
          ]}>
          <SymbolView name="leaf.fill" size={14} tintColor="#2563EB" />
          <Text style={styles.viewButtonText}>View plant</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function NotificationsSheet({
  visible,
  userId,
  onClose,
  onTaskCompleted,
}: NotificationsSheetProps) {
  const insets = useSafeAreaInsets();
  const backdropOpacity = useSharedValue(0);
  const sheetTranslateY = useSharedValue(400);

  const [tasks, setTasks] = useState<CareTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const nextTasks = await fetchTodayTasks(userId);
      setTasks(nextTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (visible) {
      backdropOpacity.value = withTiming(1, {
        duration: ANIMATION_MS,
        easing: Easing.out(Easing.ease),
      });
      sheetTranslateY.value = withTiming(0, {
        duration: ANIMATION_MS,
        easing: Easing.out(Easing.cubic),
      });
      void loadTasks();
    } else {
      backdropOpacity.value = 0;
      sheetTranslateY.value = 400;
      setTasks([]);
      setError(null);
      setIsLoading(false);
    }
  }, [visible, backdropOpacity, sheetTranslateY, loadTasks]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

  const handleCompleted = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    onTaskCompleted?.(taskId);
  };

  const handleViewPlant = (plantId: string) => {
    onClose();
    router.push(`/plant/${plantId}` as Href);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={styles.backdropPressable} onPress={onClose} accessibilityRole="button" />
        </Animated.View>

        <Animated.View
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }, sheetStyle]}>
          <View style={styles.header}>
            <Text style={styles.title}>Notifications</Text>
            <Pressable
              onPress={onClose}
              style={styles.closeButton}
              accessibilityLabel="Close"
              accessibilityRole="button">
              <CancelRoundIcon size={28} />
            </Pressable>
          </View>

          {isLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator color={SproutlyColors.primary} />
            </View>
          ) : error ? (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>{error}</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => void loadTasks()}
                style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}>
                <Text style={styles.retryButtonText}>Try again</Text>
              </Pressable>
            </View>
          ) : tasks.length > 0 ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.list}
              bounces={false}>
              {tasks.map((task) => (
                <NotificationRow
                  key={task.id}
                  task={task}
                  userId={userId}
                  onCompleted={handleCompleted}
                  onViewPlant={handleViewPlant}
                />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.centered}>
              <Text style={styles.emptyTitle}>You&apos;re all caught up</Text>
              <Text style={styles.emptyText}>
                Care reminders and plant tasks will show up here when they&apos;re due.
              </Text>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  backdropPressable: {
    flex: 1,
  },
  sheet: {
    backgroundColor: SproutlyColors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    gap: Spacing.three,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 18,
    letterSpacing: LetterSpacing.headingSm,
    color: SproutlyColors.black,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    gap: Spacing.two,
    paddingBottom: Spacing.two,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: SproutlyColors.cardBorder,
    backgroundColor: SproutlyColors.white,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  taskIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: SproutlyColors.plantsTagBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  plantName: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 16,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.black,
  },
  action: {
    fontFamily: FontFamily.interMedium,
    fontSize: 13,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.textMuted,
  },
  dueTime: {
    fontFamily: FontFamily.interMedium,
    fontSize: 12,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.textMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  doneButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#E8F3E9',
  },
  doneButtonText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 12,
    color: SproutlyColors.primary,
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
  },
  viewButtonText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 12,
    color: '#2563EB',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.five,
    paddingHorizontal: Spacing.two,
  },
  emptyTitle: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 16,
    color: SproutlyColors.black,
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: FontFamily.interMedium,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.textMuted,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: Spacing.one,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#E8F3E9',
  },
  retryButtonText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 12,
    color: SproutlyColors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.7,
  },
});
