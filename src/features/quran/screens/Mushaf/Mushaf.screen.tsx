import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Screen } from '@/components/ui';
import { RouteProp, useRoute } from '@react-navigation/native';
import { QuranStackParamList } from '@/navigation/stacks/quranStack';
import ScreenNames from '@/navigation/screenNames'; // adjust to your actual path
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view';
import MushafPage from '../../components/MushafPage/MushafPage.comp';
import { SCREEN_HEIGHT } from '@/utils/constants';

const TOTAL_MUSHAF_PAGES = 604;
const RENDER_WINDOW = 1; // pages on each side of the current page to keep mounted

/** Clamp a 1-based mushaf page number into the valid [1, TOTAL_MUSHAF_PAGES] range. */
function clampPageNumber(page: number): number {
  return Math.min(Math.max(page, 1), TOTAL_MUSHAF_PAGES);
}

// Isolated + memoized so only the pages whose props actually change re-render.
const PagerItem = React.memo(function PagerItem({
  pageNumber,
  isReady,
}: {
  pageNumber: number;
  isReady: boolean;
}) {
  if (!isReady) {
    return (
      <View style={styles.placeholder}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return <MushafPage pageNumber={pageNumber} />;
});

export default function MushafScreen() {
  const { params } =
    useRoute<RouteProp<QuranStackParamList, typeof ScreenNames.Mushaf>>();
  const { surah } = params;
  const { pages } = surah ?? {};

  const initialPageNumber = clampPageNumber(pages?.[0] ?? 1);
  const [currentPageNumber, setCurrentPageNumber] = useState(initialPageNumber);

  // false لحد ما الـ screen transition/animations تخلص خالص
  const [isContentReady, setIsContentReady] = useState(false);

  useEffect(() => {
    let raf2: number;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setIsContentReady(true);
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, []);

  const allPageNumbers = useMemo(
    () => Array.from({ length: TOTAL_MUSHAF_PAGES }, (_, i) => i + 1),
    [],
  );

  const handlePageSelected = useCallback(
    (event: PagerViewOnPageSelectedEvent) => {
      setCurrentPageNumber(event.nativeEvent.position + 1);
    },
    [],
  );

  return (
    <Screen isInnerPage>
      <PagerView
        style={styles.page}
        pageMargin={16}
        initialPage={initialPageNumber - 1}
        onPageSelected={handlePageSelected}
        testID="mushaf-pager"
        layoutDirection={'rtl'}
      >
        {allPageNumbers.map(pageNumber => {
          const isNearCurrentPage =
            Math.abs(pageNumber - currentPageNumber) <= RENDER_WINDOW;

          return (
            <View key={pageNumber} collapsable={false}>
              {isNearCurrentPage ? (
                <PagerItem pageNumber={pageNumber} isReady={isContentReady} />
              ) : (
                // برّه النافذة: view فاضي بس، عشان نحافظ على ثبات الـ indices
                <View style={styles.placeholder} />
              )}
            </View>
          );
        })}
      </PagerView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: {
    height: SCREEN_HEIGHT * 0.8,
    // backgroundColor: 'gold',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
