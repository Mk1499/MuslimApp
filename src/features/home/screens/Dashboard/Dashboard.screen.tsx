import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { AppText, Screen } from '@/components/ui';
import { useTheme } from '@/theme';
import makeStyle from './styles';

export function DashboardScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = makeStyle(theme);

  return (
    <Screen topSafeAreaStyle={styles.safeContainer}>
      <View style={styles.upperCont}>
        <View style={styles.headerCont}>
          <View style={styles.nextPrayerCont}>
            <AppText style={styles.nextPlayerTime} variant="title">
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
