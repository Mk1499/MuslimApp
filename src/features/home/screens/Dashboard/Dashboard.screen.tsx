import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import {
  AppBottomSheet,
  AppBottomSheetRef,
  AppCard,
  AppGradient,
  AppIcon,
  AppText,
  AppTouchable,
  Screen,
} from '@/components/ui';
import { radius, spacing, useTheme } from '@/theme';
import makeStyle from './styles';

const PRAYER_KEYS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;

export function DashboardScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const sheetRef = useRef<AppBottomSheetRef>(null);
  const styles = makeStyle(theme);

  return (
    <Screen>
      <View style={styles.upperCont}>
        <View style={styles.headerCont}>
          <View style={styles.nextPrayerCont}>
            <AppText
              style={styles.nextPlayerTime}
              color="inverse"
              variant="title"
            >
              05:30 AM
            </AppText>
            <View style={styles.nextPrayerRow}>
              <AppText style={styles.nextPrayerTimeText}>05:30 AM</AppText>
              <AppText style={styles.nextPrayerTimeText}>Fajr</AppText>
            </View>
          </View>
        </View>
      </View>
    </Screen>
  );
}
