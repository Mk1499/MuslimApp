import { AppTheme } from '@/theme';
import { StyleSheet } from 'react-native';
import { spacing } from '@/theme';

export default (theme: AppTheme) =>
  StyleSheet.create({
    safeContainer: {
      backgroundColor: theme.banner.upperCont,
      display: 'none',
    },
  });
