import { AppTheme } from '@/theme';
import { SCREEN_HEIGHT } from '@/utils/constants';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      width: '100%',
    },
    cover: {
      width: '100%',
      height: 0.25 * SCREEN_HEIGHT,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.accent.primary,
      // flex: 1,
    },
    dataCont: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      // alignItems: 'center',
      gap: 8,
      marginTop: 16,
      // flex: 1,
    },
    title: {
      width: '90%',
    },
    speakerImg: {
      width: 60,
      height: 60,
      borderRadius: 30,
      borderWidth: 1,
      borderColor: theme.accent.primary,
    },
    speakerName: {
      color: theme.text.brand,
    },
    dataRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
    dataItem: {
      alignItems: 'center',
    },
    label: {},
    value: {
      color: theme.text.muted,
    },
    metaItemCont: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
    },
    metaItemText: {
      color: theme.basic.white,
    },
    metaCont: {
      position: 'absolute',
      bottom: 8,
      end: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    infoCont: {
      flex: 1,
    },
  });
