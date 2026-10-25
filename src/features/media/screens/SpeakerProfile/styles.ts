import { AppTheme, fontFamily } from '@/theme';
import { SCREEN_HEIGHT } from '@/utils/constants';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    container: {},
    topSafeAreaStyle: {
      backgroundColor: theme.background.brand,
    },
    backBtn: {
      position: 'absolute',
      top: 16,
      left: 16,
      zIndex: 11,
    },
    bgCover: {
      backgroundColor: theme.background.brand,
      height: 0.15 * SCREEN_HEIGHT,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      position: 'absolute',
      width: '100%',
      // zIndex: -1,
    },
    dataCont: {
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      zIndex: 10,
    },
    image: {
      width: 0.2 * SCREEN_HEIGHT,
      height: 0.2 * SCREEN_HEIGHT,
      borderRadius: 0.1 * SCREEN_HEIGHT,
      borderWidth: 3,
      borderColor: theme.accent.tertiary,
    },
    name: {
      color: theme.text.brand,
    },
    bio: {
      color: theme.text.secondary,
      textAlign: 'center',
      paddingHorizontal: 16,
    },
    metaCont: {
      alignItems: 'center',
    },
    metaTitle: {
      color: theme.text.secondary,
    },
    metaValue: {
      color: theme.text.brand,
    },
    colLine: {
      width: 1,
      backgroundColor: theme.background.primary,
      height: '100%',
    },
    rowCont: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 4,
      gap: 16,
      width: '100%',
      paddingHorizontal: 16,
      backgroundColor: theme.background.secondary,
      paddingVertical: 16,
    },
    segmentCont: {
      paddingVertical: 16,
      backgroundColor: theme.background.secondary,
    },
    viewCont: {
      marginHorizontal: 8,
      height: 0.06 * SCREEN_HEIGHT,
    },
    segmentText: {
      color: theme.text.primary,
      fontFamily: fontFamily.regular,
    },
    activeSegment: {
      color: theme.basic.black,
      fontFamily: fontFamily.bold,
      marginBottom: 8,
    },
    tabBar: {
      backgroundColor: theme.background.primary, // must be opaque, content scrolls under it
    },
    tabIndicator: {
      backgroundColor: theme.accent.secondary,
    },
    tabLabel: {
      fontWeight: '600',
    },

    box: {
      height: 250,
      width: '100%',
    },
    boxA: {
      backgroundColor: 'white',
    },
    boxB: {
      backgroundColor: '#D8D8D8',
    },
    header: {
      height: 250,
      width: '100%',
      backgroundColor: '#2196f3',
    },
  });
