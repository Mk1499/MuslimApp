import { AppTheme, fontSize, radius, spacing } from '@/theme';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    /* ---------- date hero ---------- */
    hero: {
      borderRadius: radius.lg,
      paddingTop: spacing.lg,
      marginBottom: spacing.lg,
      overflow: 'hidden',
      gap: spacing.md,
    },
    dateBlock: {
      alignItems: 'center',
      gap: spacing.xxs,
    },
    hijriDate: {
      color: theme.basic.white,
      fontSize: fontSize.xl,
      textAlign: 'center',
    },
    gregorianDate: {
      color: theme.basic.white,
      opacity: 0.85,
      fontSize: fontSize.md,
      textAlign: 'center',
    },
    locationPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      alignSelf: 'center',
      marginTop: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radius.full,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    locationText: {
      color: theme.basic.white,
      fontSize: fontSize.sm,
    },

    /* ---------- next prayer ---------- */
    nextBlock: {
      alignItems: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      borderRadius: radius.md,
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
    },
    nextLabel: {
      color: theme.basic.white,
      opacity: 0.85,
      fontSize: fontSize.xs,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    nextRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    nextName: {
      color: theme.basic.white,
      fontSize: fontSize.xl,
    },
    nextTime: {
      color: theme.basic.white,
      fontSize: fontSize.xl,
    },
    countdownRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginTop: spacing.xxs,
      marginBottom: spacing.lg,
    },

    /* ---------- prayer list ---------- */
    listCard: {
      paddingVertical: spacing.xs,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    rowDivider: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.divider,
    },
    rowActive: {
      backgroundColor: theme.button.secondaryBg,
    },
    rowName: {
      flex: 1,
    },
    rowTime: {
      fontSize: fontSize.lg,
    },

    /* ---------- states ---------- */
    stateBox: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.md,
      paddingVertical: spacing.xxxl,
    },
    retryBtn: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.sm,
    },
  });
