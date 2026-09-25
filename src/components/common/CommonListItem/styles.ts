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
    dataCont: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    title: {
      textAlign: 'left',
    },
    subtitle: {
      textAlign: 'left',
      color: theme.text.muted,
    },
    chevron: {},
    iconCont: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 40,
      height: 40,
      borderRadius: 5,
      backgroundColor: theme.background.secondary,
      borderWidth: 1,
    },
  });
