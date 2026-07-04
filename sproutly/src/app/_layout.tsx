import {
  Gabarito_500Medium,
  Gabarito_600SemiBold,
  useFonts as useGabaritoFonts,
} from '@expo-google-fonts/gabarito';
import {
  Inter_500Medium,
  Inter_600SemiBold,
  useFonts as useInterFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { AuthProvider } from '@/contexts/auth-context';
import { SproutlyColors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [interLoaded] = useInterFonts({
    Inter_500Medium,
    Inter_600SemiBold,
  });
  const [gabaritoLoaded] = useGabaritoFonts({
    Gabarito_500Medium,
    Gabarito_600SemiBold,
  });

  const fontsLoaded = interLoaded && gabaritoLoaded;

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
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
      </Stack>
    </AuthProvider>
  );
}
