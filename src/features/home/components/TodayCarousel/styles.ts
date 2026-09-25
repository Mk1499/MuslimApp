import { AppTheme } from '@/theme';
import { isIOS, SCREEN_HEIGHT } from '@/utils/constants';
import { StyleSheet } from 'react-native';
const makeStyle = (themeColors: AppTheme) =>
  StyleSheet.create({
    container: {
      marginHorizontal: 16,
      height: 0.28 * SCREEN_HEIGHT,
      justifyContent: 'center',
    },
    gradientCont: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      paddingTop: !isIOS ? 16 : 0,

      elevation: 2,
      borderRadius: 16,
      height: '100%',
    },
    pager: {
      flex: 1,
      paddingTop: isIOS ? 16 : 0,
    },
    itemCont: {
      flex: 1,
      paddingHorizontal: 16,
    },
    pagination: {
      flex: 0.1,
      flexDirection: 'row',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 10,
      left: 0,
      right: 0,
    },
    dotButton: {
      width: 24,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: themeColors.basic.black,
      opacity: 0.45,
    },
    selectedDot: {
      width: 18,
      opacity: 1,
      backgroundColor: themeColors.accent.primary,
    },
  });
export default makeStyle;
