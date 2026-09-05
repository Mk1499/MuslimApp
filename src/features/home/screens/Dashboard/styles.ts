import { AppTheme } from '@/theme';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    safeContainer: {
      backgroundColor: theme.banner.upperCont,
      display: 'none',
    },
    lastReadCont: {
      marginTop: '-8%',
      paddingHorizontal: 16,
    },
  });
