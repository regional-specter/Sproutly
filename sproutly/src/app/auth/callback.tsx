import * as Linking from 'expo-linking';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { createSessionFromUrl } from '@/lib/auth';
import { SproutlyColors } from '@/constants/theme';

export default function AuthCallbackScreen() {
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        await createSessionFromUrl(initialUrl);
      }
      router.replace('/(onboarding)/profile');
    }

    handleCallback().catch(() => {
      router.replace('/(auth)/welcome');
    });
  }, [router]);

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
