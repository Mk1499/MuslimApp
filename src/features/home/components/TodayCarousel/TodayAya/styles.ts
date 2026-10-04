import { AppTheme, fontFamily } from '@/theme';
import { SCREEN_HEIGHT } from '@/utils/constants';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      height: '90%',
      paddingHorizontal: 16,
    },
    basmala: {
      fontSize: 20,
      textAlign: 'center',
      color: theme.accent.soft,
      top: 0,
    },
    aya: {
      fontSize: 30,
      textAlign: 'center',
      color: theme.basic.white,
      fontFamily: fontFamily.hafs,
    },
    surah: {
      color: theme.accent.soft,
      fontFamily: fontFamily.bold,
      position: 'absolute',
      bottom: 0,
      textAlign: 'right',
    },
  });
