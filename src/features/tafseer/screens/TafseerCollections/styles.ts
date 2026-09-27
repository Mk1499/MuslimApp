/* eslint-disable prettier/prettier */
import { AppTheme } from '@/theme';
import { StyleSheet } from 'react-native';
const makeStyle = (theme: AppTheme) =>
  StyleSheet.create({
    listCont: {
      flex: 1,
    },
    tafseerHead: {
      alignSelf: 'center',
      borderRadius: 18,
    },
    tafseerBtn: {
      margin: 16,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
    },
    tafseerName: {
      fontSize: 18,
      color: theme.basic.white,
      fontWeight: '600',
    },
    tafseerIcon: {},
    surahListView: {
      marginTop: 16,
      paddingHorizontal: 16,
      flex: 1,
    },
  });
export default makeStyle;
