import { AppTheme } from '@/theme';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    container: {},
    screenTitle: {
      textAlign: 'center',
      marginBottom: 16,
    },
    searchInputContainer: {
      marginBottom: 16,
    },
  });
