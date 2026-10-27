import { AppTheme, spacing } from '@/theme';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    searchContainer: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
    },
    listContent: {
      flexGrow: 1,
      paddingHorizontal: spacing.sm,
      paddingTop: spacing.md,
      paddingBottom: spacing.xl,
    },
    speakerRow: {
      justifyContent: 'space-around',
      marginBottom: spacing.lg,
    },
    speakerCell: {
      alignItems: 'center',
      width: '33.333%',
    },
    emptyState: {
      flex: 1,
      minHeight: 180,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      color: theme.text.muted,
      textAlign: 'center',
    },
    footerLoader: {
      paddingVertical: spacing.md,
    },
  });
