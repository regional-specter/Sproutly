import { StyleSheet, Text, View } from 'react-native';

import { AppScreenLayout } from '@/components/sproutly/app-screen-layout';
import { FontFamily, LetterSpacing, Spacing, SproutlyColors } from '@/constants/theme';

export default function AnalysisScreen() {
  return (
    <AppScreenLayout scrollable={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Analysis</Text>
        <Text style={styles.subtitle}>Plant insights and trends will appear here.</Text>
      </View>
    </AppScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  title: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 24,
    letterSpacing: LetterSpacing.headingSm,
    color: SproutlyColors.black,
  },
  subtitle: {
    fontFamily: FontFamily.interMedium,
    fontSize: 15,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.textMuted,
    textAlign: 'center',
  },
});
