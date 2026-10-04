import { StyleSheet } from 'react-native';
import { radius, spacing, type AppTheme } from '@/theme';

export default (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.xl,
      gap: spacing.sm,
    },
    hint: {
      width: spacing.xxxl,
      height: spacing.xxxl,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.card.secondary,
    },
    message: {
      textAlign: 'center',
    },
    detail: {
      textAlign: 'center',
    },
    retry: {
      marginTop: spacing.md,
    },
  });
