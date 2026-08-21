import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, spacing } from '../../theme';

type Edge = 'top' | 'right' | 'bottom' | 'left';

interface ScreenProps {
  children: React.ReactNode;
  /** Applies standard horizontal + bottom padding. */
  padded?: boolean;
  /** Renders content inside a ScrollView instead of a static View. */
  scroll?: boolean;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function Screen({
  children,
  padded = false,
  scroll = false,
  edges = ['top'],
  style,
  contentContainerStyle,
}: ScreenProps): React.JSX.Element {
  const theme = useTheme();

  const paddings = padded ? styles.padded : null;

  return (
    <SafeAreaView edges={edges} style={[styles.safe, { backgroundColor: theme.background.primary }]}>
      {scroll ? (
        <ScrollView
          style={[styles.flex, style]}
          contentContainerStyle={[paddings, styles.scrollContent, contentContainerStyle]}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, paddings, style]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
