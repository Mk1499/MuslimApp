import { AppTheme, spacing } from '@/theme';
import { SCREEN_HEIGHT } from '@/utils/constants';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    safeContainer: {
      backgroundColor: theme.banner.upperCont,
    },
    lastReadCont: {
      marginTop: -0.065 * SCREEN_HEIGHT,
    },
    content: {
      paddingHorizontal: spacing.lg,
    },
    sectionHeader: {
      textAlign: 'left',
    },
    section: {
      marginVertical: spacing.lg,
    },
  });
