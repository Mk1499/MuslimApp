import { AppTheme, radius, spacing } from '@/theme';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    listContent: { paddingBottom: spacing.xl, gap: spacing.md },
    dayCard: { borderRadius: radius.lg },
    dayHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: spacing.sm,
    },
    dateCopy: { flex: 1 },
    dateTitle: { color: theme.text.primary, textAlign: 'left' },
    todayLabel: { color: theme.text.brand, marginTop: 2, textAlign: 'left' },
    scoreBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radius.md,
      backgroundColor: theme.status.infoSoft,
    },
    scoreText: { color: theme.text.brand },
    prayerList: { marginTop: spacing.md },
    prayerRow: {
      minHeight: 36,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.divider,
    },
    prayerName: { color: theme.text.secondary },
    prayerResult: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    resultEmoji: { fontSize: 16, minWidth: 20, textAlign: 'center' },
    resultLabel: { color: theme.text.secondary },
    resultScore: {
      color: theme.text.primary,
      minWidth: 22,
      textAlign: 'right',
    },
  });
