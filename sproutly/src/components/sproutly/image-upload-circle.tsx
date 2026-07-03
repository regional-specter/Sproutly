import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

import { SproutlyColors } from '@/constants/theme';

const CIRCLE_SIZE = 220;
const STROKE_WIDTH = 11;
const DASH_COUNT = 8;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SEGMENT = CIRCUMFERENCE / (DASH_COUNT * 2);
const PLUS_STROKE = 10;
const PLUS_ARM = 44;
const PLUS_VIEW = PLUS_ARM + PLUS_STROKE;
const PLUS_CENTER = PLUS_VIEW / 2;
const PLUS_HALF_ARM = PLUS_ARM / 2;

type ImageUploadCircleProps = {
  imageUri?: string | null;
  onPress: () => void;
};

function DashedBorder() {
  return (
    <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} style={styles.borderSvg}>
      <Circle
        cx={CIRCLE_SIZE / 2}
        cy={CIRCLE_SIZE / 2}
        r={RADIUS}
        stroke="#D1D5DB"
        strokeWidth={STROKE_WIDTH}
        fill="none"
        strokeDasharray={`${SEGMENT} ${SEGMENT}`}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function PlusIcon() {
  return (
    <Svg width={PLUS_VIEW} height={PLUS_VIEW}>
      <Line
        x1={PLUS_CENTER - PLUS_HALF_ARM}
        y1={PLUS_CENTER}
        x2={PLUS_CENTER + PLUS_HALF_ARM}
        y2={PLUS_CENTER}
        stroke="#D1D5DB"
        strokeWidth={PLUS_STROKE}
        strokeLinecap="round"
      />
      <Line
        x1={PLUS_CENTER}
        y1={PLUS_CENTER - PLUS_HALF_ARM}
        x2={PLUS_CENTER}
        y2={PLUS_CENTER + PLUS_HALF_ARM}
        stroke="#D1D5DB"
        strokeWidth={PLUS_STROKE}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function ImageUploadCircle({ imageUri, onPress }: ImageUploadCircleProps) {
  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      <View style={styles.circle}>
        <DashedBorder />
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} contentFit="cover" />
        ) : (
          <PlusIcon />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    alignSelf: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: SproutlyColors.white,
  },
  borderSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  image: {
    width: CIRCLE_SIZE - STROKE_WIDTH * 2,
    height: CIRCLE_SIZE - STROKE_WIDTH * 2,
    borderRadius: (CIRCLE_SIZE - STROKE_WIDTH * 2) / 2,
  },
});
