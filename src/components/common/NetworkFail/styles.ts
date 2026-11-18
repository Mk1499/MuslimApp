import { AppTheme } from '@/theme';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '40%',
      height: '30%',
      resizeMode: 'contain',
    },
    text: {
      color: theme.text.highlight,
    },
  });
