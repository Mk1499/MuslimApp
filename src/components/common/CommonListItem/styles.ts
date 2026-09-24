import { AppTheme, spacing } from '@/theme';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },
    title: {
      textAlign: 'left',
    },
    subtitle: {
      textAlign: 'left',
      color: theme.text.muted,
    },
    chevron: {},
  });
