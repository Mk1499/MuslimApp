import { StyleSheet } from 'react-native';
import { spacing } from '@/theme';
const makeStyle = () =>
  StyleSheet.create({
    listCont: {
      flex: 1,
    },
    searchInput: {
      marginHorizontal: spacing.lg,
      marginTop: spacing.md,
      marginBottom: spacing.sm,
    },
    emptyMessage: {
      textAlign: 'center',
      marginTop: spacing.xl,
      marginHorizontal: spacing.lg,
    },
  });
export default makeStyle;
