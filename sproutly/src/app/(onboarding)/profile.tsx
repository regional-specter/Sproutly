import * as ImagePicker from 'expo-image-picker';
import { type Href, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { useAuth } from '@/contexts/auth-context';
import { createFirstPlant, updateProfileName, uploadPlantImage } from '@/lib/plants';
import { FontFamily, LetterSpacing, Spacing, SproutlyColors } from '@/constants/theme';

async function pickImage(source: 'camera' | 'gallery'): Promise<string | null> {
  if (source === 'camera') {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Camera access needed', 'Allow camera access to take a plant photo.');
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    return result.canceled ? null : result.assets[0]?.uri ?? null;
  }

  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    Alert.alert('Photos access needed', 'Allow photo library access to choose a plant image.');
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.85,
  });

  return result.canceled ? null : result.assets[0]?.uri ?? null;
}

export default function ProfileSetupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, refreshProfile, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [plantImageUri, setPlantImageUri] = useState<string | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/(auth)/welcome' as Href);
    }
  }, [isLoading, router, user]);

  const handleContinue = async () => {
    if (!user) {
      Alert.alert('Not signed in', 'Please sign in first.');
      router.replace('/(auth)/welcome' as Href);
      return;
    }

    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert('Add your name', 'Enter a name to continue.');
      return;
    }

    setSaving(true);
    try {
      await updateProfileName(user.id, trimmedName);

      let coverImageUrl: string | null = null;
      if (plantImageUri) {
        coverImageUrl = await uploadPlantImage(user.id, plantImageUri);
      }

      await createFirstPlant({
        userId: user.id,
        nickname: `${trimmedName.split(' ')[0]}'s Plant`,
        coverImageUrl,
      });

      await refreshProfile();
      router.push('/(onboarding)/success' as Href);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Could not save your profile. Please try again.';
      Alert.alert('Save failed', message);
    } finally {
      setSaving(false);
    }
  };

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
            {saving ? <ActivityIndicator color={SproutlyColors.primary} style={styles.spinner} /> : null}
            <PrimaryButton
              label={saving ? 'Saving…' : 'Continue'}
              onPress={handleContinue}
              disabled={saving}
            />
          </View>
        </View>
      </KeyboardAvoidingView>

      <ImagePickerSheet
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onSelect={async (option) => {
          if (option === 'emoji') {
            setPlantImageUri(null);
            return;
          }

          const uri = await pickImage(option);
          if (uri) {
            setPlantImageUri(uri);
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
    gap: Spacing.two,
  },
  spinner: {
    marginBottom: Spacing.one,
  },
});
