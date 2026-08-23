import { AppTheme } from '@/theme';
import { StyleSheet } from 'react-native';
import { radius, spacing } from '@/theme';

export default (theme: AppTheme) =>
  StyleSheet.create({
    hero: {
      borderRadius: radius.xl,
      padding: spacing.lg,
      marginBottom: spacing.lg,
    },
    heroHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    heroTexts: {
      flex: 1,
      gap: spacing.xs,
    },
    prayerCard: {
      marginBottom: spacing.md,
      gap: spacing.md,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: spacing.md,
      borderTopWidth: 1,
    },
    quoteCard: {
      borderRadius: radius.lg,
      gap: spacing.sm,
      alignItems: 'flex-start',
    },
    sheetContent: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xl,
      gap: spacing.lg,
    },
    sheetList: {
      gap: spacing.sm,
    },
    sheetRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
  });
