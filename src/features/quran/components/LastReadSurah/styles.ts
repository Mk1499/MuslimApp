import { AppTheme } from '@/theme';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      borderRadius: 12,
    },
    dataCont: {
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    surahName: {
      textAlign: 'left',
      color: theme.accent.primary,
    },
    title: {},
    ayah: {},
  });
