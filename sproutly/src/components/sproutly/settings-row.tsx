import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { FontFamily, LetterSpacing, Spacing, SproutlyColors } from '@/constants/theme';

type SettingsRowProps = {
  label: string;
  icon: SymbolViewProps['name'];
  value?: string;
  onPress?: () => void;
  showDivider?: boolean;
  disabled?: boolean;
  destructive?: boolean;
  style?: ViewStyle;
};

export function SettingsRow({
  label,
  icon,
  value,
  onPress,
  showDivider = true,
  disabled = false,
  destructive = false,
  style,
}: SettingsRowProps) {
  return (
    <View style={style}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled || !onPress}
        onPress={onPress}
        style={({ pressed }) => [
          styles.row,
          pressed && !disabled && onPress && styles.pressed,
          disabled && styles.disabled,
        ]}>
        <View style={styles.iconWrap}>
          <SymbolView
            name={icon}
            size={20}
            tintColor={destructive ? '#E5484D' : SproutlyColors.primary}
            weight="medium"
          />
        </View>

        <Text style={[styles.label, destructive && styles.destructiveLabel]}>{label}</Text>

        <View style={styles.trailing}>
          {value ? <Text style={styles.value}>{value}</Text> : null}
          <SymbolView
            name="chevron.right"
            size={13}
            tintColor={SproutlyColors.textMuted}
            weight="semibold"
          />
        </View>
      </Pressable>

      {showDivider ? <View style={styles.divider} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap: Spacing.three,
  },
  iconWrap: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontFamily: FontFamily.interMedium,
    fontSize: 15,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.black,
  },
  destructiveLabel: {
    color: '#E5484D',
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  value: {
    fontFamily: FontFamily.interMedium,
    fontSize: 14,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.textMuted,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: SproutlyColors.cardBorder,
    marginLeft: Spacing.three + 24 + Spacing.three,
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.55,
  },
});
