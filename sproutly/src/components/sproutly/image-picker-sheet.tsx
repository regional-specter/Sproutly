import { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  CameraIcon,
  CancelRoundIcon,
  ImageBoxIcon,
} from '@/components/sproutly/figma-icons';
import { FontFamily, LetterSpacing, SproutlyColors } from '@/constants/theme';

type ImagePickerOption = 'camera' | 'gallery' | 'emoji';

type ImagePickerSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (option: ImagePickerOption) => void;
};

type OptionItem =
  | { id: ImagePickerOption; label: string; Icon: typeof CameraIcon }
  | { id: ImagePickerOption; label: string; emoji: string };

const OPTIONS: OptionItem[] = [
  { id: 'camera', label: 'Take photo', Icon: CameraIcon },
  { id: 'gallery', label: 'Use Image', Icon: ImageBoxIcon },
  { id: 'emoji', label: 'Use Emoji', emoji: '🌱' },
];

const ANIMATION_MS = 280;

export function ImagePickerSheet({ visible, onClose, onSelect }: ImagePickerSheetProps) {
  const insets = useSafeAreaInsets();
  const backdropOpacity = useSharedValue(0);
  const sheetTranslateY = useSharedValue(400);

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
    }
  }, [visible, backdropOpacity, sheetTranslateY]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={styles.backdropPressable} onPress={onClose} accessibilityRole="button" />
        </Animated.View>

        <Animated.View
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }, sheetStyle]}>
          <View style={styles.header}>
            <Text style={styles.title}>Choose an icon</Text>
            <Pressable
              onPress={onClose}
              style={styles.closeButton}
              accessibilityLabel="Close"
              accessibilityRole="button">
              <CancelRoundIcon size={28} />
            </Pressable>
          </View>

          <View style={styles.options}>
            {OPTIONS.map((option) => (
              <Pressable
                key={option.id}
                style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
                onPress={() => {
                  onSelect(option.id);
                  onClose();
                }}>
                {'emoji' in option ? (
                  <Text style={styles.optionEmoji}>{option.emoji}</Text>
                ) : (
                  <option.Icon size={24} />
                )}
                <Text style={styles.optionLabel}>{option.label}</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
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
    gap: 16,
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
  options: {
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#F0F0F3',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  optionPressed: {
    opacity: 0.85,
  },
  optionEmoji: {
    fontSize: 22,
    width: 24,
    textAlign: 'center',
  },
  optionLabel: {
    fontFamily: FontFamily.interMedium,
    fontSize: 16,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.black,
  },
});
