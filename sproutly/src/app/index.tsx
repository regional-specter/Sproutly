import { type Href, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';

import { GradientBackground } from '@/components/sproutly/gradient-background';
import { SproutlyLogo } from '@/components/sproutly/sproutly-logo';
import { useAuth } from '@/contexts/auth-context';
import { SproutlyColors } from '@/constants/theme';

const SPLASH_DURATION_MS = 1500;

export default function SplashScreen() {
  const router = useRouter();
  const { session, isLoading, needsOnboarding } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (!session) {
        router.replace('/(auth)/welcome' as Href);
        return;
      }

      if (needsOnboarding) {
        router.replace('/(onboarding)/profile' as Href);
        return;
      }

      router.replace('/(app)' as Href);
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [isLoading, needsOnboarding, router, session]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <GradientBackground variant="splash" style={styles.gradient}>
        <View style={styles.content}>
          <SproutlyLogo size="lg" />
          {isLoading ? (
            <ActivityIndicator color={SproutlyColors.white} style={styles.spinner} />
          ) : null}
        </View>
      </GradientBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  spinner: {
    marginTop: 8,
  },
});
