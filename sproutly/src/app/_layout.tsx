import {
  Gabarito_500Medium,
  Gabarito_600SemiBold,
} from '@expo-google-fonts/gabarito';
import {
  Inter_500Medium,
  Inter_500Medium_Italic,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { AuthProvider } from '@/contexts/auth-context';
import { SproutlyColors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_500Medium,
    Inter_500Medium_Italic,
    Inter_600SemiBold,
    Gabarito_500Medium,
    Gabarito_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (__DEV__ && fontError) {
      console.error('Failed to load fonts:', fontError);
    }
  }, [fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: SproutlyColors.white },
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/callback" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(app)" />
        <Stack.Screen name="plant/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="settings/personal-details" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </AuthProvider>
  );
}
