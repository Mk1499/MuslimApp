import { StyleSheet } from 'react-native';

import { spacing, AppTheme, fontSize } from '@/theme';

export default (theme: AppTheme) =>
  StyleSheet.create({
    upperCont: {
      backgroundColor: theme.banner.upperCont,
      padding: spacing.lg,
    },
    headerCont: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    nextPrayerCont: {},
    nextPlayerTime: {
      color: theme.basic.white,
    },
    nextPrayerRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      justifyContent: 'center',
      alignSelf: 'flex-start',
      paddingVertical: spacing.sm,
    },
    nextPrayerTimeText: {
      color: theme.basic.white,
      lineHeight: 24,
    },
    dayDataCont: {},
    hDate: {
      color: theme.basic.white,
      fontSize: fontSize.lg,
      fontWeight: '100',
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
      padding: spacing.md,
      borderRadius: spacing.md,
      alignItems: 'center',
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
    bgImg: { opacity: 0.1, resizeMode: 'cover' },
  });
