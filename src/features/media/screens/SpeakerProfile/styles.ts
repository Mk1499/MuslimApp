import { AppTheme, fontFamily, spacing } from '@/theme';
import { SCREEN_HEIGHT } from '@/utils/constants';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    profileHeader: {
      position: 'relative',
      paddingBottom: spacing.md,
      backgroundColor: theme.background.primary,
    },
    topSafeAreaStyle: {
      backgroundColor: theme.background.brand,
    },
    backBtn: {
      position: 'absolute',
      top: 16,
      left: 16,
      zIndex: 11,
    },
    bgCover: {
      backgroundColor: theme.background.brand,
      height: 0.15 * SCREEN_HEIGHT,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      position: 'absolute',
      top: 0,
      width: '100%',
    },
    dataCont: {
      alignItems: 'center',
    },
    image: {
      width: 0.2 * SCREEN_HEIGHT,
      height: 0.2 * SCREEN_HEIGHT,
      borderRadius: 0.1 * SCREEN_HEIGHT,
      borderWidth: 3,
      borderColor: theme.accent.tertiary,
    },
    name: {
      color: theme.text.brand,
      marginTop: spacing.sm,
      textAlign: 'center',
    },
    views: {
      color: theme.text.muted,
      marginTop: spacing.xs,
    },
    bio: {
      color: theme.text.secondary,
      textAlign: 'center',
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
      lineHeight: 20,
    },
    stickyHeader: {
      backgroundColor: theme.background.primary,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.card.border,
      zIndex: 20,
      elevation: 2,
      marginBottom: spacing.md,
    },
    segmentCont: {
      paddingHorizontal: spacing.sm,
      flexDirection: 'row',
      gap: spacing.lg,
    },
    tabButton: {
      minHeight: 48,
      minWidth: 104,
      paddingHorizontal: spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    tabText: {
      color: theme.text.primary,
      fontFamily: fontFamily.regular,
    },
    selectedTabText: {
      color: theme.text.brand,
      fontFamily: fontFamily.bold,
    },
    tabIndicator: {
      position: 'absolute',
      bottom: 0,
      left: spacing.sm,
      right: spacing.sm,
      height: 3,
      borderTopLeftRadius: 3,
      borderTopRightRadius: 3,
      backgroundColor: theme.text.brand,
    },
  });
