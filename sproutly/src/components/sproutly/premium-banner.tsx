import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontFamily, LetterSpacing, Spacing, SproutlyColors } from '@/constants/theme';

type PremiumBannerProps = {
  onPress?: () => void;
};

export function PremiumBanner({ onPress }: PremiumBannerProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}>
      <LinearGradient
        colors={[SproutlyColors.primary, SproutlyColors.secondary]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.banner}>
        <View style={styles.copy}>
          <Text style={styles.title}>Get Premium</Text>
          <Text style={styles.subtitle}>Enjoy all the benefits of the app</Text>
        </View>

        <View style={styles.sparkles}>
          <SymbolView name="sparkles" size={34} tintColor={SproutlyColors.white} weight="medium" />
          <View style={styles.sparkleSmallTop}>
            <SymbolView
              name="sparkle"
              size={18}
              tintColor="rgba(255,255,255,0.85)"
              weight="medium"
            />
          </View>
          <View style={styles.sparkleSmallBottom}>
            <SymbolView
              name="sparkle"
              size={14}
              tintColor="rgba(255,255,255,0.7)"
              weight="medium"
            />
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

type GetPremiumButtonProps = {
  onPress?: () => void;
};

export function GetPremiumButton({ onPress }: GetPremiumButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <SymbolView name="sparkles" size={14} tintColor={SproutlyColors.white} weight="medium" />
      <Text style={styles.buttonLabel}>Get Premium</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  banner: {
    minHeight: 108,
    borderRadius: 20,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  copy: {
    flex: 1,
    gap: 4,
    paddingRight: Spacing.two,
  },
  title: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 20,
    letterSpacing: LetterSpacing.headingSm,
    color: SproutlyColors.white,
  },
  subtitle: {
    fontFamily: FontFamily.interMedium,
    fontSize: 13,
    letterSpacing: LetterSpacing.body,
    color: 'rgba(255,255,255,0.9)',
  },
  sparkles: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleSmallTop: {
    position: 'absolute',
    top: 8,
    right: 4,
  },
  sparkleSmallBottom: {
    position: 'absolute',
    bottom: 10,
    left: 0,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: SproutlyColors.primary,
  },
  buttonLabel: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 13,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.white,
  },
  pressed: {
    opacity: 0.85,
  },
});
