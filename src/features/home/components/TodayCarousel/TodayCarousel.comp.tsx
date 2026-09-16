import { View, Text, FlatList } from 'react-native';
import React from 'react';
import TodayHadith from './TodayHadith/TodayHadith.comp';
import TodayDuaa from './TodayDuaa/TodayDuaa.comp';
import { AppCard } from '@/components/ui/AppCard';
import { AppGradient, AppText } from '@/components/ui';
import TodayAya from './TodayAya/TodayAya.comp';
import makeStyle from './styles';
import { useTheme } from '@/theme';

export default function TodayCarousel() {
  const theme = useTheme();
  const styles = makeStyle(theme);

  function renderItem({ index }: { index: number }) {
    if (index === 0)
      return (
        <View style={styles.itemCont}>
          <TodayAya />
        </View>
      );

    if (index === 1)
      return (
        <View style={styles.itemCont}>
          <TodayHadith />
        </View>
      );
    if (index === 2)
      return (
        <View style={styles.itemCont}>
          <TodayDuaa />
        </View>
      );
  }

  return (
    <AppGradient style={styles.container} colors={theme.gradient.scrim}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={[1, 2, 3]}
        keyExtractor={item => item.toString()}
        renderItem={renderItem}
        pagingEnabled
      />
    </AppGradient>
  );
}
