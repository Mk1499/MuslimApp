import { AppTheme, fontFamily } from '@/theme';
import { SCREEN_HEIGHT } from '@/utils/constants';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      justifyContent: 'center',
      height: 0.15 * SCREEN_HEIGHT,
      paddingHorizontal: 16,
    },
    aya: {
      fontSize: 20,
      textAlign: 'center',
      color: theme.basic.white,
    },
    surah: {
      textAlign: 'right',
      color: theme.accent.primary,
      fontFamily: fontFamily.bold,
    },
  });
