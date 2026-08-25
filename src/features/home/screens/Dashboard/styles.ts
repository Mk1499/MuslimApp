import { AppTheme } from '@/theme';
import { StyleSheet } from 'react-native';
import { spacing } from '@/theme';

export default (theme: AppTheme) =>
  StyleSheet.create({
    upperCont: {
      backgroundColor: theme.banner.upperCont,
      padding: spacing.lg,
    },
    safeContainer: {
      backgroundColor: theme.banner.upperCont,
    },
    headerCont: {},
    nextPrayerCont: {},
    nextPlayerTime: {
      color: theme.text.primary,
    },
    nextPrayerRow: {},
    nextPrayerTimeText: {},
  });
