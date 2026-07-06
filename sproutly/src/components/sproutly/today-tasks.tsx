import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { SearchCareIcon, WaterDropIcon } from '@/components/sproutly/figma-icons';
import { completeCareReminder, formatTaskDueTime, getCareTaskLabel } from '@/lib/care-schedule';
import type { CareTask, CareType } from '@/types/database';
import { FontFamily, LetterSpacing, Spacing, SproutlyColors } from '@/constants/theme';

type CareTaskCardProps = {
  task: CareTask;
  userId: string;
  onCompleted: (completedAt: string, taskId: string) => void;
};

function TaskIcon({ careType }: { careType: CareType }) {
  return (
    <View style={styles.taskIconWrap}>
      {careType === 'watering' ? (
        <WaterDropIcon size={20} />
      ) : (
        <SearchCareIcon size={20} />
      )}
    </View>
  );
}

export function CareTaskCard({ task, userId, onCompleted }: CareTaskCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    if (isCompleting) return;

    setIsCompleting(true);
    try {
      const completedAt = await completeCareReminder(task.id, userId);
      onCompleted(completedAt, task.id);
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

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Mark ${getCareTaskLabel(task.care_type)} as complete for ${task.plant_nickname}`}
        onPress={handleComplete}
        disabled={isCompleting}
        style={({ pressed }) => [
          styles.completeButton,
          pressed && !isCompleting && styles.pressed,
          isCompleting && styles.disabled,
        ]}>
        {isCompleting ? (
          <ActivityIndicator color={SproutlyColors.white} size="small" />
        ) : (
          <>
            <SymbolView name="checkmark" size={14} tintColor={SproutlyColors.white} weight="bold" />
            <Text style={styles.completeLabel}>Mark as Complete</Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

type TodayTasksSectionProps = {
  tasks: CareTask[];
  userId: string;
  onTaskCompleted: (completedAt: string, taskId: string) => void;
};

export function TodayTasksSection({ tasks, userId, onTaskCompleted }: TodayTasksSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Today&apos;s Tasks</Text>

      {tasks.length > 0 ? (
        <View style={styles.taskList}>
          {tasks.map((task) => (
            <CareTaskCard
              key={task.id}
              task={task}
              userId={userId}
              onCompleted={onTaskCompleted}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>You&apos;re all caught up for today!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.three,
  },
  sectionTitle: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 20,
    letterSpacing: LetterSpacing.headingSm,
    color: SproutlyColors.black,
  },
  taskList: {
    gap: Spacing.two,
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
    width: 44,
    height: 44,
    borderRadius: 22,
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
    fontSize: 14,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.textMuted,
  },
  dueTime: {
    fontFamily: FontFamily.interMedium,
    fontSize: 12,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.textMuted,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderRadius: 999,
    backgroundColor: SproutlyColors.primary,
  },
  completeLabel: {
    fontFamily: FontFamily.interMedium,
    fontSize: 15,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.white,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.7,
  },
  emptyState: {
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FontFamily.interMedium,
    fontSize: 14,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.textMuted,
    textAlign: 'center',
  },
});
