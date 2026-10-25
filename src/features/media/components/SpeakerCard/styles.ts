import { AppTheme } from '@/theme';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      width: 90,
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 1,
      borderColor: theme.accent.secondary,
    },
    name: {
      marginTop: 8,
      textAlign: 'center',
    },
  });
