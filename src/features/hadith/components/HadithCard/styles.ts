/* eslint-disable prettier/prettier */
import { fontFamily } from '@/theme';
import { AppTheme } from '@/theme/colors';
import { SCREEN_WIDTH } from '@/utils/constants';
import { StyleSheet } from 'react-native';

const makeStyle = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginVertical: 8,
    },
    hadithText: {
      fontSize: 18,
      fontFamily: fontFamily.hafs,
    },
    rawyAuthorText: {
      fontSize: 16,
      fontFamily: fontFamily.regular,
      color: theme.accent.soft,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
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
    },
  });
export default makeStyle;
