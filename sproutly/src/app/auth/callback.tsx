import * as Linking from 'expo-linking';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { type Href, useRouter } from 'expo-router';

import { useAuth } from '@/contexts/auth-context';
import { createSessionFromUrl } from '@/lib/auth';
import { SproutlyColors } from '@/constants/theme';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const { refreshProfile } = useAuth();

  useEffect(() => {
    async function handleCallback() {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        await createSessionFromUrl(initialUrl);
      }

      const { needsOnboarding } = await refreshProfile();
      router.replace((needsOnboarding ? '/(onboarding)/profile' : '/(app)/home') as Href);
    }

    handleCallback().catch(() => {
      router.replace('/(auth)/welcome' as Href);
    });
  }, [refreshProfile, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={SproutlyColors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SproutlyColors.white,
  },
});
