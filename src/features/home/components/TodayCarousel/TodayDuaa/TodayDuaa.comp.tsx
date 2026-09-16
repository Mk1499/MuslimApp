import { View } from 'react-native';
import React from 'react';
import { AppText } from '@/components/ui/AppText';
import useRandomData from '@/hooks/queries/useRandomData';
import { useTheme } from '@/theme/ThemeProvider';
import makeStyle from './styles';
import useFormatter from '@/hooks/useFormatter';
import { useTranslation } from 'react-i18next';

export default function TodayDuaa() {
  const { getLocalizedText } = useFormatter();
  const { randomDuaaQuery } = useRandomData();
  const { t } = useTranslation();

  const { data } = randomDuaaQuery;
  const { arabic, transliteration, source } = data?.data ?? {};
  const theme = useTheme();
  const styles = makeStyle(theme);

  return (
    <View style={styles.container}>
      <AppText style={styles.basmala}>{t('home.todayDuaa')}</AppText>
      <AppText style={styles.aya} numberOfLines={4}>
        {getLocalizedText(arabic ?? '', transliteration ?? '')}
      </AppText>
      <AppText style={styles.surah} numberOfLines={1}>
        {source ?? ''}
      </AppText>
    </View>
  );
}
