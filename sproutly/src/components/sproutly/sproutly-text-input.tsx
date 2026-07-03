import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { FontFamily, LetterSpacing, SproutlyColors } from '@/constants/theme';

export function SproutlyTextInput({ style, placeholderTextColor, ...props }: TextInputProps) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor={placeholderTextColor ?? SproutlyColors.textMuted}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 52,
    borderRadius: 999,
    backgroundColor: '#F0F0F3',
    paddingHorizontal: 20,
    fontFamily: FontFamily.interMedium,
    fontSize: 16,
    letterSpacing: LetterSpacing.body,
    color: SproutlyColors.black,
  },
});
