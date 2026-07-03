import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, type ViewProps } from 'react-native';

import { SproutlyColors } from '@/constants/theme';

type GradientBackgroundProps = ViewProps & {
  variant?: 'splash' | 'auth';
};

export function GradientBackground({
  variant = 'splash',
  style,
  children,
  ...props
}: GradientBackgroundProps) {
  const colors =
    variant === 'splash'
      ? ([SproutlyColors.primary, SproutlyColors.primary, SproutlyColors.white] as const)
      : ([SproutlyColors.primary, SproutlyColors.white, SproutlyColors.white] as const);

  const locations =
    variant === 'splash' ? ([0, 0.75, 1] as const) : ([0, 0.45, 1] as const);

  return (
    <LinearGradient colors={colors} locations={locations} style={[styles.fill, style]} {...props}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
