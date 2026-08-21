import { StyleSheet, TextInput, type TextInputProps, type TextStyle } from 'react-native';
import React, { useState } from 'react';
import { useTheme, radius, spacing, fontFamily, fontSize } from '../../theme';

interface AppTextInputProps extends Omit<TextInputProps, 'style'> {
  style?: TextStyle | (TextStyle | undefined)[];
}

export function AppTextInput({ style, onFocus, onBlur, ...rest }: AppTextInputProps): React.JSX.Element {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <TextInput
      {...rest}
      style={[
        styles.base,
        {
          backgroundColor: theme.input.background,
          borderColor: focused ? theme.input.borderFocused : theme.input.border,
          color: theme.input.text,
        },
        style,
      ]}
      placeholderTextColor={theme.input.placeholder}
      onFocus={event => {
        setFocused(true);
        onFocus?.(event);
      }}
      onBlur={event => {
        setFocused(false);
        onBlur?.(event);
      }}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
  },
});
