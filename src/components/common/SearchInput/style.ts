import { I18nManager, StyleSheet } from 'react-native';
import { AppTheme, fontFamily, fontSize, radius, spacing } from '@/theme';

export default (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      backgroundColor: theme.background.secondary,
      borderRadius: radius.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      gap: spacing.sm,
      borderWidth: 0.5,
      borderColor: theme.input.border,
    },
    input: {
      flex: 1,
      padding: 0,
      fontFamily: fontFamily.regular,
      fontSize: fontSize.md,
      color: theme.input.text,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
  });
