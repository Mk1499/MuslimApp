import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { AppText } from '@/components/ui/AppText';
import useRandomData from '@/hooks/queries/useRandomData';
import { useTheme } from '@/theme/ThemeProvider';
import makeStyle from './styles';
import useFormatter from '@/hooks/useFormatter';
import { useAppStore } from '@/store/useAppStore';
import NetworkFail from '@/components/common/NetworkFail/NetworkFail.comp';

export default function TodayAya() {
  const { getLocalizedText } = useFormatter();
  const { randomAyaQuery } = useRandomData();
  const { isInternetConnected } = useAppStore();
  const { t } = useTranslation();

  const { data } = randomAyaQuery;
  const { surah, verse } = data?.data ?? {};
  const { arabic, ayah } = verse ?? {};
  const theme = useTheme();
  const styles = makeStyle(theme);

  if (!isInternetConnected)
    return <NetworkFail message={t('appMessages.netReqTodayAya')} />;

  return (
    <View style={styles.container}>
      <AppText style={styles.basmala}>{'بسم الله الرحمن الرحيم'}</AppText>
      <AppText style={styles.aya} adjustsFontSizeToFit numberOfLines={3}>
        {arabic}
      </AppText>
      <AppText style={styles.surah} adjustsFontSizeToFit numberOfLines={1}>
        {getLocalizedText(surah?.name_arabic ?? '', surah?.name_english ?? '')}{' '}
        {verse?.ayah}
      </AppText>
      <View />
    </View>
  );
}
