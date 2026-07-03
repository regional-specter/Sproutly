import { Pressable, StyleSheet, Text, type PressableProps, type TextStyle, type ViewStyle } from 'react-native';

import { FontFamily, LetterSpacing, SproutlyColors } from '@/constants/theme';

type PrimaryButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  variant?: 'dark' | 'primary';
  style?: ViewStyle;
  labelStyle?: TextStyle;
};

export function PrimaryButton({
  label,
  variant = 'dark',
  style,
  labelStyle,
  disabled,
  ...props
}: PrimaryButtonProps) {
  const isDark = variant === 'dark';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        isDark ? styles.buttonDark : styles.buttonPrimary,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled}
      {...props}>
      <Text style={[styles.label, isDark ? styles.labelDark : styles.labelPrimary, labelStyle]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 400,
  },
  buttonDark: {
    backgroundColor: SproutlyColors.black,
  },
  buttonPrimary: {
    backgroundColor: SproutlyColors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: FontFamily.interMedium,
    fontSize: 16,
    letterSpacing: LetterSpacing.body,
  },
  labelDark: {
    color: SproutlyColors.white,
  },
  labelPrimary: {
    color: SproutlyColors.white,
  },
});
