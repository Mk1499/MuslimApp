import { StyleSheet } from 'react-native';
import { spacing } from '@/theme';

export default () =>
  StyleSheet.create({
    dialArea: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.lg,
    },
  });
