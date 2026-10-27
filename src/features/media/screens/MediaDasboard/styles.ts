import { AppTheme, fontFamily, spacing } from '@/theme';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/constants';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    featuredContainer: {
      height: 0.36 * SCREEN_HEIGHT,
    },
    section: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      fontFamily: fontFamily.bold,
      color: theme.text.highlight,
      textAlign: 'left',
    },
    listCont: {
      width: '100%',
    },
    cardCont: {
      width: 0.85 * SCREEN_WIDTH,
      marginHorizontal: spacing.sm,
    },
    speakerCardCont: {
      marginHorizontal: spacing.sm,
    },
    noteCont: {
      backgroundColor: theme.background.brand,
      marginHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: spacing.sm,
      borderWidth: 1,
      borderColor: theme.accent.soft,
    },
    noteText: {
      marginHorizontal: spacing.lg,
      color: theme.basic.white,
      textAlign: 'center',
    },
    sectionHead: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: spacing.md,
      marginBottom: spacing.md,
    },
    clickableText: {
      color: theme.accent.primary,
      textDecorationLine: 'underline',
      fontFamily: fontFamily.bold,
    },
    screenTitle: {
      color: theme.text.highlight,
      textAlign: 'center',
      fontFamily: fontFamily.bold,
    },
  });
