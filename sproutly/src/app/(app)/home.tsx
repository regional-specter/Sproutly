import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreenLayout } from '@/components/sproutly/app-screen-layout';
import {
  FireAltIcon,
  HeartbeatIcon,
  LeafIcon,
  NotesMedicalIcon,
} from '@/components/sproutly/figma-icons';
import { LevelProgressRing } from '@/components/sproutly/level-progress-ring';
import { useAuth } from '@/contexts/auth-context';
import { FontFamily, LetterSpacing, Spacing, SproutlyColors } from '@/constants/theme';

type MockPlant = {
  id: string;
  name: string;
  species: string;
  checkups: number;
  health: number;
  image: string;
};

const MOCK_PLANTS: MockPlant[] = [
  {
    id: '1',
    name: 'Snake Plant',
    species: 'Sansevieria trifasciata',
    checkups: 2,
    health: 88,
    image:
      'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    id: '2',
    name: 'Chrysanthemum',
    species: 'Chrysanthemum morifolium',
    checkups: 1,
    health: 92,
    image:
      'https://images.unsplash.com/photo-1509937528035-ad25c1d1c063?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    id: '3',
    name: 'Monstera',
    species: 'Monstera deliciosa',
    checkups: 3,
    health: 95,
    image:
      'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=200&h=200&q=80',
  },
];

const MOCK_LEVEL = 6;
const MOCK_LEVEL_PROGRESS = 0.62;
const MOCK_PLANT_COUNT = 3;
const MOCK_STREAK_LABEL = '1 Week';
const MOCK_XP_CURRENT = 780;
const MOCK_XP_TARGET = 2000;

function getFirstName(fullName: string | null | undefined, email: string | undefined) {
  if (fullName?.trim()) {
    return fullName.trim().split(/\s+/)[0];
  }

  if (email) {
    return email.split('@')[0];
  }

  return 'Gardener';
}

export default function HomeScreen() {
  const { profile } = useAuth();
  const firstName = getFirstName(profile?.full_name, profile?.email);
  const xpProgress = MOCK_XP_CURRENT / MOCK_XP_TARGET;

  return (
    <AppScreenLayout>
      <View style={styles.welcomeCard}>
        <LevelProgressRing level={MOCK_LEVEL} progress={MOCK_LEVEL_PROGRESS} />

        <View style={styles.welcomeContent}>
          <Text style={styles.welcomeTitle}>Welcome Back, {firstName},</Text>
          <Text style={styles.welcomeSubtitle}>Snap a photo to update your garden</Text>

          <View style={styles.tagRow}>
            <View style={[styles.tag, styles.plantsTag]}>
              <LeafIcon size={10} />
              {/* Combined the base tag text style with a unique plants text style */}
              <Text style={[styles.tagText, styles.plantsTagText]}>{MOCK_PLANT_COUNT} Plants</Text>
            </View>

            <View style={[styles.tag, styles.streakTag]}>
              <FireAltIcon size={10} />
              {/* Combined the base tag text style with a unique streak text style */}
              <Text style={[styles.tagText, styles.streakTagText]}>{MOCK_STREAK_LABEL}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Plants</Text>

        <View style={styles.plantList}>
          {MOCK_PLANTS.map((plant) => (
            <Pressable
              key={plant.id}
              accessibilityRole="button"
              style={({ pressed }) => [styles.plantCard, pressed && styles.pressed]}>
              <Image source={{ uri: plant.image }} style={styles.plantImage} contentFit="cover" />

              <View style={styles.plantDetails}>
                <Text style={styles.plantName}>{plant.name}</Text>
                <Text style={styles.plantSpecies}>{plant.species}</Text>

                <View style={styles.plantStats}>
                  <View style={styles.statItem}>
                    <NotesMedicalIcon size={11} />
                    <Text style={styles.statText}>{plant.checkups} check-ups</Text>
                  </View>

                  <View style={styles.statItem}>
                    <HeartbeatIcon size={13} />
                    <Text style={[styles.statText, styles.healthText]}>{plant.health}%</Text>
                  </View>
                </View>
              </View>

              <SymbolView
                name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                size={14}
                tintColor={SproutlyColors.textMuted}
              />
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <View style={styles.progressIconWrap}>
            <SymbolView
              name={{ ios: 'bolt.fill', android: 'bolt', web: 'bolt' }}
              size={20}
              tintColor={SproutlyColors.primary}
            />
          </View>

          <View style={styles.progressCopy}>
            <Text style={styles.progressTitle}>Green Thumb</Text>
            <Text style={styles.progressSubtitle}>Your plants flourish under your care!</Text>
          </View>
        </View>

        <View style={styles.xpLabels}>
          <Text style={styles.xpLabel}>Progress to Plant Expert</Text>
          <Text style={styles.xpValue}>
            {MOCK_XP_CURRENT.toLocaleString()}/{MOCK_XP_TARGET.toLocaleString()} XP
          </Text>
        </View>

        <View style={styles.xpTrack}>
          <View style={[styles.xpFill, { width: `${xpProgress * 100}%` }]} />
        </View>
      </View>
    </AppScreenLayout>
  );
}

const styles = StyleSheet.create({
  welcomeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: 20,
    backgroundColor: SproutlyColors.surface,
  },
  welcomeContent: {
    flex: 1,
    gap: Spacing.one,
  },
  welcomeTitle: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 18,
    letterSpacing: LetterSpacing.headingSm,
    color: SproutlyColors.black,
  },
  welcomeSubtitle: {
    fontFamily: FontFamily.interMedium,
    fontSize: 13,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.textMuted,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  plantsTag: {
    backgroundColor: SproutlyColors.plantsTagBg,
  },
  streakTag: {
    backgroundColor: SproutlyColors.streakTagBg,
  },
  tagText: {
    fontFamily: FontFamily.interMedium,
    fontSize: 12,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.black,
  },
  // Add these new specific text color overrides right below it
  plantsTagText: {
    color: '#4CA04F', // Replace with your actual theme color key
  },
  streakTagText: {
    color: '#F84B4C', // Replace with your actual theme color key
  },
  section: {
    gap: Spacing.three,
  },
  sectionTitle: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 20,
    letterSpacing: LetterSpacing.headingSm,
    color: SproutlyColors.black,
  },
  plantList: {
    gap: Spacing.two,
  },
  plantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: SproutlyColors.cardBorder,
    backgroundColor: SproutlyColors.white,
  },
  plantImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  plantDetails: {
    flex: 1,
    gap: 2,
  },
  plantName: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 16,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.black,
  },
  plantSpecies: {
    fontFamily: FontFamily.interMedium,
    fontSize: 12,
    fontStyle: 'italic',
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.textMuted,
  },
  plantStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginTop: Spacing.one,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontFamily: FontFamily.interMedium,
    fontSize: 12,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.textMuted,
  },
  healthText: {
    color: SproutlyColors.healthGreen,
  },
  progressCard: {
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: 20,
    backgroundColor: SproutlyColors.surface,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  progressIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: SproutlyColors.plantsTagBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCopy: {
    flex: 1,
    gap: 2,
  },
  progressTitle: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 16,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.black,
  },
  progressSubtitle: {
    fontFamily: FontFamily.interMedium,
    fontSize: 13,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.textMuted,
  },
  xpLabels: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  xpLabel: {
    flex: 1,
    fontFamily: FontFamily.interMedium,
    fontSize: 12,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.textMuted,
  },
  xpValue: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 12,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.primary,
  },
  xpTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: SproutlyColors.progressTrack,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: SproutlyColors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
});
