import { AppTheme, fontFamily } from '@/theme';
import { isRTL } from '@/utils/constants';
import { StyleSheet } from 'react-native';

export default (theme: AppTheme) =>
  StyleSheet.create({
    cardCont: {
      marginVertical: 8,
    },
    header: {
      //   flexDirection: 'row',
      justifyContent: 'space-between',
      paddingEnd: 16,
    },
    ayaCont: {
      flex: 10,
    },
    chevronIcon: {
      alignSelf: isRTL ? 'flex-end' : 'flex-start',
    },
    aya: {
      fontSize: 24,
      fontFamily: fontFamily.hafs,
    },
    ayaNumber: {
      fontSize: 30,
      fontFamily: fontFamily.uthmani,
    },
    similarCont: {
      borderWidth: 0.5,
      borderColor: theme.background.brand,
      borderRadius: 8,
      paddingHorizontal: 8,
      backgroundColor: theme.background.secondary,
      marginVertical: 4,
      paddingVertical: 4,
    },
    similarSurahName: {
      fontSize: 16,
      color: theme.accent.primary,
      marginVertical: 4,
      alignSelf: isRTL ? 'flex-end' : 'flex-start',
    },
    similarAyahsTitle: {
      textAlign: isRTL ? 'right' : 'left',
      fontSize: 18,
      marginVertical: 8,
      color: theme.background.brand,
      fontWeight: 'bold',
    },
  });
