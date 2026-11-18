import { AppTheme } from '@/theme';
import { SCREEN_HEIGHT } from '@/utils/constants';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 0.5 * SCREEN_HEIGHT,
    },
    text: {
      fontSize: 24,
      color: theme.text.brand,
      textAlign: 'center',
      marginTop: 8,
    },
    image: {
      width: 120,
      height: 120,
      resizeMode: 'contain',
      marginBottom: 16,
    },
  });
