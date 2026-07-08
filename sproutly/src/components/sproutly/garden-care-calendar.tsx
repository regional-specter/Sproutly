import { SymbolView } from '@/components/sproutly/symbol-view';
import { StyleSheet, Text, View } from 'react-native';

import { StethoscopeIcon } from '@/components/sproutly/figma-icons';
import { buildCalendarCells, isDateCompleted } from '@/lib/analysis';
import { FontFamily, LetterSpacing, Spacing, SproutlyColors } from '@/constants/theme';

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type GardenCareCalendarProps = {
  plantCount: number;
  weeklyCheckups: number;
  bestStreakDays: number;
  averageHealth: number | null;
  healthTrendPercent: number | null;
  completedDates: Set<string>;
  year: number;
  month: number;
};

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function CalendarDay({
  date,
  completedDates,
}: {
  date: Date | null;
  completedDates: Set<string>;
}) {
  if (!date) {
    return <View style={styles.dayCell} />;
  }

  const completed = isDateCompleted(date, completedDates);
  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  if (completed) {
    return (
      <View style={styles.dayCell}>
        <View style={[styles.dayCircle, styles.dayCompleted]}>
          <SymbolView name="checkmark" size={12} tintColor={SproutlyColors.white} weight="bold" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.dayCell}>
      <View style={[styles.dayCircle, styles.dayPending, isToday && styles.dayToday]}>
        <Text style={styles.dayNumber}>{date.getDate()}</Text>
      </View>
    </View>
  );
}

export function GardenCareCalendar({
  plantCount,
  weeklyCheckups,
  bestStreakDays,
  averageHealth,
  healthTrendPercent,
  completedDates,
  year,
  month,
}: GardenCareCalendarProps) {
  const cells = buildCalendarCells(year, month);
  const weeks: (Date | null)[][] = [];
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }
  const plantLabel = plantCount === 1 ? '1 Plant' : `${plantCount} Plants`;
  const checkupLabel =
    weeklyCheckups === 1 ? '1 Regular Weekly Check-up' : `${weeklyCheckups} Regular Weekly Check-ups`;

  const trendValue =
    healthTrendPercent == null
      ? '—'
      : `${healthTrendPercent >= 0 ? '+' : ''}${healthTrendPercent}%`;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <StethoscopeIcon size={22} color={SproutlyColors.white} />
        </View>

        <View style={styles.headerCopy}>
          <Text style={styles.title}>Garden Care Calendar</Text>
          <Text style={styles.subtitle}>
            {plantLabel} | {checkupLabel}
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatItem
          value={bestStreakDays > 0 ? `${bestStreakDays} Days` : '—'}
          label="Current Best Score"
        />
        <StatItem
          value={averageHealth != null ? `${averageHealth}%` : '—'}
          label="Average Garden Health"
        />
        <StatItem value={trendValue} label="Aggregate Health Trend" />
      </View>

      <View style={styles.calendar}>
        <View style={styles.weekdayRow}>
          {WEEKDAY_LABELS.map((label) => (
            <Text key={label} style={styles.weekdayLabel}>
              {label}
            </Text>
          ))}
        </View>

        <View style={styles.grid}>
          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.weekRow}>
              {week.map((date, dayIndex) => (
                <CalendarDay key={dayIndex} date={date} completedDates={completedDates} />
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: SproutlyColors.cardBorder,
    backgroundColor: SproutlyColors.white,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: SproutlyColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: FontFamily.gabaritoMedium,
    fontSize: 18,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.black,
  },
  subtitle: {
    fontFamily: FontFamily.interMedium,
    fontSize: 12,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.textMuted,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 16,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.black,
  },
  statLabel: {
    fontFamily: FontFamily.interMedium,
    fontSize: 10,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.textMuted,
    textAlign: 'center',
  },
  calendar: {
    gap: Spacing.two,
  },
  weekdayRow: {
    flexDirection: 'row',
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FontFamily.interMedium,
    fontSize: 11,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.textMuted,
  },
  grid: {
    gap: 4,
  },
  weekRow: {
    flexDirection: 'row',
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCompleted: {
    backgroundColor: SproutlyColors.healthGreen,
  },
  dayPending: {
    backgroundColor: '#F3F4F6',
  },
  dayToday: {
    borderWidth: 1,
    borderColor: SproutlyColors.primary,
  },
  dayNumber: {
    fontFamily: FontFamily.interMedium,
    fontSize: 12,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.black,
  },
});
