import { AppTheme, fontFamily, fontSize, radius, spacing } from '@/theme';
import { I18nManager, StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
      alignItems: 'center',
      backgroundColor: theme.card.primary,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: theme.card.border,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.md,
      gap: spacing.md,
      marginVertical: spacing.sm,
      justifyContent: 'space-between',
    },
    pressed: {
      opacity: 0.6,
    },
    badge: {
      width: 40,
      height: 40,
      borderRadius: radius.full,
      backgroundColor: theme.background.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: {
      color: theme.accent.primary,
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.sm,
    },

    arabicName: {
      textAlign: !I18nManager.isRTL ? 'right' : 'left',
    },
    row: {
      flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
      alignItems: 'center',
      gap: spacing.sm,
    },
    meta: {},
    placeCont: {
      alignItems: 'center',
      gap: 1,
    },
    placeImg: {
      width: 30,
      height: 30,
      borderRadius: radius.full,
      opacity: 0.8,
    },
    placeName: {
      fontSize: fontSize.sm,
    },
  });
