import { Image } from 'expo-image';
import { type Href, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/sproutly/auth-button';
import { GradientBackground } from '@/components/sproutly/gradient-background';
import { SproutlyLogo } from '@/components/sproutly/sproutly-logo';
import { useAuth } from '@/contexts/auth-context';
import { signInWithGoogle } from '@/lib/auth';
import { FontFamily, LetterSpacing, Spacing, SproutlyColors } from '@/constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { refreshProfile } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);

  const goToOnboarding = () => {
    router.replace('/(onboarding)/profile' as Href);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { cancelled, session } = await signInWithGoogle();
      if (cancelled || !session) return;

      await refreshProfile();
      goToOnboarding();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Google sign-in failed. Please try again.';
      Alert.alert('Sign in failed', message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAppleSignIn = () => {
    Alert.alert('Coming soon', 'Apple sign-in is not set up yet. Use Google or email for now.');
  };

  const handleEmailSignIn = () => {
    router.push('/(auth)/email' as Href);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <GradientBackground variant="auth">
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + Spacing.three, paddingBottom: insets.bottom + Spacing.three },
          ]}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <SproutlyLogo size="sm" />
          </View>

          <View style={styles.plantSection}>
            <Image
              source={require('@/assets/figma/log-in-plant.png')}
              style={styles.plantImage}
              contentFit="contain"
            />
          </View>

          <View style={styles.headings}>
            <Text style={styles.heading}>Know your plant.</Text>
            <Text style={styles.heading}>Grow your plant.</Text>
          </View>

          <View style={styles.buttons}>
            <AuthButton
              provider="google"
              onPress={handleGoogleSignIn}
              disabled={googleLoading}
            />
            {googleLoading ? (
              <ActivityIndicator color={SproutlyColors.primary} style={styles.spinner} />
            ) : null}
            <AuthButton provider="apple" onPress={handleAppleSignIn} />
            <AuthButton provider="email" onPress={handleEmailSignIn} />
          </View>
        </ScrollView>
      </GradientBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SproutlyColors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  header: {
    alignItems: 'center',
    paddingTop: Spacing.two,
  },
  plantSection: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 320,
  },
  plantImage: {
    width: 320,
    height: 340,
  },
  headings: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.two,
  },
  heading: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: LetterSpacing.headingLg,
    color: SproutlyColors.black,
    textAlign: 'center',
  },
  buttons: {
    gap: 12,
    marginTop: 'auto',
    paddingTop: Spacing.three,
  },
  spinner: {
    marginTop: -4,
  },
});
