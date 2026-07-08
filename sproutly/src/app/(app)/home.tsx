import { router, useFocusEffect, type Href } from 'expo-router';
import { Image } from 'expo-image';
import { SymbolView } from '@/components/sproutly/symbol-view';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreenLayout } from '@/components/sproutly/app-screen-layout';
import { AddPlantSheet } from '@/components/sproutly/add-plant-sheet';
import {
  FireAltIcon,
  HeartbeatIcon,
  LeafIcon,
  NotesMedicalIcon,
} from '@/components/sproutly/figma-icons';
import { LevelProgressRing } from '@/components/sproutly/level-progress-ring';
import { NotificationsSheet } from '@/components/sproutly/notifications-sheet';
import { PrimaryButton } from '@/components/sproutly/primary-button';
import { useAuth } from '@/contexts/auth-context';
import {
  fetchHomeScreenData,
  formatPlantCount,
  formatStreakLabel,
  getFirstName,
  getPlantSpeciesLabel,
  type HomeScreenData,
} from '@/lib/home';
import type { HomePlant } from '@/types/database';
import { FontFamily, LetterSpacing, Spacing, SproutlyColors } from '@/constants/theme';

function PlantImage({ plant }: { plant: HomePlant }) {
  if (plant.cover_image_url) {
    return (
      <Image source={{ uri: plant.cover_image_url }} style={styles.plantImage} contentFit="cover" />
    );
  }

  return (
    <View style={styles.plantImagePlaceholder}>
      <LeafIcon size={20} />
    </View>
  );
}

function PlantCard({ plant }: { plant: HomePlant }) {
  const species = getPlantSpeciesLabel(plant);
  const checkupLabel = plant.checkup_count === 1 ? '1 check-up' : `${plant.checkup_count} check-ups`;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(`/plant/${plant.id}` as Href)}
      style={({ pressed }) => [styles.plantCard, pressed && styles.pressed]}>
      <PlantImage plant={plant} />

      <View style={styles.plantDetails}>
        <Text style={styles.plantName}>{plant.nickname}</Text>
        {species ? <Text style={styles.plantSpecies}>{species}</Text> : null}

        <View style={styles.plantStats}>
          <View style={styles.statItem}>
            <NotesMedicalIcon size={11} />
            <Text style={styles.statText}>{checkupLabel}</Text>
          </View>

          {plant.current_health_score != null ? (
            <View style={styles.statItem}>
              <HeartbeatIcon size={13} />
              <Text style={[styles.statText, styles.healthText]}>{plant.current_health_score}%</Text>
            </View>
          ) : null}
        </View>
      </View>

      <SymbolView
        name="chevron.right"
        size={14}
        tintColor={SproutlyColors.textMuted}
      />
    </Pressable>
  );
}

