import type { ComponentType } from 'react';
import { Pressable, StyleSheet, Text, View, type PressableProps, type ViewStyle } from 'react-native';

import { FontFamily, LetterSpacing, SproutlyColors } from '@/constants/theme';

type AuthProvider = 'google' | 'apple' | 'email';

type AuthButtonProps = Omit<PressableProps, 'style'> & {
  provider: AuthProvider;
  style?: ViewStyle;
};

function GoogleIcon() {
  return (
    <View style={styles.iconWrap}>
      <Text style={styles.googleIcon}>G</Text>
    </View>
  );
}

function AppleIcon() {
  return <Text style={styles.appleIcon}>&#63743;</Text>;
}

function EmailIcon() {
  return <Text style={styles.emailIcon}>&#9993;</Text>;
}

const PROVIDER_CONFIG: Record<
  AuthProvider,
  { label: string; variant: 'light' | 'primary'; Icon: ComponentType }
> = {
  google: { label: 'Continue with Google', variant: 'light', Icon: GoogleIcon },
  apple: { label: 'Continue with Apple', variant: 'light', Icon: AppleIcon },
  email: { label: 'Continue with Email', variant: 'primary', Icon: EmailIcon },
};

export function AuthButton({ provider, style, ...props }: AuthButtonProps) {
  const config = PROVIDER_CONFIG[provider];
  const isPrimary = config.variant === 'primary';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.buttonPrimary : styles.buttonLight,
        pressed && styles.pressed,
        style,
      ]}
      {...props}>
      <config.Icon />
      <Text style={[styles.label, isPrimary ? styles.labelPrimary : styles.labelLight]}>
        {config.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 44,
    borderRadius: 999,
    paddingHorizontal: 24,
    width: '100%',
  },
  buttonLight: {
    backgroundColor: SproutlyColors.surface,
  },
  buttonPrimary: {
    backgroundColor: SproutlyColors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontFamily: FontFamily.interMedium,
    fontSize: 16,
    letterSpacing: LetterSpacing.body,
  },
  labelLight: {
    color: SproutlyColors.black,
  },
  labelPrimary: {
    color: SproutlyColors.white,
  },
  iconWrap: {
    width: 20,
    alignItems: 'center',
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: SproutlyColors.icon,
  },
  appleIcon: {
    fontSize: 20,
    color: SproutlyColors.icon,
  },
  emailIcon: {
    fontSize: 18,
    color: SproutlyColors.white,
  },
});
