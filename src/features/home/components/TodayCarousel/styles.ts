import { AppTheme } from '@/theme';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/constants';
import { StyleSheet } from 'react-native';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      height: 0.28 * SCREEN_HEIGHT,
      justifyContent: 'center',
    },
    itemCont: {
      width: 0.92 * SCREEN_WIDTH,
      height: 0.25 * SCREEN_HEIGHT,
      marginEnd: 3,
      paddingHorizontal: 16,
    },
  });
export default makeStyle;
