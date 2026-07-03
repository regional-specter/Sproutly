import { type Href, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/auth-context';
import { signInWithEmail, signUpWithEmail } from '@/lib/auth';
import { PrimaryButton } from '@/components/sproutly/primary-button';
import { SproutlyTextInput } from '@/components/sproutly/sproutly-text-input';
import { FontFamily, LetterSpacing, Spacing, SproutlyColors } from '@/constants/theme';

type AuthMode = 'signUp' | 'signIn';

export default function EmailAuthScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { refreshProfile } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signUp');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isSignUp = mode === 'signUp';

  const handleSubmit = async () => {
    if (!email.trim() || password.length < 6) {
      Alert.alert('Check your details', 'Enter a valid email and a password with at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { session } = await signUpWithEmail(email, password);
        if (!session) {
          Alert.alert(
            'Confirm your email',
            'We sent you a confirmation link. Open it, then sign in with your password.',
          );
          setMode('signIn');
          return;
        }
      } else {
        await signInWithEmail(email, password);
      }

      await refreshProfile();
      router.replace('/(onboarding)/profile' as Href);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      Alert.alert(isSignUp ? 'Sign up failed' : 'Sign in failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + Spacing.five, paddingBottom: insets.bottom + Spacing.three },
          ]}
          keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backLabel}>Back</Text>
          </Pressable>

          <View style={styles.header}>
            <Text style={styles.title}>{isSignUp ? 'Create your account' : 'Welcome back'}</Text>
            <Text style={styles.subtitle}>
              {isSignUp
                ? 'Set your email and password to get started.'
                : 'Sign in with the email and password you created.'}
            </Text>
          </View>

          <View style={styles.form}>
            <SproutlyTextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
            />
            <SproutlyTextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry
              textContentType={isSignUp ? 'newPassword' : 'password'}
            />
          </View>

          <View style={styles.footer}>
            <PrimaryButton
              label={loading ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
              onPress={handleSubmit}
              disabled={loading}
            />
            {loading ? <ActivityIndicator color={SproutlyColors.primary} style={styles.spinner} /> : null}
            <Pressable
              onPress={() => setMode(isSignUp ? 'signIn' : 'signUp')}
              style={styles.switchMode}>
              <Text style={styles.switchModeText}>
                {isSignUp ? 'Already have an account? Sign in' : 'New here? Create an account'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.one,
  },
  backLabel: {
    fontFamily: FontFamily.interMedium,
    fontSize: 16,
    color: SproutlyColors.primary,
  },
  header: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  title: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: LetterSpacing.headingSm,
    color: SproutlyColors.black,
  },
  subtitle: {
    fontFamily: FontFamily.interMedium,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.textMuted,
  },
  form: {
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  footer: {
    marginTop: 'auto',
    gap: Spacing.two,
    alignItems: 'center',
  },
  spinner: {
    marginTop: Spacing.one,
  },
  switchMode: {
    paddingVertical: Spacing.two,
  },
  switchModeText: {
    fontFamily: FontFamily.interMedium,
    fontSize: 15,
    color: SproutlyColors.primary,
    textAlign: 'center',
  },
});
