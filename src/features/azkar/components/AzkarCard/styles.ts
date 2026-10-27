import { fontFamily } from '@/theme';
import { AppTheme } from '@/theme/colors';
import { StyleSheet } from 'react-native';

const makeStyle = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginVertical: 8,
    },
    hadithText: {
      fontSize: 20,
      fontFamily: fontFamily.hafs,
    },
    categoryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 10,
    },
    categoryLabel: {
      fontSize: 13,
      fontFamily: fontFamily.medium,
      color: theme.text.muted,
    },
    categoryText: {
      fontSize: 13,
      fontFamily: fontFamily.medium,
      color: theme.text.brand,
    },
    rawyAuthorText: {
      fontSize: 16,
      fontFamily: fontFamily.regular,
      color: theme.accent.primary,
    },
    headerRow: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 8,
    },
    favoriteButton: {
      minWidth: 40,
      minHeight: 40,
      borderRadius: 20,
    },
    patchCont: {
      backgroundColor: theme.accent.soft,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    patchText: {
      fontSize: 14,
      fontFamily: fontFamily.regular,
      color: theme.basic.white,
    },
  });
export default makeStyle;
