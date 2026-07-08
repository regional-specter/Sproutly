import { Image } from 'expo-image';
import { SymbolView } from '@/components/sproutly/symbol-view';
import { Pressable, ScrollView, StyleSheet, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/auth-context';
import { FontFamily, Spacing, SproutlyColors } from '@/constants/theme';

type AppScreenLayoutProps = ViewProps & {
  children: React.ReactNode;
  scrollable?: boolean;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
};

export function AppScreenLayout({
  children,
  scrollable = true,
  onNotificationPress,
  onProfilePress,
  style,
  ...props
}: AppScreenLayoutProps) {
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();

  const content = scrollable ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.scrollView}>
      {children}
    </ScrollView>
  ) : (
    <View style={styles.staticContent}>{children}</View>
  );

  return (
    <View style={[styles.container, style]} {...props}>
      <Image
        source={require('@/assets/figma/icons/app-bg.png')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />

      <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
        <Image
          source={require('@/assets/figma/app-logo.png')}
          style={styles.logo}
          contentFit="contain"
        />

        <View style={styles.headerActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            hitSlop={8}
            onPress={onNotificationPress}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
            <SymbolView
              name="bell"
              size={22}
              tintColor={SproutlyColors.white}
              weight="regular"
            />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Profile"
            hitSlop={8}
            onPress={onProfilePress}
            style={({ pressed }) => [pressed && styles.pressed]}>
            {profile?.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} style={styles.avatar} contentFit="cover" />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <SymbolView
                  name="person.fill"
                  size={18}
                  tintColor={SproutlyColors.white}
                />
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <View style={styles.contentPanel}>{content}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SproutlyColors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  logo: {
    width: 132,
    height: 32,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: SproutlyColors.white,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: SproutlyColors.white,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentPanel: {
    flex: 1,
    backgroundColor: SproutlyColors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.four,
  },
  staticContent: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.four,
  },
  pressed: {
    opacity: 0.75,
  },
});
