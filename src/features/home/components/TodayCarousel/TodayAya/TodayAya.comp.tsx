import { View } from 'react-native';
import React from 'react';
import { AppText } from '@/components/ui/AppText';
import useRandomData from '@/hooks/queries/useRandomData';
import { useTheme } from '@/theme/ThemeProvider';
import makeStyle from './styles';
import useFormatter from '@/hooks/useFormatter';

export default function TodayAya() {
  const { getLocalizedText } = useFormatter();
  const { randomAyaQuery } = useRandomData();

  const { data } = randomAyaQuery;
  const { surah, verse } = data?.data ?? {};
  const { arabic, ayah } = verse ?? {};
  const theme = useTheme();
  const styles = makeStyle(theme);

  return (
    <View style={styles.container}>
      <AppText style={styles.basmala}>{'بسم الله الرحمن الرحيم'}</AppText>
      <AppText style={styles.aya} adjustsFontSizeToFit numberOfLines={4}>
        {arabic}
      </AppText>
      <AppText style={styles.surah} adjustsFontSizeToFit numberOfLines={1}>
        {getLocalizedText(surah?.name_arabic ?? '', surah?.name_english ?? '')}{' '}
        {verse?.ayah}
      </AppText>
    </View>
  );
}
