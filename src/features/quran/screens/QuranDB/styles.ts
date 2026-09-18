import { AppTheme } from '@/theme';
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
      flex: 1,
      marginTop: 16,
    },
  });
