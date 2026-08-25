import { AppTheme } from '@/theme';
import { StyleSheet } from 'react-native';
import { radius, spacing } from '@/theme';

export default (theme: AppTheme) =>
  StyleSheet.create({
    upperCont: {
      backgroundColor: theme.banner.upperCont,
      padding: spacing.lg,
    },
    headerCont: {},
    nextPrayerCont: {},
    nextPlayerTime: {},
    nextPrayerRow: {},
    nextPrayerTimeText: {},
  });