export default function HomeScreen() {
  const { profile, user, refreshProfile } = useAuth();
  const [homeData, setHomeData] = useState<HomeScreenData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addPlantVisible, setAddPlantVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  const firstName = getFirstName(profile?.full_name, profile?.email);

  const loadHomeData = useCallback(async () => {
    if (!user?.id) {
      setHomeData(null);
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const data = await fetchHomeScreenData(user.id);
      setHomeData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load home data');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      loadHomeData();
    }, [loadHomeData]),
  );

  const xpProgress =
    homeData && homeData.rank.xp_target > 0
      ? Math.min(homeData.rank.xp_current / homeData.rank.xp_target, 1)
      : 0;

  const handlePlantCreated = useCallback(async () => {
    await refreshProfile();
    await loadHomeData();
  }, [loadHomeData, refreshProfile]);

  return (
    <AppScreenLayout
      onNotificationPress={() => setNotificationsVisible(true)}
      onProfilePress={() => router.push('/(app)/settings' as Href)}>
      {isLoading ? (
        <View style={styles.centeredState}>
          <ActivityIndicator color={SproutlyColors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centeredState}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : homeData ? (
        <>
          <View style={styles.welcomeCard}>
            <LevelProgressRing level={homeData.level} progress={homeData.levelProgress} />

            <View style={styles.welcomeContent}>
              <Text style={styles.welcomeTitle}>Welcome Back, {firstName},</Text>
              <Text style={styles.welcomeSubtitle}>Snap a photo to update your garden</Text>

              <View style={styles.tagRow}>
                <View style={[styles.tag, styles.plantsTag]}>
                  <LeafIcon size={10} />
                  <Text style={[styles.tagText, styles.plantsTagText]}>
                    {formatPlantCount(homeData.plantCount)}
                  </Text>
                </View>

                <View style={[styles.tag, styles.streakTag]}>
                  <FireAltIcon size={10} />
                  <Text style={[styles.tagText, styles.streakTagText]}>
                    {formatStreakLabel(homeData.streakDays)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>All Plants</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Add plant"
                onPress={() => setAddPlantVisible(true)}
                style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
                <SymbolView
                  name="plus"
                  size={18}
                  tintColor={SproutlyColors.white}
                  weight="semibold"
                />
              </Pressable>
            </View>

            {homeData.plants.length > 0 ? (
              <View style={styles.plantList}>
                {homeData.plants.map((plant) => (
                  <PlantCard key={plant.id} plant={plant} />
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  No plants yet. Add your first one to start your garden!
                </Text>
                <PrimaryButton
                  label="Add plant"
                  variant="primary"
                  onPress={() => setAddPlantVisible(true)}
                  style={styles.emptyButton}
                />
              </View>
            )}
          </View>

          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <View style={styles.progressIconWrap}>
                <SymbolView
                  name="bolt.fill"
                  size={20}
                  tintColor={SproutlyColors.primary}
                />
              </View>

              <View style={styles.progressCopy}>
                <Text style={styles.progressTitle}>{homeData.rank.current_rank_title}</Text>
                <Text style={styles.progressSubtitle}>{homeData.rank.current_rank_subtitle}</Text>
              </View>
            </View>

            {homeData.rank.next_rank_title ? (
              <>
                <View style={styles.xpLabels}>
                  <Text style={styles.xpLabel}>Progress to {homeData.rank.next_rank_title}</Text>
                  <Text style={styles.xpValue}>
                    {homeData.rank.xp_current.toLocaleString()}/
                    {homeData.rank.xp_target.toLocaleString()} XP
                  </Text>
                </View>

                <View style={styles.xpTrack}>
                  <View style={[styles.xpFill, { width: `${xpProgress * 100}%` }]} />
                </View>
              </>
            ) : (
              <Text style={styles.maxRankText}>You&apos;ve reached the highest rank!</Text>
            )}
          </View>
        </>
      ) : null}

      {user?.id ? (
        <>
          <AddPlantSheet
            visible={addPlantVisible}
            userId={user.id}
            onClose={() => setAddPlantVisible(false)}
            onPlantCreated={handlePlantCreated}
          />
          <NotificationsSheet
            visible={notificationsVisible}
            userId={user.id}
            onClose={() => setNotificationsVisible(false)}
          />
        </>
      ) : null}
    </AppScreenLayout>
  );
}

const styles = StyleSheet.create({
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six,
  },
  errorText: {
    fontFamily: FontFamily.interMedium,
    fontSize: 14,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.textMuted,
    textAlign: 'center',
  },
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
    borderRadius: 7,
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
  plantsTagText: {
    color: '#4CA04F',
  },
  streakTagText: {
    color: '#F84B4C',
  },
  section: {
    gap: Spacing.three,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: SproutlyColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 20,
    letterSpacing: LetterSpacing.headingSm,
    color: SproutlyColors.black,
  },
  emptyText: {
    fontFamily: FontFamily.interMedium,
    fontSize: 14,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.textMuted,
    textAlign: 'center',
  },
  emptyState: {
    gap: Spacing.three,
    alignItems: 'center',
  },
  emptyButton: {
    maxWidth: 220,
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
  plantImagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: SproutlyColors.plantsTagBg,
    alignItems: 'center',
    justifyContent: 'center',
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
  maxRankText: {
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
