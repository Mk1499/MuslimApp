import { View } from 'react-native';
import React from 'react';
import { AppText } from '@/components/ui/AppText';
import { useRandomAya } from '@/hooks/queries/useRandomAya';
import { useTheme } from '@/theme/ThemeProvider';
import makeStyle from './styles';

export default function TodayAya() {
  const { data } = useRandomAya();
  const { surah, verse } = data?.data ?? {};
  const { arabic } = verse ?? {};
  const theme = useTheme();
  const styles = makeStyle(theme);

  return (
    <View style={styles.container}>
      <AppText style={styles.aya} adjustsFontSizeToFit numberOfLines={3}>
        {arabic}
      </AppText>
      <AppText style={styles.surah} adjustsFontSizeToFit numberOfLines={1}>
        {surah?.name_arabic} {verse?.ayah}
      </AppText>
    </View>
  );
}
