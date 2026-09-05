/* eslint-disable prettier/prettier */
import { AppTheme } from '@/theme';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/constants';
import { StyleSheet } from 'react-native';
const makeStyle = (themeColors: AppTheme) =>
  StyleSheet.create({
    container: {
      paddingVertical: 16,
      borderRadius: 16,
      marginHorizontal: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 2,
      overflow: 'hidden',
      height: 0.15 * SCREEN_HEIGHT,
      justifyContent: 'center',
    },
    itemCont: {
      width: 0.92 * SCREEN_WIDTH,
      height: 0.15 * SCREEN_HEIGHT,
      marginEnd: 3,
      paddingHorizontal: 16,
    },
  });
export default makeStyle;
