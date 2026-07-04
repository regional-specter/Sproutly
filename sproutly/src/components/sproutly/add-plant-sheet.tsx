import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CancelRoundIcon } from '@/components/sproutly/figma-icons';
import { ImagePickerSheet } from '@/components/sproutly/image-picker-sheet';
import { ImageUploadCircle } from '@/components/sproutly/image-upload-circle';
import { PrimaryButton } from '@/components/sproutly/primary-button';
import { SproutlyTextInput } from '@/components/sproutly/sproutly-text-input';
import { createPlant, uploadPlantImage } from '@/lib/plants';
import { FontFamily, LetterSpacing, Spacing, SproutlyColors } from '@/constants/theme';

type AddPlantSheetProps = {
  visible: boolean;
  userId: string;
  onClose: () => void;
  onPlantCreated: () => Promise<void>;
};

const ANIMATION_MS = 280;

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

    return result.canceled ? null : (result.assets[0]?.uri ?? null);
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

  return result.canceled ? null : (result.assets[0]?.uri ?? null);
}

export function AddPlantSheet({ visible, userId, onClose, onPlantCreated }: AddPlantSheetProps) {
  const insets = useSafeAreaInsets();
  const backdropOpacity = useSharedValue(0);
  const sheetTranslateY = useSharedValue(400);

  const [nickname, setNickname] = useState('');
  const [plantImageUri, setPlantImageUri] = useState<string | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      backdropOpacity.value = withTiming(1, {
        duration: ANIMATION_MS,
        easing: Easing.out(Easing.ease),
      });
      sheetTranslateY.value = withTiming(0, {
        duration: ANIMATION_MS,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      backdropOpacity.value = 0;
      sheetTranslateY.value = 400;
      setNickname('');
      setPlantImageUri(null);
      setPickerVisible(false);
      setSaving(false);
    }
  }, [visible, backdropOpacity, sheetTranslateY]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

  const handleSave = async () => {
    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) {
      Alert.alert('Name your plant', 'Enter a nickname to add this plant.');
      return;
    }

    setSaving(true);
    try {
      let coverImageUrl: string | null = null;
      if (plantImageUri) {
        coverImageUrl = await uploadPlantImage(userId, plantImageUri);
      }

      await createPlant({
        userId,
        nickname: trimmedNickname,
        coverImageUrl,
      });

      await onPlantCreated();
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Could not add your plant. Please try again.';
      Alert.alert('Save failed', message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Animated.View style={[styles.backdrop, backdropStyle]}>
            <Pressable style={styles.backdropPressable} onPress={onClose} accessibilityRole="button" />
          </Animated.View>

          <Animated.View
            style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }, sheetStyle]}>
            <View style={styles.header}>
              <Text style={styles.title}>Add a plant</Text>
              <Pressable
                onPress={onClose}
                style={styles.closeButton}
                accessibilityLabel="Close"
                accessibilityRole="button">
                <CancelRoundIcon size={28} />
              </Pressable>
            </View>

            <View style={styles.form}>
              <SproutlyTextInput
                value={nickname}
                onChangeText={setNickname}
                placeholder="Plant nickname"
                autoCapitalize="words"
                autoCorrect={false}
                editable={!saving}
              />

              <View style={styles.imageSection}>
                <Text style={styles.imageLabel}>Plant photo (optional)</Text>
                <ImageUploadCircle
                  imageUri={plantImageUri}
                  onPress={() => !saving && setPickerVisible(true)}
                />
              </View>
            </View>

            <View style={styles.footer}>
              {saving ? (
                <ActivityIndicator color={SproutlyColors.primary} style={styles.spinner} />
              ) : null}
              <PrimaryButton
                label={saving ? 'Adding…' : 'Add plant'}
                onPress={handleSave}
                disabled={saving}
              />
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>

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
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  backdropPressable: {
    flex: 1,
  },
  sheet: {
    backgroundColor: SproutlyColors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    gap: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 18,
    letterSpacing: LetterSpacing.headingSm,
    color: SproutlyColors.black,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    gap: Spacing.three,
  },
  imageSection: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  imageLabel: {
    fontFamily: FontFamily.interMedium,
    fontSize: 14,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.textMuted,
  },
  footer: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  spinner: {
    marginBottom: Spacing.one,
  },
});
