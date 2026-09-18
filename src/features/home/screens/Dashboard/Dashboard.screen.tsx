import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { AppText, Screen } from '@/components/ui';
import { useTheme } from '@/theme';
import makeStyle from './styles';
import DBBannerComponent from '../../components/DBBanner/DBBanner.comp';
import LastReadQuran from '../../components/LastReadQuran/LastReadQuran.comp';
import TodayCarousel from '../../components/TodayCarousel/TodayCarousel.comp';
import QuickAccessFeature from '../../components/QuickAccessFeature/QuickAccessFeature.comp';

export function DashboardScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = makeStyle(theme);

  return (
    <Screen topSafeAreaStyle={styles.safeContainer} scroll>
      <DBBannerComponent />
      <View style={styles.carouselCont}>
        <TodayCarousel />
      </View>

      <View style={styles.content}>
        <AppText style={styles.sectionHeader} variant="subtitle">
          {t('home.quickAccess')}
        </AppText>

        <View style={styles.section}>
          <QuickAccessFeature />
        </View>

        <LastReadQuran />
      </View>
    </Screen>
  );
}
