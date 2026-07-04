import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

// REMOVED: SproutEmojiIcon import since it's no longer needed
import { FontFamily, LetterSpacing, SproutlyColors } from '@/constants/theme';

type LevelProgressRingProps = {
  level: number;
  progress: number;
  size?: number;
};

export function LevelProgressRing({ level, progress, size = 72 }: LevelProgressRingProps) {
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const strokeDashoffset = circumference * (1 - clampedProgress);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={SproutlyColors.progressTrack}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={SproutlyColors.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      <View style={styles.inner}>
        {/* CHANGED: Swapped out the icon for a text component with the emoji */}
        <Text style={styles.emojiIcon}>🌱</Text>
        <Text style={styles.levelText}>Level {level}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  // ADDED: New rule to size and position the emoji properly inside the ring
  emojiIcon: {
    fontSize: 18, 
    lineHeight: 20,
    textAlign: 'center',
  },
  levelText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 11,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.primary,
  },
});