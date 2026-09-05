import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { AppText, Screen } from '@/components/ui';
import { useTheme } from '@/theme';
import makeStyle from './styles';
import DBBannerComponent from '../../components/DBBanner/DBBanner.comp';
import FastAction from '../../components/FastAction/FastAction.comp';
import TodayCarousel from '../../components/TodayCarousel/TodayCarousel.comp';

export function DashboardScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = makeStyle(theme);

  return (
    <Screen topSafeAreaStyle={styles.safeContainer}>
      <DBBannerComponent />
      <View style={styles.lastReadCont}>
        <TodayCarousel />
      </View>
      <FastAction />
    </Screen>
  );
}
