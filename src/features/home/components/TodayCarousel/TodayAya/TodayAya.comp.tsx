import { View, Text } from 'react-native';
import React from 'react';
import { AppText } from '@/components/ui/AppText';
import { useRandomAya } from '@/hooks/queries/useRandomAya';
import { useTheme } from '@/theme/ThemeProvider';
import makeStyle from './styles';

export default function TodayAya() {
  const { data, isLoading, error } = useRandomAya();
  const { surah, verse } = data?.data ?? {};
  const { arabic } = verse ?? {};
  const theme = useTheme();
  const styles = makeStyle(theme);

  return (
    <View style={styles.container}>
      <AppText style={styles.aya} numberOfLines={3}>
        {arabic}
      </AppText>
      <AppText style={styles.surah}>
        {surah?.name_arabic} {verse?.ayah}
      </AppText>
    </View>
  );
}
