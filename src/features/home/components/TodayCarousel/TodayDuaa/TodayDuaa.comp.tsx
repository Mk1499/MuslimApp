import { View } from 'react-native';
import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { AppText } from '@/components/ui/AppText';
import useRandomData from '@/hooks/queries/useRandomData';
import { useTheme } from '@/theme/ThemeProvider';
import makeStyle from './styles';
import useFormatter from '@/hooks/useFormatter';
import { useTranslation } from 'react-i18next';
import NetworkFail from '@/components/common/NetworkFail/NetworkFail.comp';

export default function TodayDuaa() {
  const { getLocalizedText } = useFormatter();
  const { randomDuaaQuery } = useRandomData();
  const { t } = useTranslation();
  const { isInternetConnected } = useAppStore();

  const { data } = randomDuaaQuery;
  const { arabic, transliteration, source } = data?.data ?? {};
  const theme = useTheme();
  const styles = makeStyle(theme);

  if (!isInternetConnected)
    return <NetworkFail message={t('appMessages.netReqDuaa')} />;

  return (
    <View style={styles.container}>
      <AppText style={styles.basmala}>{t('home.todayDuaa')}</AppText>
      <AppText style={styles.aya} numberOfLines={3} adjustsFontSizeToFit>
        {getLocalizedText(arabic ?? '', transliteration ?? '')}
      </AppText>
      <AppText style={styles.surah} numberOfLines={1}>
        {source ?? ''}
      </AppText>
      <View />
    </View>
  );
}
