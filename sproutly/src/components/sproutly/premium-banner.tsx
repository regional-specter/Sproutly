import { Image } from 'expo-image';
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
      <View style={styles.banner}>
        <Image
          source={require('@/assets/figma/footer-bg.png')}
          style={styles.bannerBackground}
          contentFit="cover"
        />

        <View style={styles.copy}>
          <Text style={styles.title}>Get Premium</Text>
          <Text style={styles.subtitle}>Enjoy all the benefits of the app</Text>
        </View>

        <View style={styles.sparkles}>
          <SymbolView name="sparkles" size={52} tintColor={SproutlyColors.white} weight="medium" />
        </View>
      </View>
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
      style={({ pressed }) => [styles.buttonWrapper, pressed && styles.pressed]}>
      <LinearGradient
        colors={['#377C4D', '#489E4B']}
        locations={[0.25, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.button}>
        <SymbolView name="sparkles" size={14} tintColor={SproutlyColors.white} weight="medium" />
        <Text style={styles.buttonLabel}>Get Premium</Text>
      </LinearGradient>
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
    backgroundColor: SproutlyColors.primary,
  },
  bannerBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
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
  buttonWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
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
