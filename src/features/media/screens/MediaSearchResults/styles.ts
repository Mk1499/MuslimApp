import { AppTheme, spacing } from '@/theme';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    searchContainer: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    videoList: {
      flex: 1,
    },
    resultsHeader: {
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
    },
    queryLabel: {
      color: theme.text.muted,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.lg,
    },
    speakersSection: {
      marginBottom: spacing.lg,
    },
    speakerEmptyState: {
      minHeight: 96,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.md,
    },
    sectionTitle: {
      color: theme.text.primary,
      marginHorizontal: spacing.md,
      marginBottom: spacing.md,
    },
    speakerCard: {
      marginHorizontal: spacing.sm,
    },
    videoCard: {
      paddingHorizontal: spacing.md,
      marginBottom: spacing.md,
    },
    emptyState: {
      minHeight: 180,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.lg,
    },
    emptyText: {
      color: theme.text.muted,
      textAlign: 'center',
    },
    footerLoader: {
      paddingVertical: spacing.md,
    },
  });
