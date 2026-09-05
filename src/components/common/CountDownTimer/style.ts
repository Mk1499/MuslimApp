import { AppTheme } from '@/theme';
import { I18nManager, StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
    },
    numberText: {
      color: theme.basic.white,
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'right',
    },
    seperator: {
      color: theme.accent.primary,
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'right',
    },
  });
