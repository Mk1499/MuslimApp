import { Pressable, View } from 'react-native';
import React, { useRef, useState } from 'react';
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view';
import TodayHadith from './TodayHadith/TodayHadith.comp';
import TodayDuaa from './TodayDuaa/TodayDuaa.comp';
import { AppGradient, AppText } from '@/components/ui';
import TodayAya from './TodayAya/TodayAya.comp';
import makeStyle from './styles';
import { useTheme } from '@/theme';

const carouselItems = [
  { key: 'aya', Component: TodayAya },
  { key: 'hadith', Component: TodayHadith },
  { key: 'duaa', Component: TodayDuaa },
];

export default function TodayCarousel() {
  const theme = useTheme();
  const styles = makeStyle(theme);
  const pagerRef = useRef<PagerView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function handlePageSelected(event: PagerViewOnPageSelectedEvent) {
    setActiveIndex(event.nativeEvent.position);
  }

  function selectPage(index: number) {
    setActiveIndex(index);
    pagerRef.current?.setPage(index);
  }

  return (
    <View style={styles.container}>
      <AppGradient style={styles.gradientCont} colors={theme.gradient.scrim}>
        <PagerView
          ref={pagerRef}
          style={styles.pager}
          initialPage={0}
          onPageSelected={handlePageSelected}
        >
          {carouselItems.map(({ key, Component }) => (
            <View key={key} style={styles.itemCont} collapsable={false}>
              <Component />
            </View>
          ))}
        </PagerView>

        <View style={styles.pagination}>
          {carouselItems.map(({ key }, index) => {
            const isSelected = index === activeIndex;

            return (
              <Pressable
                key={key}
                style={styles.dotButton}
                onPress={() => selectPage(index)}
                accessibilityRole="button"
                accessibilityLabel={`Select carousel item ${index + 1}`}
                accessibilityState={{ selected: isSelected }}
                hitSlop={4}
              >
                <View style={[styles.dot, isSelected && styles.selectedDot]} />
              </Pressable>
            );
          })}
        </View>
      </AppGradient>
    </View>
  );
}
