import { AppTheme, fontFamily } from '@/theme';
import { isRTL } from '@/utils/constants';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    cardCont: {
      marginVertical: 8,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingEnd: 16,
    },
    ayaCont: {
      flex: 10,
    },
    chevronIcon: {
      position: 'absolute',
      left: isRTL ? 'auto' : 0,
      right: isRTL ? 0 : 'auto',
      bottom: 0,
    },
    aya: {
      fontSize: 24,
      fontFamily: fontFamily.uthmani,
    },

    container: {
      flex: 1,
      justifyContent: 'center',
      paddingTop: 24,
    },

    buttonContainer: {
      flex: 1,
      paddingBottom: '1rem',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    parent: {
      width: 200,
    },
    wrapper: {
      width: '100%',
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
    },
    animatedView: {
      width: '100%',
      overflow: 'hidden',
    },
    box: {
      height: 120,
      width: 120,
      color: '#f8f9ff',
      backgroundColor: '#b58df1',
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tafseer: {
      color: theme.accent.tertiary,
      fontSize: 16,
      paddingTop: 8,
    },
  });
