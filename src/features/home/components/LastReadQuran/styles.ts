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
      width: '100%',
      alignSelf: 'center',
    },
    lastReadCont: {
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    lastReadData: {},
    lastReadLabel: {
      color: theme.basic.white,
      textAlign: 'left',
    },
    lastReadRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    lastReadIcon: {},
    surahName: {
      color: theme.basic.white,
    },
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
      color: theme.basic.white,
    },
    bgImg: {
      height: 100,
      width: 100,
      resizeMode: 'contain',
    },
  });
