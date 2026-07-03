import { type Href, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ImagePickerSheet } from '@/components/sproutly/image-picker-sheet';
import { ImageUploadCircle } from '@/components/sproutly/image-upload-circle';
import { PrimaryButton } from '@/components/sproutly/primary-button';
import { SproutlyTextInput } from '@/components/sproutly/sproutly-text-input';
import { FontFamily, LetterSpacing, Spacing, SproutlyColors } from '@/constants/theme';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [plantImageUri, setPlantImageUri] = useState<string | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View
          style={[
            styles.content,
            { paddingTop: insets.top + Spacing.five, paddingBottom: insets.bottom + Spacing.three },
          ]}>
          <View style={styles.nameSection}>
            <Text style={styles.sectionTitle}>Enter Your Name</Text>
            <Text style={styles.sectionSubtitle}>Choose a name for your account</Text>
            <SproutlyTextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          <View style={styles.plantSection}>
            <View style={styles.plantText}>
              <Text style={styles.sectionTitle}>Add your first plant</Text>
              <Text style={styles.sectionSubtitle}>Add an image of your plant</Text>
            </View>
            <View style={styles.circleContainer}>
              <ImageUploadCircle imageUri={plantImageUri} onPress={() => setPickerVisible(true)} />
            </View>
          </View>

          <View style={styles.footer}>
            <PrimaryButton
              label="Continue"
              onPress={() => router.push('/(onboarding)/success' as Href)}
            />
          </View>
        </View>
      </KeyboardAvoidingView>

      <ImagePickerSheet
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onSelect={(option) => {
          if (option === 'emoji') {
            setPlantImageUri(null);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SproutlyColors.white,
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.four,
  },
  nameSection: {
    gap: Spacing.two,
  },
  plantSection: {
    flex: 1,
    marginTop: Spacing.five,
  },
  plantText: {
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  circleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: LetterSpacing.headingSm,
    color: SproutlyColors.black,
  },
  sectionSubtitle: {
    fontFamily: FontFamily.interMedium,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.textMuted,
  },
  footer: {
    paddingTop: Spacing.two,
    alignItems: 'center',
  },
});
