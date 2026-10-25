import { AppTheme, spacing } from '@/theme';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/constants';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    featuredContainer: {
      marginVertical: spacing.lg,
      height: 0.35 * SCREEN_HEIGHT,
    },
    section: {},
    sectionTitle: {
      marginHorizontal: spacing.lg,
    },
    listCont: {
      width: '100%',
    },
    cardCont: {
      width: 0.85 * SCREEN_WIDTH,
      marginHorizontal: spacing.sm,
    },
  });
