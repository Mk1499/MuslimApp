import { AppTheme, fontFamily } from '@/theme';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      height: '90%',
      paddingHorizontal: 16,
      borderRadius: 8,
      justifyContent: 'space-between',
    },
    basmala: {
      fontSize: 20,
      textAlign: 'center',
      color: theme.accent.soft,
      top: 0,
    },
    aya: {
      flex: 1,
      textAlign: 'center',
      color: theme.basic.white,
      width: '100%',
      fontSize: 26,
    },
    surah: {
      color: theme.accent.soft,
      fontFamily: fontFamily.bold,
      position: 'absolute',
      bottom: 10,
      textAlign: 'right',
      start: 10,
    },
  });
