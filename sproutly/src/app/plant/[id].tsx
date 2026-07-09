import { useFocusEffect } from 'expo-router';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from '@/components/sproutly/symbol-view';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HealthTrendChart } from '@/components/sproutly/health-trend-chart';
import {
  CameraIcon,
  HeartbeatIcon,
  LeafIcon,
  NotesMedicalIcon,
} from '@/components/sproutly/figma-icons';
import { SegmentedControl } from '@/components/sproutly/segmented-control';
import { PrimaryButton } from '@/components/sproutly/primary-button';
import { SproutlyTextInput } from '@/components/sproutly/sproutly-text-input';
import { useAuth } from '@/contexts/auth-context';
import { syncCareNotifications } from '@/lib/notifications';
import {
  fetchPlantDetail,
  formatAddedLabel,
  getCareEntries,
  getHealthTrend,
  getPlantSpeciesLabel,
  type PlantDetailData,
} from '@/lib/plant-detail';
import { deletePlant, renamePlant } from '@/lib/plants';
import { launchPlantCamera, performPlantHealthScan } from '@/lib/scans';
import { FontFamily, LetterSpacing, Spacing, SproutlyColors } from '@/constants/theme';

type DetailTab = 'care' | 'timeline';

function StatusBadge({ status }: { status: string | null }) {
  if (!status) return null;

  return (
    <View style={styles.statusBadge}>
      <SymbolView name="heart.fill" size={12} tintColor={SproutlyColors.healthGreen} />
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
}

function StatColumn({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.statColumn}>
      {icon}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, refreshProfile } = useAuth();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();

  const [detail, setDetail] = useState<PlantDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isRenameVisible, setIsRenameVisible] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>('care');

  const loadDetail = useCallback(async () => {
    if (!user?.id || !id) {
      setDetail(null);
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const data = await fetchPlantDetail(id, user.id);
      setDetail(data);
      if (!data) {
        setError('Plant not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load plant');
    } finally {
      setIsLoading(false);
    }
  }, [id, user?.id]);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      loadDetail();
    }, [loadDetail]),
  );

  const handleRenameOpen = () => {
    if (!detail?.plant || isScanning || isDeleting || isRenaming) return;
    setRenameValue(detail.plant.nickname);
    setIsRenameVisible(true);
  };

  const handleRenameClose = () => {
    if (isRenaming) return;
    setIsRenameVisible(false);
  };

  const handleRenameSave = async () => {
    if (!user?.id || !detail?.plant || isRenaming) return;

    const trimmedNickname = renameValue.trim();
    if (!trimmedNickname) {
      Alert.alert('Name your plant', 'Enter a nickname to rename this plant.');
      return;
    }

    if (trimmedNickname === detail.plant.nickname) {
      setIsRenameVisible(false);
      return;
    }

    setIsRenaming(true);
    try {
      const updatedPlant = await renamePlant(detail.plant.id, user.id, trimmedNickname);
      setDetail((current) =>
        current ? { ...current, plant: { ...current.plant, nickname: updatedPlant.nickname } } : current,
      );
      setIsRenameVisible(false);
      void syncCareNotifications(user.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to rename plant. Please try again.';
      Alert.alert('Rename failed', message);
    } finally {
      setIsRenaming(false);
    }
  };

  const handleDelete = () => {
    if (!user?.id || !detail?.plant || isDeleting) return;

    Alert.alert(
      'Delete plant?',
      `Are you sure you want to delete "${detail.plant.nickname}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            void (async () => {
              setIsDeleting(true);
              try {
                await deletePlant(detail.plant.id, user.id);
                await refreshProfile();
                void syncCareNotifications(user.id);
                router.back();
              } catch (err) {
                const message =
                  err instanceof Error ? err.message : 'Failed to delete plant. Please try again.';
                Alert.alert('Delete failed', message);
              } finally {
                setIsDeleting(false);
              }
            })();
          },
        },
      ],
    );
  };

  const handleScan = async () => {
    if (!user?.id || !detail?.plant || isScanning) return;

    const imageUri = await launchPlantCamera();
    if (!imageUri) return;

    setIsScanning(true);
    try {
      const result = await performPlantHealthScan({
        userId: user.id,
        plant: detail.plant,
        localImageUri: imageUri,
      });

      await refreshProfile();
      await loadDetail();
      setActiveTab('timeline');

      Alert.alert(
        'Scan complete',
        `Health score: ${result.analysis.health_score}%\n${result.analysis.health_status}`,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Scan failed. Please try again.';
      Alert.alert('Scan failed', message);
    } finally {
      setIsScanning(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator color={SproutlyColors.primary} />
      </View>
    );
  }

  if (error || !detail) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>{error ?? 'Plant not found'}</Text>
        <Pressable onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const { plant, checkupCount, scans, care } = detail;
  const species = getPlantSpeciesLabel(plant);
  const careEntries = getCareEntries(care);
  const trend = getHealthTrend(scans);
  const chartWidth = windowWidth - Spacing.four * 2;
  const healthScoreLabel =
    plant.current_health_score != null ? `${plant.current_health_score}%` : '—';
  const checkupLabel = String(checkupCount);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.heroWrap}>
          {plant.cover_image_url ? (
            <Image source={{ uri: plant.cover_image_url }} style={styles.heroImage} contentFit="cover" />
          ) : (
            <View style={styles.heroPlaceholder}>
              <LeafIcon size={48} />
            </View>
          )}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={[styles.backButton, { top: insets.top + Spacing.two }]}>
            <SymbolView name="chevron.left" size={18} tintColor={SproutlyColors.white} weight="semibold" />
          </Pressable>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.titleRow}>
            <View style={styles.titleCopy}>
              <Text style={styles.plantName}>{plant.nickname}</Text>
              {species ? <Text style={styles.species}>{species}</Text> : null}
            </View>

            <View style={styles.titleActions}>
              <Pressable
                accessibilityRole="button"
                onPress={handleScan}
                disabled={isScanning || isDeleting || isRenaming}
                style={({ pressed }) => [
                  styles.scanButton,
                  pressed && !isScanning && !isDeleting && !isRenaming && styles.pressed,
                  (isScanning || isDeleting || isRenaming) && styles.scanButtonDisabled,
                ]}>
                {isScanning ? (
                  <ActivityIndicator size="small" color="#2563EB" />
                ) : (
                  <CameraIcon size={16} color="#2563EB" />
                )}
                <Text style={styles.scanButtonText}>
                  {isScanning ? 'Scanning…' : 'Take a new Scan'}
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Rename plant"
                onPress={handleRenameOpen}
                disabled={isScanning || isDeleting || isRenaming}
                style={({ pressed }) => [
                  styles.renameButton,
                  pressed && !isScanning && !isDeleting && !isRenaming && styles.pressed,
                  (isScanning || isDeleting || isRenaming) && styles.renameButtonDisabled,
                ]}>
                <SymbolView name="pencil" size={14} tintColor={SproutlyColors.primary} />
                <Text style={styles.renameButtonText}>Rename Plant</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Delete plant"
                onPress={handleDelete}
                disabled={isScanning || isDeleting || isRenaming}
                style={({ pressed }) => [
                  styles.deleteButton,
                  pressed && !isScanning && !isDeleting && !isRenaming && styles.pressed,
                  (isScanning || isDeleting || isRenaming) && styles.deleteButtonDisabled,
                ]}>
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#DC2626" />
                ) : (
                  <SymbolView name="trash" size={14} tintColor="#DC2626" />
                )}
                <Text style={styles.deleteButtonText}>
                  {isDeleting ? 'Deleting…' : 'Delete Plant'}
                </Text>
              </Pressable>
            </View>
          </View>

          <StatusBadge status={plant.current_health_status} />

          <View style={styles.statsRow}>
            <StatColumn
              icon={<NotesMedicalIcon size={16} color={SproutlyColors.healthGreen} />}
              value={checkupLabel}
              label="Check-ups"
            />
            <StatColumn
              icon={
                <SymbolView
                  name="calendar.badge.plus"
                  size={18}
                  tintColor={SproutlyColors.healthGreen}
                />
              }
              value={formatAddedLabel(plant.created_at)}
              label="Added"
            />
            <StatColumn
              icon={<HeartbeatIcon size={18} color={SproutlyColors.healthGreen} />}
              value={healthScoreLabel}
              label="Health Score"
            />
          </View>
        </View>

        <View style={styles.content}>
          <SegmentedControl
            options={[
              { value: 'care', label: 'Care' },
              { value: 'timeline', label: 'Health Timeline' },
            ]}
            value={activeTab}
            onChange={setActiveTab}
          />

          {activeTab === 'care' ? (
            <View style={styles.careSection}>
              {careEntries.length > 0 ? (
                careEntries.map((entry) => (
                  <Text key={entry.label} style={styles.careItem}>
                    <Text style={styles.careLabel}>{entry.label}: </Text>
                    {entry.value}
                  </Text>
                ))
              ) : (
                <View style={styles.emptyCare}>
                  <Text style={styles.emptyCareTitle}>No care plan yet</Text>
                  <Text style={styles.emptyCareText}>
                    Take a scan to generate personalized care instructions for this plant.
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.timelineSection}>
              <View style={styles.trendHeader}>
                <View>
                  <Text style={styles.trendTitle}>Health Trend</Text>
                  <Text style={styles.trendSubtitle}>
                    {trend.latestScore != null
                      ? `Latest scan ${trend.latestScore}%`
                      : 'No scans yet'}
                  </Text>
                </View>

                {trend.changePercent != null && trend.changePercent !== 0 ? (
                  <View
                    style={[
                      styles.trendBadge,
                      trend.changePercent > 0 ? styles.trendBadgeUp : styles.trendBadgeDown,
                    ]}>
                    <Text
                      style={[
                        styles.trendBadgeText,
                        trend.changePercent > 0 ? styles.trendBadgeTextUp : styles.trendBadgeTextDown,
                      ]}>
                      {trend.changePercent > 0 ? '+' : ''}
                      {trend.changePercent}%
                    </Text>
                  </View>
                ) : null}
              </View>

              {scans.some((scan) => scan.health_score != null) ? (
                <HealthTrendChart scans={scans} width={chartWidth} />
              ) : (
                <View style={styles.emptyTimeline}>
                  <Text style={styles.emptyCareTitle}>No health history</Text>
                  <Text style={styles.emptyCareText}>
                    Your scan results will appear here as a health trend over time.
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {isScanning ? (
        <View style={styles.scanOverlay}>
          <ActivityIndicator size="large" color={SproutlyColors.white} />
          <Text style={styles.scanOverlayText}>Analyzing your plant…</Text>
        </View>
      ) : null}

      <Modal
        visible={isRenameVisible}
        transparent
        animationType="fade"
        onRequestClose={handleRenameClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.renameOverlay}>
          <Pressable style={styles.renameBackdrop} onPress={handleRenameClose} />
          <View style={styles.renameCard}>
            <Text style={styles.renameTitle}>Rename plant</Text>
            <Text style={styles.renameSubtitle}>Choose a new nickname for this plant.</Text>
            <SproutlyTextInput
              value={renameValue}
              onChangeText={setRenameValue}
              placeholder="Plant nickname"
              autoFocus
              editable={!isRenaming}
              returnKeyType="done"
              onSubmitEditing={() => void handleRenameSave()}
            />
            <View style={styles.renameActions}>
              <Pressable
                accessibilityRole="button"
                onPress={handleRenameClose}
                disabled={isRenaming}
                style={({ pressed }) => [styles.renameCancel, pressed && !isRenaming && styles.pressed]}>
                <Text style={styles.renameCancelText}>Cancel</Text>
              </Pressable>
              <PrimaryButton
                label={isRenaming ? 'Saving…' : 'Save'}
                variant="primary"
                onPress={() => void handleRenameSave()}
                disabled={isRenaming}
                style={styles.renameSaveButton}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SproutlyColors.white,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    backgroundColor: SproutlyColors.white,
    paddingHorizontal: Spacing.four,
  },
  errorText: {
    fontFamily: FontFamily.interMedium,
    fontSize: 15,
    color: SproutlyColors.textMuted,
    textAlign: 'center',
  },
  backLink: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  backLinkText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 15,
    color: SproutlyColors.primary,
  },
  heroWrap: {
    height: 260,
    backgroundColor: SproutlyColors.surface,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SproutlyColors.plantsTagBg,
  },
  backButton: {
    position: 'absolute',
    left: Spacing.three,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCard: {
    marginTop: -24,
    marginHorizontal: Spacing.four,
    padding: Spacing.three,
    borderRadius: 20,
    backgroundColor: SproutlyColors.white,
    gap: Spacing.three,
    shadowColor: SproutlyColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  titleCopy: {
    flex: 1,
    gap: 4,
  },
  plantName: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 22,
    letterSpacing: LetterSpacing.headingSm,
    color: SproutlyColors.black,
  },
  species: {
    fontFamily: FontFamily.interMediumItalic,
    fontSize: 14,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.textMuted,
  },
  titleActions: {
    alignItems: 'flex-end',
    gap: 8,
    maxWidth: 150,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignSelf: 'stretch',
  },
  renameButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#E8F3E9',
    alignSelf: 'stretch',
  },
  renameButtonDisabled: {
    opacity: 0.7,
  },
  renameButtonText: {
    flexShrink: 1,
    fontFamily: FontFamily.interSemiBold,
    fontSize: 12,
    color: SproutlyColors.primary,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    alignSelf: 'stretch',
  },
  deleteButtonDisabled: {
    opacity: 0.7,
  },
  deleteButtonText: {
    flexShrink: 1,
    fontFamily: FontFamily.interSemiBold,
    fontSize: 12,
    color: '#DC2626',
  },
  scanButtonDisabled: {
    opacity: 0.7,
  },
  scanButtonText: {
    flexShrink: 1,
    fontFamily: FontFamily.interSemiBold,
    fontSize: 12,
    color: '#2563EB',
  },
  pressed: {
    opacity: 0.85,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#E8F8EF',
  },
  statusText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 13,
    color: SproutlyColors.healthGreen,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
    paddingTop: Spacing.one,
  },
  statColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 14,
    color: SproutlyColors.black,
    textAlign: 'center',
  },
  statLabel: {
    fontFamily: FontFamily.interMedium,
    fontSize: 11,
    color: SproutlyColors.textMuted,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.four,
  },
  careSection: {
    gap: Spacing.three,
  },
  careItem: {
    fontFamily: FontFamily.interMedium,
    fontSize: 15,
    lineHeight: 24,
    color: SproutlyColors.black,
  },
  careLabel: {
    fontFamily: FontFamily.interSemiBold,
  },
  emptyCare: {
    gap: Spacing.two,
    paddingVertical: Spacing.three,
  },
  emptyCareTitle: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 16,
    color: SproutlyColors.black,
  },
  emptyCareText: {
    fontFamily: FontFamily.interMedium,
    fontSize: 14,
    lineHeight: 22,
    color: SproutlyColors.textMuted,
  },
  timelineSection: {
    gap: Spacing.three,
  },
  trendHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  trendTitle: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 18,
    color: SproutlyColors.black,
  },
  trendSubtitle: {
    fontFamily: FontFamily.interMedium,
    fontSize: 13,
    color: SproutlyColors.textMuted,
    marginTop: 2,
  },
  trendBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  trendBadgeUp: {
    backgroundColor: '#E8F8EF',
  },
  trendBadgeDown: {
    backgroundColor: '#FEE2E2',
  },
  trendBadgeText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 12,
  },
  trendBadgeTextUp: {
    color: SproutlyColors.healthGreen,
  },
  trendBadgeTextDown: {
    color: '#DC2626',
  },
  emptyTimeline: {
    gap: Spacing.two,
    paddingVertical: Spacing.three,
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  scanOverlayText: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 16,
    color: SproutlyColors.white,
  },
  renameOverlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  renameBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  renameCard: {
    borderRadius: 20,
    backgroundColor: SproutlyColors.white,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  renameTitle: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 18,
    color: SproutlyColors.black,
  },
  renameSubtitle: {
    fontFamily: FontFamily.interMedium,
    fontSize: 14,
    color: SproutlyColors.textMuted,
  },
  renameActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  renameCancel: {
    flex: 1,
    height: 52,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SproutlyColors.surface,
  },
  renameCancelText: {
    fontFamily: FontFamily.interMedium,
    fontSize: 16,
    color: SproutlyColors.black,
  },
  renameSaveButton: {
    flex: 1,
    maxWidth: undefined,
  },
});
