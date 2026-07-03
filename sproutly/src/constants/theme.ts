import '@/global.css';

import { Platform } from 'react-native';

export const SproutlyColors = {
  primary: '#489E4B',
  secondary: '#377C4D',
  surface: '#F9F9FB',
  icon: '#222222',
  white: '#FFFFFF',
  black: '#000000',
  textMuted: '#9CA3AF',
} as const;

export const Colors = {
  light: {
    text: SproutlyColors.black,
    background: SproutlyColors.white,
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: SproutlyColors.white,
    background: SproutlyColors.black,
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const FontFamily = {
  interMedium: 'Inter_500Medium',
  interSemiBold: 'Inter_600SemiBold',
  gabaritoMedium: 'Gabarito_500Medium',
  gabaritoSemiBold: 'Gabarito_600SemiBold',
} as const;

export const LetterSpacing = {
  body: -0.5,
  headingSm: -1.5,
  headingLg: -3,
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: FontFamily.interMedium,
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: FontFamily.interMedium,
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-inter-medium)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
