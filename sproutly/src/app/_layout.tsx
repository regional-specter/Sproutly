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
import { DefaultTheme, ThemeProvider } from 'expo-router';

import { AuthProvider } from '@/contexts/auth-context';
import { SproutlyColors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

const SproutlyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: SproutlyColors.white,
    primary: SproutlyColors.primary,
    card: SproutlyColors.white,
    text: SproutlyColors.black,
    border: '#E5E7EB',
  },
};

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
    <ThemeProvider value={SproutlyTheme}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth/callback" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(app)" />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}
