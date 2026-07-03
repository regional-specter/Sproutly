import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { FontFamily, LetterSpacing, SproutlyColors } from '@/constants/theme';

type SproutlyLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showText?: boolean;
  style?: ViewStyle;
};

const ICON_SIZES = {
  sm: 28,
  md: 36,
  lg: 44,
} as const;

const TEXT_SIZES = {
  sm: 20,
  md: 26,
  lg: 32,
} as const;

function LogoIcon({ size, color }: { size: number; color: string }) {
  const scale = size / 44;
  return (
    <Svg width={size} height={size * 1.04} viewBox="0 0 217 225" fill="none">
      <Path
        d="M195.409 26.8291C168.909 61.8291 138.909 76.3291 120.909 103.329C90.9084 148.329 103.409 183.329 103.409 218.329C167.409 214.329 245.909 186.829 195.409 26.8291ZM103.409 218.329C107.408 186.329 144.408 150.329 158.908 134.329C174.408 113.329 192.908 105.829 195.409 26.8291M5.6665 108.967C26.8193 127.594 47.0891 132.669 61.9293 147.377C86.6632 171.891 84.2236 195.936 89.3459 218.243C50.0453 224.584 -1.46589 217.96 5.6665 108.967ZM89.3459 218.243C82.2434 198.403 54.5925 180.597 43.4795 172.414C31.0298 161.182 18.7411 158.971 5.6665 108.967M84.908 6.8291C57.908 28.6624 18.408 84.8291 76.408 134.829C99.9079 114.496 134.508 60.4291 84.908 6.8291ZM84.908 6.8291C76.0745 26.6624 60.5082 77.5291 74.9085 132.329"
        stroke={color}
        strokeWidth={10 * scale}
      />
    </Svg>
  );
}

export function SproutlyLogo({
  size = 'md',
  color = SproutlyColors.white,
  showText = true,
  style,
}: SproutlyLogoProps) {
  const iconSize = ICON_SIZES[size];
  const textSize = TEXT_SIZES[size];

  return (
    <View style={[styles.container, style]}>
      <LogoIcon size={iconSize} color={color} />
      {showText ? (
        <Text
          style={[
            styles.text,
            {
              color,
              fontSize: textSize,
              lineHeight: textSize * 1.1,
            },
          ]}>
          Sproutly
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    fontFamily: FontFamily.interSemiBold,
    letterSpacing: LetterSpacing.headingSm,
  },
});
