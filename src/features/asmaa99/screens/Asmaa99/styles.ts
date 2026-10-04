import { StyleSheet } from 'react-native';
import { spacing } from '@/theme';

export default () =>
  StyleSheet.create({
    list: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      alignItems: 'center',
    },
  });
