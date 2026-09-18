import { AppTheme, spacing } from '@/theme';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: spacing.sm,
    },
    flatList: {
      flex: 1,
    },
    listContent: {
      gap: spacing.sm,
      paddingBottom: spacing.lg,
    },
    centered: {
      paddingVertical: spacing.xxl,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
