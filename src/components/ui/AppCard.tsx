import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';
import React from 'react';
import { useTheme, radius, spacing } from '../../theme';

interface AppCardProps extends Omit<ViewProps, 'style'> {
  variant?: 'primary' | 'secondary';
  padded?: boolean;
  style?: ViewStyle | (ViewStyle | undefined)[];
}

export function AppCard({
  variant = 'primary',
  padded = true,
  style,
  ...rest
}: AppCardProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <View
      {...rest}
      style={[
        styles.base,
        {
          backgroundColor: theme.card[variant],
          borderColor: theme.card.border,
        },
        !padded && styles.noPadding,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.lg,
  },
  noPadding: {
    padding: 0,
  },
});
