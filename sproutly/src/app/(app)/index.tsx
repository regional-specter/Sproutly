import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FontFamily, LetterSpacing, Spacing, SproutlyColors } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Sproutly</Text>
        <Text style={styles.subtitle}>Main app coming soon.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SproutlyColors.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.two,
  },
  title: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 28,
    letterSpacing: LetterSpacing.headingSm,
    color: SproutlyColors.black,
  },
  subtitle: {
    fontFamily: FontFamily.interMedium,
    fontSize: 16,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.textMuted,
  },
});
