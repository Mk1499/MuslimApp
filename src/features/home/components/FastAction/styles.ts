import { AppTheme, radius, spacing } from '@/theme';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.card.primary,
      shadowColor: theme.basic.black,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.25,
      shadowRadius: 1.84,

      elevation: 2,
      borderRadius: radius.sm,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.md,
      width: '90%',
      alignSelf: 'center',
    },
    lastReadCont: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    lastReadData: {},
    lastReadLabel: {
      color: theme.text.secondary,
      textAlign: 'left',
    },
    lastReadRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    lastReadIcon: {},
    surahName: {},
    juzCont: {
      backgroundColor: theme.accent.soft,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.md,
    },
    juzName: {
      color: theme.accent.primary,
    },
    continueBtn: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radius.sm,
      marginTop: spacing.lg,
    },
    continueBtnText: {
      color: theme.button.primaryText,
    },
    bgImg: {
      height: 100,
      width: 100,
      resizeMode: 'contain',
    },
  });
