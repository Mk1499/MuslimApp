import { AppTheme, fontFamily } from '@/theme';
import { SCREEN_HEIGHT } from '@/utils/constants';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      height: '80%',
      paddingHorizontal: 16,
    },
    basmala: {
      fontSize: 20,
      textAlign: 'center',
      color: theme.accent.primary,
      top: 0,
    },
    aya: {
      fontSize: 14,
      textAlign: 'center',
      color: theme.basic.white,
    },
    surah: {
      color: theme.accent.primary,
      fontFamily: fontFamily.bold,
      position: 'absolute',
      bottom: 0,
      textAlign: 'right',
    },
  });
