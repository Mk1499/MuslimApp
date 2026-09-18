import { AppTheme } from '@/theme';
import { SCREEN_HEIGHT } from '@/utils/constants';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    screenTitle: {
      textAlign: 'center',
      marginBottom: 16,
    },
    searchInputContainer: {
      marginBottom: 16,
    },
    listCont: {
      marginTop: 16,
      marginBottom: 0.15 * SCREEN_HEIGHT,
    },
  });
