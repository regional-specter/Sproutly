import { Image } from 'expo-image';
import { type Href, useRouter } from 'expo-router';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/sproutly/primary-button';
import { FontFamily, LetterSpacing, Spacing, SproutlyColors } from '@/constants/theme';

export default function OnboardingWelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const goToApp = () => {
    router.replace('/(app)' as Href);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Image
        source={require('@/assets/figma/welcome-screen.png')}
        style={styles.background}
        contentFit="cover"
      />
      <View
        style={[
          styles.content,
          { paddingTop: insets.top, paddingBottom: insets.bottom + Spacing.four },
        ]}>
        <View style={styles.textBlock}>
          <Text style={styles.title}>Welcome to Sproutly</Text>
          <Text style={styles.body}>
            Snap a photo, get instant plant ID and health insights. Sproutly builds your personalized
            care schedule and reminders automatically.
          </Text>
        </View>

        <PrimaryButton
          label="Start Growing"
          variant="primary"
          onPress={goToApp}
          style={styles.startButton}
          labelStyle={styles.startButtonLabel}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SproutlyColors.white,
  },
  background: {
    ...StyleSheet.absoluteFill,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    justifyContent: 'flex-end',
    gap: Spacing.five,
  },
  textBlock: {
    gap: Spacing.three,
    paddingBottom: Spacing.two,
  },
  title: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: LetterSpacing.headingLg,
    color: SproutlyColors.primary,
  },
  body: {
    fontFamily: FontFamily.interMedium,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.black,
  },
  startButton: {
    alignSelf: 'stretch',
  },
  startButtonLabel: {
    fontSize: 20,
    fontFamily: FontFamily.interSemiBold
  },
});
