import { View, Text, FlatList } from 'react-native';
import React from 'react';
import { AppCard } from '@/components/ui/AppCard';
import { AppGradient, AppText } from '@/components/ui';
import TodayAya from './TodayAya/TodayAya.comp';
import makeStyle from './styles';
import { useTheme } from '@/theme';

export default function TodayCarousel() {
  const theme = useTheme();
  const styles = makeStyle(theme);

  function renderItem({ item }: { item: number }) {
    return (
      <View style={styles.itemCont}>
        <TodayAya />
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
