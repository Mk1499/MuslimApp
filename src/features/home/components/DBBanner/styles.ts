import { StyleSheet } from 'react-native';

import { spacing, AppTheme, fontSize } from '@/theme';

export default (theme: AppTheme) =>
  StyleSheet.create({
    upperCont: {},
    headerCont: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    nextPrayerCont: {
      alignItems: 'center',
    },
    nextPrayerLabel: {
      color: theme.basic.white,
      textAlign: 'center',
    },
    nextPlayerTime: {
      color: theme.basic.white,
      textAlign: 'left',
      fontSize: 40,
      fontWeight: 'bold',
    },
    nextPrayerRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      justifyContent: 'center',
      paddingVertical: spacing.sm,
      alignItems: 'center',
    },
    nextPrayerTimeText: {
      color: theme.basic.white,
    },
    dayDataCont: {},
    hDate: {
      color: theme.basic.white,
      fontSize: fontSize.lg,
      fontWeight: '100',
      textAlign: 'right',
      marginTop: spacing.lg,
      marginStart: spacing.md,
    },
    paryersListCont: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: spacing.xxxl,
    },
    prayerItemActive: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    prayerItem: {
      paddingHorizontal: spacing.md,
      borderRadius: spacing.md,
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    prayerName: {
      color: theme.basic.white,
      fontSize: fontSize.lg,
      fontWeight: '100',
    },
    prayerTime: {
      color: theme.basic.white,
      fontSize: fontSize.lg,
    },
    prayerIcon: {},
    bgImg: {
      opacity: 0.1,
      resizeMode: 'stretch',
      width: '110%',
      position: 'absolute',
      bottom: 0,
      top: '-20%',
      alignSelf: 'center',
    },
  });
