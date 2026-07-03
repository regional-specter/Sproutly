import { Image } from 'expo-image';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StatusBar, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/sproutly/primary-button';
import { FontFamily, LetterSpacing, Spacing, SproutlyColors } from '@/constants/theme';

const GLOW_ASPECT = 642 / 1016;

export default function ProfileSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const glowTop = Math.max(0, insets.top - Spacing.six);
  const glowHeight = width / GLOW_ASPECT;
  const doodlesTop = height * 0.46;
  const badgeTop = glowTop + glowHeight * 0.34;
  const contentTop = insets.top + Spacing.four;
  const heroOffset = Math.max(Spacing.four, badgeTop - contentTop);

  const goToWelcome = () => {
    router.push('/(onboarding)/welcome' as Href);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Image
        source={require('@/assets/figma/Green-check-glow.png')}
        style={[styles.checkGlow, { top: glowTop, width, height: glowHeight }]}
        contentFit="fill"
      />
      <Image
        source={require('@/assets/figma/Icons.png')}
        style={[
          styles.doodles,
          { top: doodlesTop, width: width + 32, height: 360, left: -16 },
        ]}
        contentFit="contain"
      />
      <View
        style={[
          styles.content,
          { paddingTop: contentTop, paddingBottom: insets.bottom + Spacing.three },
        ]}>
        <View style={[styles.hero, { paddingTop: heroOffset + Spacing.six + Spacing.six + Spacing.five }]}>
          <View style={styles.successBadge}>
            <Text style={styles.successBadgeText}>Successful</Text>
          </View>
        </View>

        <Text style={styles.message}>
          Profile saved. Your Sproutly account is ready. Start by scanning your first plant for an
          initial health status check.
        </Text>

        <View style={styles.feedbackCard}>
          <Text style={styles.feedbackText}>
            Loving your experience so far? Give us your feedback and rating so we can elevate your
            journey further
          </Text>
          <Pressable accessibilityRole="button">
            <Text style={styles.feedbackLink}>Give us a rating.</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <PrimaryButton label="Continue" onPress={goToWelcome} style={styles.continueButton} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SproutlyColors.white,
  },
  checkGlow: {
    position: 'absolute',
    left: 0,
    zIndex: 0,
    pointerEvents: 'none',
  },
  doodles: {
    position: 'absolute',
    zIndex: 1,
    pointerEvents: 'none',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    zIndex: 2,
    backgroundColor: 'transparent',
  },
  hero: {
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  successBadge: {
    backgroundColor: '#9AF2B7',
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 999,
  },
  successBadgeText: {
    fontFamily: FontFamily.interMedium,
    fontSize: 14,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.secondary,
  },
  message: {
    fontFamily: FontFamily.interMedium,
    fontSize: 17,
    lineHeight: 23,
    letterSpacing: -0.9,
    color: SproutlyColors.black,
    textAlign: 'center',
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.five,
  },
  feedbackCard: {
    backgroundColor: SproutlyColors.white,
    borderRadius: 16,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    gap: Spacing.one,
    marginTop: 'auto',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F3',
  },
  feedbackText: {
    fontFamily: FontFamily.interMedium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.black,
    textAlign: 'left',
  },
  feedbackLink: {
    fontFamily: FontFamily.interMedium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.black,
    textAlign: 'left',
    textDecorationLine: 'underline',
  },
  footer: {
    paddingTop: Spacing.four,
    alignItems: 'center',
  },
  continueButton: {
    alignSelf: 'stretch',
  },
});
