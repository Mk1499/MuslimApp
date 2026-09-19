import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { AppIcon } from './AppIcon';
import { AppText } from './AppText';
import { AppTouchable } from './AppTouchable';
import { useTheme, spacing } from '../../theme';
import { useAppStore } from '@/store/useAppStore';

interface HeaderProps {
  /** Shows a back button that pops the current screen. */
  showBackButton?: boolean;
  /** Title rendered in the center of the header. */
  title?: string;
}

export function Header({
  showBackButton = false,
  title,
}: HeaderProps): React.JSX.Element {
  const navigation = useNavigation();
  const theme = useTheme();
  const { isRTL } = useAppStore();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.background.primary }]}
    >
      <AppText variant="subtitle" style={styles.title} numberOfLines={1}>
        {title}
      </AppText>
      {showBackButton && (
        <AppTouchable
          variant="ghost"
          onPress={() => navigation.goBack()}
          hitSlop={spacing.md}
          style={[styles.backButton]}
        >
          <AppIcon
            name={isRTL ? 'chevron-forward' : 'chevron-back'}
            color="text.primary"
            size={30}
          />
        </AppTouchable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: spacing.md,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    start: spacing.md,
  },
  backButtonLTR: {
    left: spacing.md,
  },
  backButtonRTL: {
    right: spacing.md,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: spacing.xxl,
  },
});
