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
    address: {
      textAlign: 'right',
      color: theme.basic.white,
      fontSize: fontSize.lg,
      paddingTop: spacing.lg,
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
      paddingHorizontal: spacing.md,
      borderRadius: spacing.md,
      alignItems: 'center',
      marginBottom: spacing.md,
      minWidth: 72,
      paddingVertical: spacing.xs,
    },
    prayerItemUpcoming: { opacity: 0.62 },
    prayerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    prayerOutcomeEmoji: { fontSize: 13 },
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
    addressCont: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
    },
    prayerSheetContent: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.xl,
    },
    prayerSheetTitle: { color: theme.text.primary },
    prayerSheetSubtitle: {
      color: theme.text.secondary,
      marginTop: spacing.xs,
      marginBottom: spacing.md,
    },
    outcomeOptions: { gap: spacing.sm },
    outcomeTouchable: { alignSelf: 'stretch' },
    outcomeDisabled: { opacity: 0.72 },
    outcomeCard: {
      minHeight: 70,
      borderRadius: spacing.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    outcomeSelected: {
      borderColor: theme.text.brand,
      backgroundColor: theme.status.infoSoft,
    },
    outcomeEmoji: { fontSize: 26 },
    outcomeCopy: { flex: 1 },
    outcomeTitle: { color: theme.text.primary },
    outcomeScore: { color: theme.text.muted, marginTop: 2 },
  });
