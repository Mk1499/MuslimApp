import { View } from 'react-native';
import React from 'react';
import { AppText } from '@/components/ui/AppText';
import useRandomData from '@/hooks/queries/useRandomData';
import { useTheme } from '@/theme/ThemeProvider';
import makeStyle from './styles';
import useFormatter from '@/hooks/useFormatter';
import { useTranslation } from 'react-i18next';

export default function TodayHadith() {
  const { getLocalizedText } = useFormatter();
  const { randomHadithQuery } = useRandomData();
  const { t, i18n } = useTranslation();

  const { data } = randomHadithQuery;
  const { arabic, english, collection } = data?.data ?? {};
  const theme = useTheme();
  const styles = makeStyle(theme);

  return (
    <View style={styles.container}>
      <AppText style={styles.basmala}>{'قال رسول الله ﷺ'}</AppText>
      <AppText style={styles.aya} numberOfLines={4}>
        {getLocalizedText(arabic ?? '', english ?? '')}
      </AppText>
      <AppText style={styles.surah} numberOfLines={1}>
        {i18n.exists(`hadith.collection.${collection}`)
          ? t(`hadith.collection.${collection}`)
          : collection}
      </AppText>
    </View>
  );
}
