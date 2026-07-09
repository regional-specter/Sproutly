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
  plantsTagBg: '#CFE4D1',
  streakTagBg: '#F9CED0',
  cardBorder: '#F0F0F3',
  healthGreen: '#06C56C',
  progressTrack: '#E8F3E9',
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

// Android resolves fonts by the useFonts map key / embedded file name (e.g. Inter_500Medium).
// iOS uses the font file PostScript name (e.g. Inter-Medium). useFonts registers both on iOS.
export const FontFamily = {
  interMedium: Platform.select({
    ios: 'Inter-Medium',
    android: 'Inter_500Medium',
    default: 'Inter_500Medium',
  }) as string,
  interMediumItalic: Platform.select({
    ios: 'Inter-MediumItalic',
    android: 'Inter_500Medium_Italic',
    default: 'Inter_500Medium_Italic',
  }) as string,
  interSemiBold: Platform.select({
    ios: 'Inter-SemiBold',
    android: 'Inter_600SemiBold',
    default: 'Inter_600SemiBold',
  }) as string,
  gabaritoMedium: Platform.select({
    ios: 'Gabarito-Medium',
    android: 'Gabarito_500Medium',
    default: 'Gabarito_500Medium',
  }) as string,
  gabaritoSemiBold: Platform.select({
    ios: 'Gabarito-SemiBold',
    android: 'Gabarito_600SemiBold',
    default: 'Gabarito_600SemiBold',
  }) as string,
} as const;

// Android needs slightly less negative tracking than iOS, but zero spacing
// makes Inter look like the system font is being used.
export const LetterSpacing =
  Platform.select({
    ios: { body: -0.5, headingSm: -1.5, headingLg: -3 } as const,
    web: { body: -0.5, headingSm: -1.5, headingLg: -3 } as const,
    android: { body: -0.35, headingSm: -1, headingLg: -2 } as const,
    default: { body: -0.5, headingSm: -1.5, headingLg: -3 } as const,
  }) ?? { body: -0.5, headingSm: -1.5, headingLg: -3 };

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
