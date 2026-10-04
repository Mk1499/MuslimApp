import { StyleSheet } from 'react-native';
import { fontFamily, radius, spacing, type AppTheme } from '@/theme';
import { isRTL, SCREEN_WIDTH } from '@/utils/constants';

export default (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      alignItems: 'center',
      marginBottom: spacing.md,
      marginHorizontal: spacing.md,
      width: 0.25 * SCREEN_WIDTH,
    },
    badge: {
      width: spacing.xxl,
      height: spacing.xxl,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.card.secondary,
    },
    badgeText: {
      textAlign: 'center',
    },
    name: {
      flex: 1,
      textAlign: 'center',
      fontFamily: fontFamily.hafs,
      fontSize: 24,
    },
  });
