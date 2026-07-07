import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { type Href, router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ImagePickerSheet } from '@/components/sproutly/image-picker-sheet';
import { PrimaryButton } from '@/components/sproutly/primary-button';
import { SproutlyTextInput } from '@/components/sproutly/sproutly-text-input';
import { useAuth } from '@/contexts/auth-context';
import { updateProfileDetails, uploadAvatarImage } from '@/lib/settings';
import { FontFamily, LetterSpacing, Spacing, SproutlyColors } from '@/constants/theme';

async function pickImage(source: 'camera' | 'gallery'): Promise<string | null> {
  if (source === 'camera') {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Camera access needed', 'Allow camera access to take a profile photo.');
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
    Alert.alert('Photos access needed', 'Allow photo library access to choose a profile photo.');
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

export default function PersonalDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { user, profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [avatarUri, setAvatarUri] = useState<string | null>(profile?.avatar_url ?? null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFullName(profile?.full_name ?? '');
    setAvatarUri(profile?.avatar_url ?? null);
  }, [profile?.avatar_url, profile?.full_name]);

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Not signed in', 'Please sign in to update your profile.');
      router.replace('/(auth)/welcome' as Href);
      return;
    }

    const trimmedName = fullName.trim();
    if (!trimmedName) {
      Alert.alert('Add your name', 'Enter a name to continue.');
      return;
    }

    setSaving(true);
    try {
      let avatarUrl = profile?.avatar_url ?? null;

      if (avatarUri !== profile?.avatar_url) {
        avatarUrl = avatarUri ? await uploadAvatarImage(user.id, avatarUri) : null;
      }

      await updateProfileDetails(user.id, {
        fullName: trimmedName,
        avatarUrl,
      });

      await refreshProfile();
      router.back();
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

      <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
          <SymbolView name="chevron.left" size={18} tintColor={SproutlyColors.black} weight="semibold" />
        </Pressable>
        <Text style={styles.headerTitle}>Personal details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.content}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Change profile photo"
            onPress={() => setPickerVisible(true)}
            style={({ pressed }) => [styles.avatarButton, pressed && styles.pressed]}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} contentFit="cover" />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <SymbolView
                  name="person.fill"
                  size={36}
                  tintColor={SproutlyColors.primary}
                  weight="medium"
                />
              </View>
            )}
            <View style={styles.avatarBadge}>
              <SymbolView name="camera.fill" size={12} tintColor={SproutlyColors.white} />
            </View>
          </Pressable>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full name</Text>
            <SproutlyTextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Your name"
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.readOnlyField}>
              <Text style={styles.readOnlyText}>{profile?.email ?? user?.email ?? ''}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.three }]}>
          {saving ? <ActivityIndicator color={SproutlyColors.primary} style={styles.spinner} /> : null}
          <PrimaryButton
            label={saving ? 'Saving…' : 'Save changes'}
            variant="primary"
            onPress={handleSave}
            disabled={saving}
          />
        </View>
      </KeyboardAvoidingView>

      <ImagePickerSheet
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onSelect={async (option) => {
          if (option === 'emoji') {
            setAvatarUri(null);
            return;
          }

          const uri = await pickImage(option);
          if (uri) {
            setAvatarUri(uri);
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SproutlyColors.cardBorder,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SproutlyColors.surface,
  },
  headerTitle: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 17,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.black,
  },
  headerSpacer: {
    width: 36,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
    gap: Spacing.four,
    alignItems: 'center',
  },
  avatarButton: {
    position: 'relative',
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 3,
    borderColor: SproutlyColors.plantsTagBg,
  },
  avatarPlaceholder: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SproutlyColors.surface,
    borderWidth: 2,
    borderColor: SproutlyColors.cardBorder,
  },
  avatarBadge: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SproutlyColors.primary,
    borderWidth: 2,
    borderColor: SproutlyColors.white,
  },
  fieldGroup: {
    width: '100%',
    gap: Spacing.two,
  },
  label: {
    fontFamily: FontFamily.interMedium,
    fontSize: 14,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.textMuted,
  },
  readOnlyField: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: SproutlyColors.cardBorder,
    backgroundColor: SproutlyColors.surface,
    paddingHorizontal: Spacing.three,
    justifyContent: 'center',
  },
  readOnlyText: {
    fontFamily: FontFamily.interMedium,
    fontSize: 15,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.textMuted,
  },
  footer: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    alignItems: 'center',
    gap: Spacing.two,
  },
  spinner: {
    marginBottom: Spacing.one,
  },
  pressed: {
    opacity: 0.85,
  },
});
