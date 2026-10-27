import { AppTheme, radius, spacing } from '@/theme';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    listContent: { flexGrow: 1, gap: spacing.md, paddingBottom: spacing.lg },
    ayahCard: { borderRadius: radius.lg },
    ayahRow: { flexDirection: 'row', alignItems: 'center' },
    openAyah: { flex: 1, alignItems: 'stretch', padding: spacing.md },
    arabicText: {
      color: theme.text.primary,
      fontSize: 22,
      textAlign: 'right',
      lineHeight: 38,
    },
    ayahCaption: {
      color: theme.text.muted,
      marginTop: spacing.xs,
      textAlign: 'left',
    },
    removeButton: {
      width: 46,
      height: 46,
      marginEnd: spacing.sm,
      borderRadius: radius.md,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
    },
    emptyText: {
      color: theme.text.muted,
      textAlign: 'center',
      marginTop: spacing.md,
    },
  });
