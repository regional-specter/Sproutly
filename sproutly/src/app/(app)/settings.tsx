import { type Href, router } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GetPremiumButton, PremiumBanner } from '@/components/sproutly/premium-banner';
import { SettingsRow } from '@/components/sproutly/settings-row';
import { useAuth } from '@/contexts/auth-context';
import { signOut } from '@/lib/auth';
import {
  deleteUserAccount,
  getLanguageLabel,
  getLanguagePreference,
  isPremiumActive,
  LANGUAGES,
  openAppStoreReview,
  openFeedbackEmail,
  setLanguagePreference,
  type LanguageCode,
} from '@/lib/settings';
import { FontFamily, LetterSpacing, Spacing, SproutlyColors } from '@/constants/theme';

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { profile, user } = useAuth();
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [isProcessing, setIsProcessing] = useState(false);

  const showPremiumCta = !isPremiumActive(profile);

  useFocusEffect(
    useCallback(() => {
      getLanguagePreference().then(setLanguage).catch(() => setLanguage('en'));
    }, []),
  );

  const handleComingSoon = (feature: string) => {
    Alert.alert(feature, 'This will be available soon.');
  };

  const handlePremiumPress = () => {
    Alert.alert(
      'Get Premium',
      'Unlock unlimited plant scans, vegetable yield tracking, and more. Premium subscriptions are coming soon.',
    );
  };

  const handleLanguagePress = () => {
    const options = [...LANGUAGES.map((item) => item.label), 'Cancel'];
    const cancelButtonIndex = options.length - 1;

    const applyLanguage = async (code: LanguageCode) => {
      try {
        await setLanguagePreference(code);
        setLanguage(code);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Could not save your language preference.';
        Alert.alert('Save failed', message);
      }
    };

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
          title: 'Language',
        },
        (buttonIndex) => {
          if (buttonIndex === cancelButtonIndex) return;
          const selected = LANGUAGES[buttonIndex];
          if (selected) {
            void applyLanguage(selected.code);
          }
        },
      );
      return;
    }

    Alert.alert('Language', 'Choose your preferred language', [
      ...LANGUAGES.map((item) => ({
        text: item.label,
        onPress: () => {
          void applyLanguage(item.code);
        },
      })),
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleRateUs = async () => {
    try {
      await openAppStoreReview();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Could not open the app store.';
      Alert.alert('Unable to rate', message);
    }
  };

  const handleFeedback = async () => {
    try {
      await openFeedbackEmail();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Could not open your email app.';
      Alert.alert('Unable to send feedback', message);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          void (async () => {
            setIsProcessing(true);
            try {
              await signOut();
              router.replace('/(auth)/welcome' as Href);
            } catch (error) {
              const message =
                error instanceof Error ? error.message : 'Could not log out. Please try again.';
              Alert.alert('Logout failed', message);
            } finally {
              setIsProcessing(false);
            }
          })();
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete account',
      'This permanently deletes your profile, plants, scans, and care history. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete account',
          style: 'destructive',
          onPress: () => {
            void (async () => {
              setIsProcessing(true);
              try {
                await deleteUserAccount();
                await signOut();
                router.replace('/(auth)/welcome' as Href);
              } catch (error) {
                const message =
                  error instanceof Error
                    ? error.message
                    : 'Could not delete your account. Please try again.';
                Alert.alert('Delete failed', message);
              } finally {
                setIsProcessing(false);
              }
            })();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + Spacing.three, paddingBottom: insets.bottom + Spacing.five },
        ]}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          {showPremiumCta ? <GetPremiumButton onPress={handlePremiumPress} /> : null}
        </View>

        <SettingsSection title="General">
          <SettingsRow
            label="Personal details"
            icon="person.fill"
            onPress={() => router.push('/settings/personal-details' as Href)}
            disabled={isProcessing}
          />
          <SettingsRow
            label="Language"
            icon="globe"
            value={getLanguageLabel(language)}
            onPress={handleLanguagePress}
            disabled={isProcessing}
          />
          <SettingsRow
            label="Rate us"
            icon="star.fill"
            onPress={handleRateUs}
            disabled={isProcessing}
          />
          <SettingsRow
            label="Privacy Policy"
            icon="checkmark.shield.fill"
            onPress={() => handleComingSoon('Privacy Policy')}
            disabled={isProcessing}
          />
          <SettingsRow
            label="Terms Of Use"
            icon="doc.text.fill"
            onPress={() => handleComingSoon('Terms Of Use')}
            disabled={isProcessing}
          />
          <SettingsRow
            label="Feedback"
            icon="envelope.fill"
            onPress={handleFeedback}
            disabled={isProcessing}
            showDivider={false}
          />
        </SettingsSection>

        {showPremiumCta ? <PremiumBanner onPress={handlePremiumPress} /> : null}

        <SettingsSection title="Account">
          <SettingsRow
            label="Delete account"
            icon="trash.fill"
            onPress={handleDeleteAccount}
            disabled={isProcessing || !user}
            destructive
          />
          <SettingsRow
            label="Logout"
            icon="rectangle.portrait.and.arrow.right"
            onPress={handleLogout}
            disabled={isProcessing || !user}
            showDivider={false}
          />
        </SettingsSection>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SproutlyColors.surface,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    marginBottom: Spacing.one,
  },
  title: {
    flex: 1,
    fontFamily: FontFamily.interSemiBold,
    fontSize: 32,
    letterSpacing: LetterSpacing.headingLg,
    color: SproutlyColors.black,
  },
  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    fontFamily: FontFamily.interMedium,
    fontSize: 13,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.textMuted,
    paddingHorizontal: Spacing.one,
  },
  sectionCard: {
    borderRadius: 16,
    backgroundColor: SproutlyColors.white,
    borderWidth: 1,
    borderColor: SproutlyColors.cardBorder,
    overflow: 'hidden',
  },
});
