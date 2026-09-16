import { AppTheme, fontFamily } from '@/theme';
import { SCREEN_HEIGHT } from '@/utils/constants';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      height: '80%',
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    basmala: {
      fontSize: 20,
      textAlign: 'center',
      color: theme.accent.primary,
      top: 0,
    },
    aya: {
      flex: 1,
      textAlign: 'center',
      color: theme.basic.white,
      width: '100%',
      fontSize: 12,
      lineHeight: 24,
    },
    surah: {
      color: theme.accent.primary,
      fontFamily: fontFamily.bold,
      position: 'absolute',
      bottom: 0,
      textAlign: 'right',
      start: 10,
      textTransform: 'capitalize',
    },
  });
