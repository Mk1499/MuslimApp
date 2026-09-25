import { AppTheme, spacing } from '@/theme';
import { isAndroid, SCREEN_HEIGHT } from '@/utils/constants';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    safeContainer: {
      backgroundColor: theme.banner.upperCont,
    },
    carouselCont: {
      marginTop: isAndroid ? '-5%' : '-10%',
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
    lastReadCont: {
      marginHorizontal: spacing.lg,
    },
  });
