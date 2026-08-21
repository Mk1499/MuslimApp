import { Pressable, StyleSheet, type PressableProps, type ViewStyle } from 'react-native';
import React from 'react';
import { useTheme, radius, spacing } from '../../theme';

export type AppTouchableVariant = 'primary' | 'secondary' | 'ghost';

interface AppTouchableProps extends Omit<PressableProps, 'style'> {
  variant?: AppTouchableVariant;
  style?: ViewStyle | (ViewStyle | undefined)[];
}

export function AppTouchable({
  variant = 'primary',
  disabled,
  style,
  ...rest
}: AppTouchableProps): React.JSX.Element {
  const theme = useTheme();

  const backgroundColor = () => {
    if (variant === 'ghost') {
      return 'transparent';
    }
    if (disabled) {
      return theme.button.disabledBg;
    }
    return variant === 'primary' ? theme.button.primaryBg : theme.button.secondaryBg;
  };

  return (
    <Pressable
      {...rest}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: backgroundColor() },
        variant !== 'ghost' && styles.padded,
        (pressed || disabled) && styles.dimmed,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  padded: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md + spacing.xs,
  },
  dimmed: {
    opacity: 0.7,
  },
});

