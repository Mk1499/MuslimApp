import { View, FlatList } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
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

  const autoplayInterval = 3000; // 3 seconds
  const flatListRef = useRef<FlatList>(null);
  const directionRef = useRef(-1);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeIndexRef.current === 0) {
        directionRef.current = 1;
      }
      if (activeIndexRef.current === 2) {
        directionRef.current = -1;
      }

      flatListRef.current?.scrollToIndex({
        index: activeIndexRef.current + directionRef.current,
        animated: true,
      });
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, []);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      activeIndexRef.current = newIndex;
    }
  }).current;

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
        ref={flatListRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={[1, 2, 3]}
        keyExtractor={item => item.toString()}
        renderItem={renderItem}
        pagingEnabled
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
      />
    </AppGradient>
  );
}
