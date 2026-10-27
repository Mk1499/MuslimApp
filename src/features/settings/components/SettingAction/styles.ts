import { AppTheme, radius, spacing } from '@/theme';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    actionsCard: { borderRadius: radius.lg, overflow: 'hidden' },
    actionTouchable: { alignSelf: 'stretch' },
    actionRow: {
      minHeight: 78,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      gap: spacing.md,
    },
    actionIcon: {
      width: 42,
      height: 42,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.status.infoSoft,
    },
    actionCopy: { flex: 1 },
    actionTitle: { color: theme.text.primary },
    actionSubtitle: { color: theme.text.muted, marginTop: 3 },
  });
