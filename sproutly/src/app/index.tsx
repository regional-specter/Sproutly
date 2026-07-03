import { type Href, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

import { GradientBackground } from '@/components/sproutly/gradient-background';
import { SproutlyLogo } from '@/components/sproutly/sproutly-logo';

const SPLASH_DURATION_MS = 2000;

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(auth)/welcome' as Href);
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <GradientBackground variant="splash" style={styles.gradient}>
        <View style={styles.content}>
          <SproutlyLogo size="lg" />
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
  },
});
